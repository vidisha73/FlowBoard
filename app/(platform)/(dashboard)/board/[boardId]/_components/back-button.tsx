"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  orgId: string;
}

export const BackButton = ({ orgId }: BackButtonProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="text-white hover:bg-white/10 transition rounded-full p-2 h-auto mr-1"
    >
      <Link href={`/organization/${orgId}`}>
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span className="text-sm font-medium">Back to boards</span>
      </Link>
    </Button>
  );
}; 