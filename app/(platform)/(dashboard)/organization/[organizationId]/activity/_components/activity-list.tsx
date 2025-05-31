import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AuditLog from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";

export const ActivityList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  await connectDB();
  const auditLogs = await AuditLog.find({ orgId }).sort({ createdAt: "desc" });
  console.log("Audit Logs:", auditLogs);

  return (
    <div key="activity-list" className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {auditLogs.map((log, index) => (
        <ActivityItem key={(log._id as any).toString()} data={log} />
      ))}
    </div>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <div key="activity-list-skeleton" className="space-y-4 mt-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <Skeleton key={`skeleton-${index}`} className="w-[80%] h-14" />
      ))}
    </div>
  );
};
