"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface InfoProps {
  isPro: boolean;
}

export const Info = ({ isPro }: InfoProps) => {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !organization) {
      router.push("/select-org");
    }
  }, [isLoaded, organization, router]);

  if (!isLoaded) {
    return <Info.Skeleton />;
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <p className="text-muted-foreground">No organization selected</p>
        <Button onClick={() => router.push("/select-org")}>
          Select an organization
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Image
          fill
          sizes="60px"
          src={organization?.imageUrl!}
          alt="Organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-xl">{organization?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3 mr-1" />
          {isPro ? "Pro" : "Free"}
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  );
};
