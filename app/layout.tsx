import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sonner } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Painel Universitário",
  description:
    "Gerencie aulas, horários de ônibus e restaurantes para estudantes universitários",
};

export const viewport: Viewport = {
  themeColor: "#172554",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        {children}
        <Sonner />
      </body>
    </html>
  );
}
