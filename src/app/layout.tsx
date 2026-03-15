import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Stage — AI Speaking Coach",
  description:
    "Practice speaking, get AI feedback, and level up from foundation to world-class presenter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSerif.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
