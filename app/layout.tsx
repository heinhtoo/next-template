import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { getServerSession } from "next-auth";
import { authOptions, isInternal } from "@/lib/authHelper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (isInternal(session)) {
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
