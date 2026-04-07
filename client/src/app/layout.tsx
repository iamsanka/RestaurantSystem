import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./styles/colors.css";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

import HideNavWrapper from "./components/HideNavWrapper";

import "./styles/navbar.css";
import "./styles/cart.css";
import "./styles/checkout.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant System",
  description: "Restaurant ordering system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      <body className="min-h-full flex flex-col">
        <CartProvider>
          <HideNavWrapper />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
