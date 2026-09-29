import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberQuant AI — Continuous Cyber Risk Quantification & Investment Optimization",
  description: "FAIR-aligned continuous cyber risk quantification, Monte Carlo Value at Risk (VaR), and capital allocation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#ebd6d1] text-gray-900 antialiased selection:bg-[#0faae6] selection:text-white">
        {children}
      </body>
    </html>
  );
}
