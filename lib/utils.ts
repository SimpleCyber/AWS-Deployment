import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type Stripe from "stripe";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAsLicenseKey(str: Stripe.Subscription["id"]): string {
  // Base64 encode using browser API
  const encoded = btoa(str);

  // Split entire string into chunks of 4
  const chunks = encoded.match(/.{1,4}/g) || [];

  return chunks.join("-") as string;
}

export function decodeLicenseKey(
  licenseKey: string
): Stripe.Subscription["id"] {
  // Remove dashes and decode
  return atob(licenseKey.replace(/-/g, "")) as Stripe.Subscription["id"];
}
