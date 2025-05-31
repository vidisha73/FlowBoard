import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-2xl font-bold">Select an organization</h1>
        <p className="text-muted-foreground text-sm">
          Choose an organization to continue to FlowBoard or create a new one
        </p>
      </div>
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
    </div>
  );
}
