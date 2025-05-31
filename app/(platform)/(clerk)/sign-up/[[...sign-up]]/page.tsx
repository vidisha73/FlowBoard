"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/select-org");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null;

  return <SignUp redirectUrl="/select-org" />;
}
