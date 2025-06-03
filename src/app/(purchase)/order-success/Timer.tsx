"use client";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

function Timer() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);
  return <></>;
}

export default Timer;
