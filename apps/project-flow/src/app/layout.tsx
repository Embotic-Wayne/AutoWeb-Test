import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Flow",
  description: "B2B SaaS landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
