"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearStaleAuthToken, getValidAuthToken } from "@/lib/auth/token";

/** Sends logged-in visitors from the marketing home page to /community. */
export default function HomeAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (getValidAuthToken()) {
      router.replace("/community");
    } else {
      clearStaleAuthToken();
    }
  }, [router]);

  return null;
}
