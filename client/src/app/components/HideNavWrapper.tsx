"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";

export default function HideNavWrapper() {
  const pathname = usePathname();

  const hideNav =
    pathname.startsWith("/admin") || pathname.startsWith("/staff");

  if (hideNav) return null;

  return (
    <>
      <Navbar />
      <CartSidebar />
    </>
  );
}
