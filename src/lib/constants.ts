export const SITE_CONFIG = {
  name: "AquaFlow",
  tagline: "Professional Irrigation Solutions",
  description:
    "Premium drip irrigation systems, parts & water pumps for agriculture and landscaping.",
  url: "https://aquaflow.store",
} as const;

export const PRODUCT_CATEGORIES = [
  {
    name: "Irrigation Kits",
    slug: "irrigation-kits",
    description: "Complete drip irrigation systems ready to install",
    icon: "Droplets" as const,
  },
  {
    name: "Parts & Accessories",
    slug: "parts-accessories",
    description: "Fittings, tubing, emitters and replacement parts",
    icon: "Wrench" as const,
  },
  {
    name: "Water Pumps",
    slug: "water-pumps",
    description: "Submersible, centrifugal and booster pumps",
    icon: "Gauge" as const,
  },
  {
    name: "Sprinklers",
    slug: "sprinklers",
    description: "Impact, micro and pop-up sprinkler systems",
    icon: "Sprout" as const,
  },
] as const;

export type CategorySlug = (typeof PRODUCT_CATEGORIES)[number]["slug"];

export const ORDER_STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CONFIRMED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  PROCESSING: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  SHIPPED: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  DELIVERED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  REFUNDED: {
    bg: "bg-neutral-100",
    text: "text-neutral-600",
    dot: "bg-neutral-400",
  },
};

export const PAYMENT_STATUS_STYLES: Record<
  string,
  { bg: string; text: string }
> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700" },
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700" },
  FAILED: { bg: "bg-red-50", text: "text-red-700" },
  REFUNDED: { bg: "bg-neutral-100", text: "text-neutral-600" },
};

export const SHIPMENT_STATUS_STYLES: Record<
  string,
  { bg: string; text: string }
> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700" },
  PICKED_UP: { bg: "bg-blue-50", text: "text-blue-700" },
  IN_TRANSIT: { bg: "bg-indigo-50", text: "text-indigo-700" },
  OUT_FOR_DELIVERY: { bg: "bg-violet-50", text: "text-violet-700" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700" },
  RETURNED: { bg: "bg-red-50", text: "text-red-700" },
};
