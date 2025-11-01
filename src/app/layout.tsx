
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chess Dungeon Crawler",
  description: "Created By Scott Cole",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        />
      </head>
      <html lang="en">
        <body className={`${pressStart2P.variable} font-[var(--font-press-start-2p)]`}>
          {children}
        </body>
      </html>
    </>
  );
}

