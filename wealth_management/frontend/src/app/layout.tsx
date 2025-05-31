import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { GlobalUI } from "@/components/layout/GlobalUI";
import { DataProvider } from "@/components/providers/DataProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wealth Management Wizard",
  description: "Manage your financial assets and track your wealth growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <DataProvider>
          <SessionProvider>
            <ThemeProvider>
              <CurrencyProvider>
                <LanguageProvider>
                  <GlobalUI />
                  {children}
                </LanguageProvider>
              </CurrencyProvider>
            </ThemeProvider>
          </SessionProvider>
        </DataProvider>
      </body>
    </html>
  );
}
