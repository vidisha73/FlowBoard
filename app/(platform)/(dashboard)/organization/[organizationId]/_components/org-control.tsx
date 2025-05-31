"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";

export const OrgControl = () => {
  const params = useParams();
  const router = useRouter();
  const { setActive, isLoaded: isOrganizationListLoaded } = useOrganizationList();
  const { organization, isLoaded: isOrganizationLoaded } = useOrganization();

  useEffect(() => {
    if (!isOrganizationListLoaded || !isOrganizationLoaded) return;

    // If organization ID in URL doesn't match current org, try to set it
    if (params.organizationId && params.organizationId !== organization?.id) {
      try {
        setActive({ organization: params.organizationId as string });
      } catch (error) {
        console.error("Failed to set organization:", error);
        router.push("/select-org");
      }
    }
  }, [
    isOrganizationListLoaded, 
    isOrganizationLoaded, 
    setActive, 
    params.organizationId, 
    organization?.id,
    router
  ]);

  return null;
};
