"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // After hydration, we can safely check if we're authenticated
    setIsLoading(false);
    setIsMounted(true);
  }, []);

  // Wait for client-side hydration
  if (!isMounted) {
    return null;
  }

  // Show a loading indicator while checking the session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
