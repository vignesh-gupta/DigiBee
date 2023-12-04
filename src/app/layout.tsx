import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/Navbar";
import TrpcProvider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("relative h-full font-sans antialiased")}>
        <main className="relative flex flex-col min-h-screen">
          <TrpcProvider>
            <Navbar />
            <div className="flex-1 grow">{children}</div>
          </TrpcProvider>
        </main>
      </body>
    </html>
  );
}
