"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  // This helps prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until the component has mounted on the client
  // This ensures the client and server renders match
  if (!mounted) {
    return null;
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
