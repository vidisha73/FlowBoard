import { auth } from "@clerk/nextjs";
import connectDB from "./mongodb";
import OrgSubscription from "@/models/OrgSubscription";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  try {
    const authInfo = await auth();
    const { orgId } = authInfo;

    if (!orgId) {
      console.log("No organization ID found in auth context");
      return false;
    }

    await connectDB();
    const orgSubscription = await OrgSubscription.findOne({ orgId }).lean() as any;

    if (!orgSubscription) {
      return false;
    }

    // Convert MongoDB date to regular Date if needed
    const endDate = orgSubscription.stripeCurrentPeriodEnd instanceof Date 
      ? orgSubscription.stripeCurrentPeriodEnd 
      : new Date(orgSubscription.stripeCurrentPeriodEnd);

    const isValid =
      orgSubscription.stripePriceId &&
      endDate.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
};
