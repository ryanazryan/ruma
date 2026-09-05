import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from '@/components/providers/WishlistProvider'

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ruma",
  description: "A premium multi-brand lifestyle marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${instrumentSans.variable} ${fraunces.variable} min-h-full flex flex-col`}
      >
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  );
}