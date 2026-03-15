import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Master",
  description: "Competitor landing page (fictional)",
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
