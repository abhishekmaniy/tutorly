'use client'

import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <SignIn />
    </div>
  );
};

export default Page;