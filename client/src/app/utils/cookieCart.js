"use client";

import Cookies from "js-cookie";

const CART_COOKIE = "restaurant_cart";

// Read cart from cookie
export function getCartCookie() {
  try {
    const raw = Cookies.get(CART_COOKIE);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse cart cookie:", err);
    return [];
  }
}

// Save cart to cookie
export function setCartCookie(cart) {
  try {
    Cookies.set(CART_COOKIE, JSON.stringify(cart), {
      expires: 7, // keep cart for 7 days
      sameSite: "Lax",
      secure: true,
    });
  } catch (err) {
    console.error("Failed to set cart cookie:", err);
  }
}

// Clear cart cookie
export function clearCartCookie() {
  Cookies.remove(CART_COOKIE);
}
