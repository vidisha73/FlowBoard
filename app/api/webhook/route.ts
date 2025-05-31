import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import OrgSubscription from "@/models/OrgSubscription";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.orgId) {
        return new NextResponse("Org ID is required", { status: 400 });
      }

      await connectDB();
      await OrgSubscription.create({
        orgId: session.metadata.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await connectDB();
      await OrgSubscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        }
      );
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_HANDLER_ERROR]", error);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
