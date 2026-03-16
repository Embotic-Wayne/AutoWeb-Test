import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ViewModeProvider } from "./context/ViewModeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowledgeable – Learn without limits, grow without boundaries",
  description:
    "Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ViewModeProvider>{children}</ViewModeProvider>
      </body>
    </html>
  );
}
