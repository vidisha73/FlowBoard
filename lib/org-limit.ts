import { auth } from "@clerk/nextjs";
import connectDB from "./mongodb";
import OrgLimit from "@/models/OrgLimit";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const incrementAvailableCount = async () => {
  const authInfo = await auth();
  const { orgId } = authInfo;

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const orgLimit = await OrgLimit.findOne({ orgId });

  if (orgLimit) {
    await OrgLimit.findOneAndUpdate(
      { orgId },
      { $inc: { count: 1 } }
    );
  } else {
    await OrgLimit.create({ orgId, count: 1 });
  }
};

export const decreaseAvailableCount = async () => {
  const authInfo = await auth();
  const { orgId } = authInfo;

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const orgLimit = await OrgLimit.findOne({ orgId });

  if (orgLimit) {
    await OrgLimit.findOneAndUpdate(
      { orgId },
      { $inc: { count: orgLimit.count > 0 ? -1 : 0 } }
    );
  } else {
    await OrgLimit.create({ orgId, count: 1 });
  }
};

export const hasAvailableCount = async () => {
  const authInfo = await auth();
  const { orgId } = authInfo;

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const orgLimit = await OrgLimit.findOne({ orgId });

  if (!orgLimit) {
    return true; // No limit record exists, so user can create a board
  }

  return orgLimit.count < MAX_FREE_BOARDS;
};

export const getAvailableCount = async () => {
  const authInfo = await auth();
  const { orgId } = authInfo;

  if (!orgId) {
    return 0;
  }

  await connectDB();
  const orgLimit = await OrgLimit.findOne({ orgId });

  if (!orgLimit) {
    return 0;
  }

  return orgLimit.count;
};
