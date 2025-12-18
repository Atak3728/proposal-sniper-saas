import type { Metadata } from "next";
import { Spline_Sans } from "next/font/google";
import "./globals.css";

const splineSans = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-spline-sans",
});

export const metadata: Metadata = {
  title: "Proposal Sniper",
  description: "Get Hired Faster with AI-Precision Proposals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${splineSans.variable} font-sans bg-background text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
