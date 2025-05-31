"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import OrgSubscription from "@/models/OrgSubscription";
import { createSafeAction } from "@/lib/create-safe-action";

import { StripeRedirect } from "./schema";
import { InputType, ReturnType } from "./types";

import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  try {
    await connectDB();
    const orgSubscription = await OrgSubscription.findOne({ orgId });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return { data: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "FlowBoard Pro",
              description: "Unlimited boards for your organization",
            },
            unit_amount: 50000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        orgId,
      },
    });

    if (!stripeSession.url) {
      return {
        error: "Failed to create checkout session",
      };
    }

    return { data: stripeSession.url };
  } catch (error) {
    console.error("[STRIPE_REDIRECT_ERROR]", error);
    return {
      error: "Something went wrong!",
    };
  }
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
