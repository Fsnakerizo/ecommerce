export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  brand: string;
  tags: string[];
  isFeatured: boolean;
  weight: string;
  specs: Record<string, string>;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; avatar?: string };
  status: string;
  paymentStatus: string;
  items: { productId: string; name: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
  createdAt: string;
  status: "active" | "inactive";
}

export const PRODUCTS: MockProduct[] = [
  {
    id: "prod_1",
    name: "Complete Drip Irrigation Kit",
    slug: "complete-drip-irrigation-kit",
    description:
      "Professional-grade drip irrigation kit designed for gardens up to 150 sq ft. Includes mainline tubing, drip emitters, pressure regulator, filter, and all necessary fittings. Easy to install with no special tools required. Saves up to 70% water compared to traditional sprinklers.",
    shortDescription: "All-in-one drip system for gardens up to 150 sq ft.",
    price: 45.99,
    compareAtPrice: 59.99,
    images: ["/products/drip-kit-garden.png"],
    category: "Irrigation Kits",
    categorySlug: "irrigation-kits",
    sku: "AQ-KIT-001",
    stock: 124,
    rating: 4.8,
    reviewCount: 312,
    brand: "AquaFlow",
    tags: ["drip", "kit", "garden", "starter"],
    isFeatured: true,
    weight: "3.2 lbs",
    specs: {
      "Coverage Area": "Up to 150 sq ft",
      "Tubing Length": "50 ft mainline",
      "Emitter Count": "25 adjustable emitters",
      "Water Savings": "Up to 70%",
      "Pressure Range": "15-30 PSI",
    },
  },
  {
    id: "prod_2",
    name: "Adjustable Sprinkler Head Set",
    slug: "adjustable-sprinkler-head-set",
    description:
      "Set of 10 adjustable sprinkler heads with 360° rotation and variable spray patterns. UV-resistant construction for long outdoor life. Compatible with standard 1/2\" risers. Adjustable radius from 15 to 30 feet.",
    shortDescription: "10-pack adjustable 360° sprinkler heads.",
    price: 28.5,
    images: ["/products/sprinkler-kit.png"],
    category: "Sprinklers",
    categorySlug: "sprinklers",
    sku: "AQ-SPR-002",
    stock: 89,
    rating: 4.5,
    reviewCount: 187,
    brand: "AquaFlow",
    tags: ["sprinkler", "adjustable", "lawn"],
    isFeatured: true,
    weight: "1.8 lbs",
    specs: {
      Quantity: "10 heads",
      "Spray Pattern": "Adjustable 0°-360°",
      Radius: "15-30 ft adjustable",
      Connection: '1/2" standard riser',
      Material: "UV-resistant ABS plastic",
    },
  },
  {
    id: "prod_3",
    name: "Submersible Water Pump 1HP",
    slug: "submersible-water-pump-1hp",
    description:
      "Heavy-duty 1HP submersible pump for deep wells and large irrigation systems. Stainless steel construction with thermal overload protection. Maximum flow rate of 1320 GPH with a max head of 200 ft. Energy-efficient motor design.",
    shortDescription: "1HP stainless steel submersible pump, 1320 GPH.",
    price: 189.99,
    compareAtPrice: 229.99,
    images: ["/products/submersible-pump.png"],
    category: "Water Pumps",
    categorySlug: "water-pumps",
    sku: "AQ-PMP-003",
    stock: 34,
    rating: 4.7,
    reviewCount: 95,
    brand: "AquaFlow Pro",
    tags: ["pump", "submersible", "well", "heavy-duty"],
    isFeatured: true,
    weight: "18.5 lbs",
    specs: {
      "Motor Power": "1 HP / 750W",
      "Max Flow Rate": "1,320 GPH",
      "Max Head": "200 ft",
      Material: "304 Stainless Steel",
      "Power Supply": "110V/60Hz",
    },
  },
  {
    id: "prod_4",
    name: "Drip Tape Roll - 1000ft",
    slug: "drip-tape-roll-1000ft",
    description:
      "Commercial-grade drip tape with 8\" emitter spacing and 0.45 GPH flow rate per emitter. 15 mil wall thickness for durability. Ideal for row crops and vegetable gardens. UV stabilized for multi-season use.",
    shortDescription: "1000ft commercial drip tape, 8\" spacing.",
    price: 42.75,
    images: ["/products/drip-kit-row-crop.png"],
    category: "Parts & Accessories",
    categorySlug: "parts-accessories",
    sku: "AQ-DRP-004",
    stock: 267,
    rating: 4.6,
    reviewCount: 143,
    brand: "AquaFlow",
    tags: ["drip tape", "commercial", "row crop"],
    isFeatured: false,
    weight: "8.5 lbs",
    specs: {
      Length: "1,000 ft",
      "Emitter Spacing": '8"',
      "Flow Rate": "0.45 GPH per emitter",
      "Wall Thickness": "15 mil",
      Diameter: '5/8"',
    },
  },
  {
    id: "prod_5",
    name: "Digital Water Timer Controller",
    slug: "digital-water-timer-controller",
    description:
      "Programmable digital water timer with LCD display and dual outlet control. Set up to 16 independent schedules with adjustable duration from 1 minute to 4 hours. Battery-powered for easy installation on any outdoor faucet. Rain delay feature for water conservation.",
    shortDescription: "Dual-outlet digital timer with 16 schedules.",
    price: 62.0,
    compareAtPrice: 74.99,
    images: ["/products/irrigation-timer.png"],
    category: "Parts & Accessories",
    categorySlug: "parts-accessories",
    sku: "AQ-TMR-005",
    stock: 78,
    rating: 4.4,
    reviewCount: 228,
    brand: "AquaFlow",
    tags: ["timer", "digital", "controller", "programmable"],
    isFeatured: true,
    weight: "0.9 lbs",
    specs: {
      Outlets: "2 independent zones",
      Schedules: "Up to 16",
      Duration: "1 min - 4 hours",
      Power: "2x AA batteries (included)",
      Display: "LCD with backlight",
    },
  },
  {
    id: "prod_6",
    name: "Disc Filter - 1\" Inlet",
    slug: "disc-filter-1-inch",
    description:
      'High-performance 1" disc filter for drip irrigation systems. 120 mesh filtration prevents clogging of emitters. Easy-clean design with twist-off housing. Flow rate up to 20 GPM. Essential for well water and municipal supply systems.',
    shortDescription: '1" disc filter, 120 mesh, up to 20 GPM.',
    price: 24.99,
    images: ["/products/disc-filter.png"],
    category: "Parts & Accessories",
    categorySlug: "parts-accessories",
    sku: "AQ-FLT-006",
    stock: 156,
    rating: 4.3,
    reviewCount: 89,
    brand: "AquaFlow",
    tags: ["filter", "disc", "drip irrigation"],
    isFeatured: false,
    weight: "0.6 lbs",
    specs: {
      "Inlet Size": '1" NPT',
      "Mesh Rating": "120 mesh (130 micron)",
      "Max Flow": "20 GPM",
      "Max Pressure": "100 PSI",
      Material: "Reinforced nylon body",
    },
  },
  {
    id: "prod_7",
    name: "Poly Tubing - 1/2\" x 500ft",
    slug: "poly-tubing-half-inch-500ft",
    description:
      'Professional-grade 1/2" polyethylene tubing for mainline drip irrigation. Flexible yet durable with UV protection. Working pressure up to 60 PSI. Compatible with all standard barbed fittings and compression connectors.',
    shortDescription: '500ft 1/2" poly mainline tubing.',
    price: 34.99,
    images: ["/products/poly-tubing.png"],
    category: "Parts & Accessories",
    categorySlug: "parts-accessories",
    sku: "AQ-TUB-007",
    stock: 198,
    rating: 4.7,
    reviewCount: 176,
    brand: "AquaFlow",
    tags: ["tubing", "poly", "mainline"],
    isFeatured: false,
    weight: "12 lbs",
    specs: {
      Length: "500 ft",
      "Outer Diameter": '0.700" (1/2" nominal)',
      "Inner Diameter": '0.600"',
      "Working Pressure": "60 PSI",
      Material: "LDPE with UV stabilizer",
    },
  },
  {
    id: "prod_8",
    name: "Micro Sprinkler Kit - 12 Pack",
    slug: "micro-sprinkler-kit-12-pack",
    description:
      "Set of 12 micro sprinklers with stakes and 1/4\" distribution tubing. Adjustable flow from 0 to 10 GPH per head. Perfect for flower beds, container gardens and shrub areas. Includes 50ft of 1/4\" tubing and barbed tees.",
    shortDescription: "12 micro sprinklers with tubing and stakes.",
    price: 34.99,
    images: ["/products/micro-sprinklers.png"],
    category: "Sprinklers",
    categorySlug: "sprinklers",
    sku: "AQ-MSP-008",
    stock: 112,
    rating: 4.5,
    reviewCount: 134,
    brand: "AquaFlow",
    tags: ["micro sprinkler", "flower bed", "container"],
    isFeatured: false,
    weight: "1.4 lbs",
    specs: {
      Quantity: "12 sprinklers + stakes",
      "Flow Rate": "0-10 GPH adjustable",
      "Tubing Included": '50 ft of 1/4"',
      "Spray Diameter": "3-6 ft",
      "Operating Pressure": "15-30 PSI",
    },
  },
  {
    id: "prod_9",
    name: "Drip Emitter Pack - 100ct",
    slug: "drip-emitter-pack-100",
    description:
      "Pack of 100 pressure-compensating drip emitters (2 GPH). Consistent flow regardless of pressure variations. Self-flushing design resists clogging. Barbed inlet for easy insertion into 1/2\" or 1/4\" tubing.",
    shortDescription: "100 pressure-compensating 2 GPH emitters.",
    price: 18.99,
    images: ["/products/drip-emitters.png"],
    category: "Parts & Accessories",
    categorySlug: "parts-accessories",
    sku: "AQ-EMT-009",
    stock: 340,
    rating: 4.6,
    reviewCount: 201,
    brand: "AquaFlow",
    tags: ["emitter", "drip", "pressure-compensating"],
    isFeatured: false,
    weight: "0.8 lbs",
    specs: {
      Quantity: "100 emitters",
      "Flow Rate": "2 GPH (pressure-compensating)",
      "Pressure Range": "7-45 PSI",
      Inlet: "Barbed for 1/4\" tubing",
      Design: "Self-flushing, anti-clog",
    },
  },
  {
    id: "prod_10",
    name: "Impact Sprinkler on Tripod",
    slug: "impact-sprinkler-tripod",
    description:
      "Heavy-duty brass impact sprinkler mounted on adjustable steel tripod (25-48\" height). Full or partial circle coverage with adjustable arc. Reaches up to 85 ft diameter. Ideal for large lawn and field irrigation.",
    shortDescription: "Brass impact sprinkler on adjustable tripod.",
    price: 54.99,
    images: ["/products/impact-sprinkler.png"],
    category: "Sprinklers",
    categorySlug: "sprinklers",
    sku: "AQ-IMP-010",
    stock: 45,
    rating: 4.8,
    reviewCount: 67,
    brand: "AquaFlow Pro",
    tags: ["impact", "sprinkler", "tripod", "brass"],
    isFeatured: true,
    weight: "5.2 lbs",
    specs: {
      Material: "Brass head, steel tripod",
      "Spray Diameter": "Up to 85 ft",
      "Arc Adjustment": "20°-360°",
      "Tripod Height": "25-48\" adjustable",
      Connection: '3/4" female NPT',
    },
  },
  {
    id: "prod_11",
    name: "Small Garden Drip Kit",
    slug: "small-garden-drip-kit",
    description:
      "Compact drip irrigation starter kit for small gardens, patios and raised beds up to 50 sq ft. Includes 25ft of mainline tubing, 15 adjustable drip emitters, pressure regulator, hose adapter and all fittings needed for a quick install.",
    shortDescription: "Starter drip kit for gardens up to 50 sq ft.",
    price: 29.99,
    images: ["/products/drip-kit-small-garden.png"],
    category: "Irrigation Kits",
    categorySlug: "irrigation-kits",
    sku: "AQ-KIT-011",
    stock: 203,
    rating: 4.4,
    reviewCount: 156,
    brand: "AquaFlow",
    tags: ["drip", "kit", "small garden", "patio", "starter"],
    isFeatured: false,
    weight: "1.8 lbs",
    specs: {
      "Coverage Area": "Up to 50 sq ft",
      "Tubing Length": "25 ft mainline",
      "Emitter Count": "15 adjustable emitters",
      Includes: "Pressure regulator, filter, hose adapter",
      "Setup Time": "~20 minutes",
    },
  },
  {
    id: "prod_12",
    name: "Field Row Crop Drip System",
    slug: "field-row-crop-drip-system",
    description:
      "Commercial-scale drip irrigation system for row crops covering up to 1 acre. Kit includes header assembly, drip tape for 20 rows at 100ft each, filters, pressure regulators and all fittings. Designed for corn, tomato, pepper and similar row crops.",
    shortDescription: "1-acre row crop drip system with full header assembly.",
    price: 349.99,
    compareAtPrice: 419.99,
    images: ["/products/drip-kit-field.png"],
    category: "Irrigation Kits",
    categorySlug: "irrigation-kits",
    sku: "AQ-KIT-012",
    stock: 18,
    rating: 4.9,
    reviewCount: 42,
    brand: "AquaFlow Pro",
    tags: ["commercial", "field", "row crop", "acre"],
    isFeatured: true,
    weight: "45 lbs",
    specs: {
      "Coverage Area": "Up to 1 acre",
      "Row Count": "20 rows × 100 ft",
      "Drip Tape": '5/8" 15-mil, 8" spacing',
      "Header Size": '2" mainline',
      Includes: "Filters, regulators, fittings",
    },
  },
  {
    id: "prod_13",
    name: "Lawn Sprinkler Kit - 4 Zone",
    slug: "lawn-sprinkler-kit-4-zone",
    description:
      "Complete 4-zone pop-up sprinkler system for lawns up to 3,000 sq ft. Includes 16 pop-up spray heads, PVC manifold, 4-zone valve assembly, controller, and all pipe/fittings. Step-by-step installation guide included.",
    shortDescription: "4-zone pop-up sprinkler system for lawns to 3,000 sq ft.",
    price: 189.99,
    images: ["/products/sprinkler-kit-lawn.png"],
    category: "Sprinklers",
    categorySlug: "sprinklers",
    sku: "AQ-SPR-013",
    stock: 27,
    rating: 4.6,
    reviewCount: 83,
    brand: "AquaFlow Pro",
    tags: ["lawn", "sprinkler", "pop-up", "zone"],
    isFeatured: false,
    weight: "22 lbs",
    specs: {
      Zones: "4 independent zones",
      "Spray Heads": "16 pop-up (4\" rise)",
      Coverage: "Up to 3,000 sq ft",
      Controller: "4-zone digital, indoor/outdoor",
      Includes: "All pipe, fittings, valves, wire",
    },
  },
];

export function getProductsByCategory(slug: string): MockProduct[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getFeaturedProducts(): MockProduct[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getProductBySlug(slug: string): MockProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function searchProducts(query: string): MockProduct[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}

// ── Mock orders ──────────────────────────────────────────────────────────────

export const ORDERS: MockOrder[] = [
  {
    id: "ord_1",
    orderNumber: "AQ-10001",
    customer: { name: "Marcus Johnson", email: "marcus@example.com" },
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_1", name: "Complete Drip Irrigation Kit", quantity: 2, price: 45.99, image: "/products/drip-kit-garden.png" },
      { productId: "prod_5", name: "Digital Water Timer Controller", quantity: 1, price: 62.0, image: "/products/irrigation-timer.png" },
    ],
    subtotal: 153.98,
    tax: 12.32,
    shipping: 0,
    discount: 15.0,
    total: 151.3,
    shippingAddress: { firstName: "Marcus", lastName: "Johnson", address1: "742 Evergreen Terrace", city: "Springfield", state: "IL", postalCode: "62704", country: "US" },
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    createdAt: "2026-04-10T14:30:00Z",
    updatedAt: "2026-04-14T09:15:00Z",
  },
  {
    id: "ord_2",
    orderNumber: "AQ-10002",
    customer: { name: "Sarah Chen", email: "sarah.chen@example.com" },
    status: "SHIPPED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_3", name: "Submersible Water Pump 1HP", quantity: 1, price: 189.99, image: "/products/submersible-pump.png" },
    ],
    subtotal: 189.99,
    tax: 15.2,
    shipping: 12.99,
    discount: 0,
    total: 218.18,
    shippingAddress: { firstName: "Sarah", lastName: "Chen", address1: "1600 Pennsylvania Ave", city: "Washington", state: "DC", postalCode: "20500", country: "US" },
    trackingNumber: "9400111899223100001",
    carrier: "USPS",
    createdAt: "2026-04-12T09:45:00Z",
    updatedAt: "2026-04-15T11:30:00Z",
  },
  {
    id: "ord_3",
    orderNumber: "AQ-10003",
    customer: { name: "David Martinez", email: "david.m@example.com" },
    status: "PROCESSING",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_12", name: "Field Row Crop Drip System", quantity: 1, price: 349.99, image: "/products/drip-kit-field.png" },
      { productId: "prod_4", name: "Drip Tape Roll - 1000ft", quantity: 3, price: 42.75, image: "/products/drip-kit-row-crop.png" },
    ],
    subtotal: 478.24,
    tax: 38.26,
    shipping: 0,
    discount: 47.82,
    total: 468.68,
    shippingAddress: { firstName: "David", lastName: "Martinez", address1: "2500 Farm Road 12", city: "Bakersfield", state: "CA", postalCode: "93301", country: "US" },
    createdAt: "2026-04-14T16:20:00Z",
    updatedAt: "2026-04-15T08:00:00Z",
  },
  {
    id: "ord_4",
    orderNumber: "AQ-10004",
    customer: { name: "Emily Roberts", email: "emily.r@example.com" },
    status: "PENDING",
    paymentStatus: "PENDING",
    items: [
      { productId: "prod_11", name: "Small Garden Drip Kit", quantity: 1, price: 29.99, image: "/products/drip-kit-small-garden.png" },
      { productId: "prod_8", name: "Micro Sprinkler Kit - 12 Pack", quantity: 1, price: 34.99, image: "/products/micro-sprinklers.png" },
    ],
    subtotal: 64.98,
    tax: 5.2,
    shipping: 5.99,
    discount: 0,
    total: 76.17,
    shippingAddress: { firstName: "Emily", lastName: "Roberts", address1: "88 Oak Lane", city: "Portland", state: "OR", postalCode: "97201", country: "US" },
    createdAt: "2026-04-16T11:05:00Z",
    updatedAt: "2026-04-16T11:05:00Z",
  },
  {
    id: "ord_5",
    orderNumber: "AQ-10005",
    customer: { name: "James Wilson", email: "james.w@example.com" },
    status: "CONFIRMED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_10", name: "Impact Sprinkler on Tripod", quantity: 2, price: 54.99, image: "/products/impact-sprinkler.png" },
      { productId: "prod_7", name: "Poly Tubing - 1/2\" x 500ft", quantity: 1, price: 34.99, image: "/products/poly-tubing.png" },
    ],
    subtotal: 144.97,
    tax: 11.6,
    shipping: 8.99,
    discount: 0,
    total: 165.56,
    shippingAddress: { firstName: "James", lastName: "Wilson", address1: "456 Ranch Drive", city: "Austin", state: "TX", postalCode: "78701", country: "US" },
    createdAt: "2026-04-15T07:30:00Z",
    updatedAt: "2026-04-15T14:00:00Z",
  },
  {
    id: "ord_6",
    orderNumber: "AQ-10006",
    customer: { name: "Lisa Park", email: "lisa.park@example.com" },
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    items: [
      { productId: "prod_2", name: "Adjustable Sprinkler Head Set", quantity: 3, price: 28.5, image: "/products/sprinkler-kit.png" },
    ],
    subtotal: 85.5,
    tax: 6.84,
    shipping: 5.99,
    discount: 0,
    total: 98.33,
    shippingAddress: { firstName: "Lisa", lastName: "Park", address1: "221 Cherry Blossom Way", city: "San Jose", state: "CA", postalCode: "95101", country: "US" },
    createdAt: "2026-04-08T13:15:00Z",
    updatedAt: "2026-04-09T10:00:00Z",
  },
  {
    id: "ord_7",
    orderNumber: "AQ-10007",
    customer: { name: "Robert Kim", email: "r.kim@example.com" },
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_13", name: "Lawn Sprinkler Kit - 4 Zone", quantity: 1, price: 189.99, image: "/products/sprinkler-kit-lawn.png" },
      { productId: "prod_2", name: "Adjustable Sprinkler Head Set", quantity: 2, price: 28.5, image: "/products/sprinkler-kit.png" },
    ],
    subtotal: 246.99,
    tax: 19.76,
    shipping: 6.99,
    discount: 0,
    total: 273.74,
    shippingAddress: { firstName: "Robert", lastName: "Kim", address1: "910 Cedar Ridge Rd", city: "Denver", state: "CO", postalCode: "80205", country: "US" },
    trackingNumber: "1Z879E031059876543",
    carrier: "UPS",
    createdAt: "2025-12-03T18:22:00Z",
    updatedAt: "2025-12-08T14:10:00Z",
  },
  {
    id: "ord_8",
    orderNumber: "AQ-10008",
    customer: { name: "Amanda Torres", email: "amanda.t@example.com" },
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_12", name: "Field Row Crop Drip System", quantity: 1, price: 349.99, image: "/products/drip-kit-field.png" },
      { productId: "prod_6", name: "Disc Filter - 1\" Inlet", quantity: 1, price: 24.99, image: "/products/disc-filter.png" },
    ],
    subtotal: 374.98,
    tax: 30.0,
    shipping: 0,
    discount: 37.5,
    total: 367.48,
    shippingAddress: { firstName: "Amanda", lastName: "Torres", address1: "1440 Magnolia Blvd", city: "Nashville", state: "TN", postalCode: "37203", country: "US" },
    trackingNumber: "9205590164917312345678",
    carrier: "USPS",
    createdAt: "2025-12-18T11:40:00Z",
    updatedAt: "2025-12-22T16:05:00Z",
  },
  {
    id: "ord_9",
    orderNumber: "AQ-10009",
    customer: { name: "Priya Nair", email: "priya.nair@example.com" },
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_1", name: "Complete Drip Irrigation Kit", quantity: 3, price: 45.99, image: "/products/drip-kit-garden.png" },
      { productId: "prod_9", name: "Drip Emitter Pack - 100ct", quantity: 2, price: 18.99, image: "/products/drip-emitters.png" },
    ],
    subtotal: 175.95,
    tax: 14.08,
    shipping: 5.99,
    discount: 0,
    total: 196.02,
    shippingAddress: { firstName: "Priya", lastName: "Nair", address1: "88 Willow Creek Dr", city: "Columbus", state: "OH", postalCode: "43215", country: "US" },
    trackingNumber: "1Z0V190303109876543",
    carrier: "UPS",
    createdAt: "2026-01-14T09:05:00Z",
    updatedAt: "2026-01-19T13:22:00Z",
  },
  {
    id: "ord_10",
    orderNumber: "AQ-10010",
    customer: { name: "Rebecca Stone", email: "rebecca.stone@example.com" },
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_3", name: "Submersible Water Pump 1HP", quantity: 1, price: 189.99, image: "/products/submersible-pump.png" },
      { productId: "prod_5", name: "Digital Water Timer Controller", quantity: 2, price: 62.0, image: "/products/irrigation-timer.png" },
    ],
    subtotal: 313.99,
    tax: 25.12,
    shipping: 12.99,
    discount: 15.0,
    total: 337.1,
    shippingAddress: { firstName: "Rebecca", lastName: "Stone", address1: "4021 Lakeview Pkwy", city: "Tampa", state: "FL", postalCode: "33607", country: "US" },
    trackingNumber: "9405511899561122334455",
    carrier: "USPS",
    createdAt: "2026-02-04T15:50:00Z",
    updatedAt: "2026-02-09T10:18:00Z",
  },
  {
    id: "ord_11",
    orderNumber: "AQ-10011",
    customer: { name: "Carlos Mendez", email: "carlos.m@example.com" },
    status: "SHIPPED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_11", name: "Small Garden Drip Kit", quantity: 2, price: 29.99, image: "/products/drip-kit-small-garden.png" },
      { productId: "prod_8", name: "Micro Sprinkler Kit - 12 Pack", quantity: 1, price: 34.99, image: "/products/micro-sprinklers.png" },
    ],
    subtotal: 94.97,
    tax: 7.6,
    shipping: 4.99,
    discount: 0,
    total: 107.56,
    shippingAddress: { firstName: "Carlos", lastName: "Mendez", address1: "17 Harbor Pointe Ln", city: "Charleston", state: "SC", postalCode: "29401", country: "US" },
    trackingNumber: "1Z61R0E8034455667788",
    carrier: "UPS",
    createdAt: "2026-03-05T20:15:00Z",
    updatedAt: "2026-03-14T08:45:00Z",
  },
  {
    id: "ord_12",
    orderNumber: "AQ-10012",
    customer: { name: "Grace Okafor", email: "grace.okafor@example.com" },
    status: "SHIPPED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_4", name: "Drip Tape Roll - 1000ft", quantity: 2, price: 42.75, image: "/products/drip-kit-row-crop.png" },
      { productId: "prod_7", name: "Poly Tubing - 1/2\" x 500ft", quantity: 1, price: 34.99, image: "/products/poly-tubing.png" },
    ],
    subtotal: 120.49,
    tax: 9.64,
    shipping: 8.99,
    discount: 6.02,
    total: 133.1,
    shippingAddress: { firstName: "Grace", lastName: "Okafor", address1: "550 Prairie Wind Rd", city: "Omaha", state: "NE", postalCode: "68102", country: "US" },
    trackingNumber: "9200190302556677889900",
    carrier: "USPS",
    createdAt: "2026-03-12T13:28:00Z",
    updatedAt: "2026-03-18T11:02:00Z",
  },
  {
    id: "ord_13",
    orderNumber: "AQ-10013",
    customer: { name: "Omar Haddad", email: "omar.haddad@example.com" },
    status: "SHIPPED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_10", name: "Impact Sprinkler on Tripod", quantity: 1, price: 54.99, image: "/products/impact-sprinkler.png" },
      { productId: "prod_2", name: "Adjustable Sprinkler Head Set", quantity: 1, price: 28.5, image: "/products/sprinkler-kit.png" },
    ],
    subtotal: 83.49,
    tax: 6.68,
    shipping: 0,
    discount: 0,
    total: 90.17,
    shippingAddress: { firstName: "Omar", lastName: "Haddad", address1: "3300 Desert Bloom Ave", city: "Phoenix", state: "AZ", postalCode: "85008", country: "US" },
    trackingNumber: "1Z999AA109876543210",
    carrier: "UPS",
    createdAt: "2026-04-02T10:12:00Z",
    updatedAt: "2026-04-12T09:30:00Z",
  },
  {
    id: "ord_14",
    orderNumber: "AQ-10014",
    customer: { name: "Kevin Walsh", email: "kevin.walsh@example.com" },
    status: "PROCESSING",
    paymentStatus: "COMPLETED",
    items: [{ productId: "prod_13", name: "Lawn Sprinkler Kit - 4 Zone", quantity: 1, price: 189.99, image: "/products/sprinkler-kit-lawn.png" }],
    subtotal: 189.99,
    tax: 15.2,
    shipping: 9.99,
    discount: 0,
    total: 215.18,
    shippingAddress: { firstName: "Kevin", lastName: "Walsh", address1: "275 Maple St", city: "Madison", state: "WI", postalCode: "53703", country: "US" },
    createdAt: "2025-12-22T08:55:00Z",
    updatedAt: "2025-12-23T15:40:00Z",
  },
  {
    id: "ord_15",
    orderNumber: "AQ-10015",
    customer: { name: "Sophie Laurent", email: "sophie.laurent@example.com" },
    status: "PROCESSING",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_5", name: "Digital Water Timer Controller", quantity: 3, price: 62.0, image: "/products/irrigation-timer.png" },
      { productId: "prod_6", name: "Disc Filter - 1\" Inlet", quantity: 2, price: 24.99, image: "/products/disc-filter.png" },
    ],
    subtotal: 235.98,
    tax: 18.88,
    shipping: 6.99,
    discount: 23.6,
    total: 238.25,
    shippingAddress: { firstName: "Sophie", lastName: "Laurent", address1: "19 Rue Garden Ln", city: "New Orleans", state: "LA", postalCode: "70116", country: "US" },
    createdAt: "2026-02-20T17:05:00Z",
    updatedAt: "2026-02-21T09:10:00Z",
  },
  {
    id: "ord_16",
    orderNumber: "AQ-10016",
    customer: { name: "Derek Collins", email: "derek.collins@example.com" },
    status: "PROCESSING",
    paymentStatus: "COMPLETED",
    items: [{ productId: "prod_12", name: "Field Row Crop Drip System", quantity: 1, price: 349.99, image: "/products/drip-kit-field.png" }],
    subtotal: 349.99,
    tax: 28.0,
    shipping: 0,
    discount: 0,
    total: 377.99,
    shippingAddress: { firstName: "Derek", lastName: "Collins", address1: "8800 County Road 14", city: "Lubbock", state: "TX", postalCode: "79401", country: "US" },
    createdAt: "2026-04-11T12:30:00Z",
    updatedAt: "2026-04-11T14:05:00Z",
  },
  {
    id: "ord_17",
    orderNumber: "AQ-10017",
    customer: { name: "Nina Patel", email: "nina.patel@example.com" },
    status: "CONFIRMED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_9", name: "Drip Emitter Pack - 100ct", quantity: 3, price: 18.99, image: "/products/drip-emitters.png" },
      { productId: "prod_8", name: "Micro Sprinkler Kit - 12 Pack", quantity: 1, price: 34.99, image: "/products/micro-sprinklers.png" },
    ],
    subtotal: 91.96,
    tax: 7.36,
    shipping: 5.99,
    discount: 0,
    total: 105.31,
    shippingAddress: { firstName: "Nina", lastName: "Patel", address1: "404 Brickell Bay Dr", city: "Miami", state: "FL", postalCode: "33131", country: "US" },
    createdAt: "2026-01-28T19:45:00Z",
    updatedAt: "2026-01-29T08:00:00Z",
  },
  {
    id: "ord_18",
    orderNumber: "AQ-10018",
    customer: { name: "Tyler Nguyen", email: "tyler.nguyen@example.com" },
    status: "CONFIRMED",
    paymentStatus: "COMPLETED",
    items: [
      { productId: "prod_1", name: "Complete Drip Irrigation Kit", quantity: 1, price: 45.99, image: "/products/drip-kit-garden.png" },
      { productId: "prod_4", name: "Drip Tape Roll - 1000ft", quantity: 1, price: 42.75, image: "/products/drip-kit-row-crop.png" },
      { productId: "prod_7", name: "Poly Tubing - 1/2\" x 500ft", quantity: 1, price: 34.99, image: "/products/poly-tubing.png" },
    ],
    subtotal: 123.73,
    tax: 9.9,
    shipping: 7.99,
    discount: 5.0,
    total: 136.62,
    shippingAddress: { firstName: "Tyler", lastName: "Nguyen", address1: "612 Rainier Ave S", city: "Seattle", state: "WA", postalCode: "98118", country: "US" },
    createdAt: "2026-03-25T14:20:00Z",
    updatedAt: "2026-03-26T10:15:00Z",
  },
  {
    id: "ord_19",
    orderNumber: "AQ-10019",
    customer: { name: "Carlos Mendez", email: "carlos.m@example.com" },
    status: "PENDING",
    paymentStatus: "PENDING",
    items: [{ productId: "prod_11", name: "Small Garden Drip Kit", quantity: 1, price: 29.99, image: "/products/drip-kit-small-garden.png" }],
    subtotal: 29.99,
    tax: 2.4,
    shipping: 5.99,
    discount: 0,
    total: 38.38,
    shippingAddress: { firstName: "Carlos", lastName: "Mendez", address1: "17 Harbor Pointe Ln", city: "Charleston", state: "SC", postalCode: "29401", country: "US" },
    createdAt: "2026-04-18T16:40:00Z",
    updatedAt: "2026-04-18T16:40:00Z",
  },
  {
    id: "ord_20",
    orderNumber: "AQ-10020",
    customer: { name: "Miguel Alvarez", email: "miguel.a@example.com" },
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    items: [
      { productId: "prod_8", name: "Micro Sprinkler Kit - 12 Pack", quantity: 2, price: 34.99, image: "/products/micro-sprinklers.png" },
      { productId: "prod_9", name: "Drip Emitter Pack - 100ct", quantity: 1, price: 18.99, image: "/products/drip-emitters.png" },
    ],
    subtotal: 88.97,
    tax: 7.12,
    shipping: 6.99,
    discount: 0,
    total: 103.08,
    shippingAddress: { firstName: "Miguel", lastName: "Alvarez", address1: "955 Industrial Pkwy", city: "Cleveland", state: "OH", postalCode: "44114", country: "US" },
    createdAt: "2026-04-19T09:00:00Z",
    updatedAt: "2026-04-19T11:30:00Z",
  },
];

export const CUSTOMERS: MockCustomer[] = [
  { id: "cust_1", name: "Marcus Johnson", email: "marcus@example.com", phone: "+1-555-0101", totalOrders: 8, totalSpent: 1245.6, lastOrder: "2026-04-10", createdAt: "2025-11-15", status: "active" },
  { id: "cust_2", name: "Sarah Chen", email: "sarah.chen@example.com", phone: "+1-555-0102", totalOrders: 3, totalSpent: 489.5, lastOrder: "2026-04-12", createdAt: "2026-01-20", status: "active" },
  { id: "cust_3", name: "David Martinez", email: "david.m@example.com", phone: "+1-555-0103", totalOrders: 12, totalSpent: 3892.4, lastOrder: "2026-04-14", createdAt: "2025-06-10", status: "active" },
  { id: "cust_4", name: "Emily Roberts", email: "emily.r@example.com", totalOrders: 1, totalSpent: 76.17, lastOrder: "2026-04-16", createdAt: "2026-04-16", status: "active" },
  { id: "cust_5", name: "James Wilson", email: "james.w@example.com", phone: "+1-555-0105", totalOrders: 5, totalSpent: 876.3, lastOrder: "2026-04-15", createdAt: "2025-09-01", status: "active" },
  { id: "cust_6", name: "Lisa Park", email: "lisa.park@example.com", phone: "+1-555-0106", totalOrders: 2, totalSpent: 198.66, lastOrder: "2026-04-08", createdAt: "2026-02-14", status: "inactive" },
  { id: "cust_7", name: "Robert Kim", email: "r.kim@example.com", totalOrders: 6, totalSpent: 1567.2, lastOrder: "2026-03-28", createdAt: "2025-08-05", status: "active" },
  { id: "cust_8", name: "Amanda Torres", email: "amanda.t@example.com", phone: "+1-555-0108", totalOrders: 4, totalSpent: 654.8, lastOrder: "2026-04-02", createdAt: "2025-12-01", status: "active" },
  { id: "cust_9", name: "Priya Nair", email: "priya.nair@example.com", phone: "+1-555-0110", totalOrders: 11, totalSpent: 3240.5, lastOrder: "2026-01-14", createdAt: "2025-07-12", status: "active" },
  { id: "cust_10", name: "Carlos Mendez", email: "carlos.m@example.com", totalOrders: 2, totalSpent: 145.94, lastOrder: "2026-04-18", createdAt: "2026-03-01", status: "active" },
  { id: "cust_11", name: "Hannah Brooks", email: "hannah.brooks@example.com", phone: "+1-555-0120", totalOrders: 7, totalSpent: 1290.4, lastOrder: "2026-02-18", createdAt: "2025-09-22", status: "active" },
  { id: "cust_12", name: "Tyler Nguyen", email: "tyler.nguyen@example.com", totalOrders: 3, totalSpent: 420.15, lastOrder: "2026-03-25", createdAt: "2025-05-14", status: "inactive" },
  { id: "cust_13", name: "Rebecca Stone", email: "rebecca.stone@example.com", totalOrders: 15, totalSpent: 4890.2, lastOrder: "2026-02-04", createdAt: "2025-05-20", status: "active" },
  { id: "cust_14", name: "Miguel Alvarez", email: "miguel.a@example.com", phone: "+1-555-0123", totalOrders: 2, totalSpent: 156.0, lastOrder: "2026-04-19", createdAt: "2026-01-02", status: "active" },
  { id: "cust_15", name: "Grace Okafor", email: "grace.okafor@example.com", totalOrders: 9, totalSpent: 2100.75, lastOrder: "2026-03-12", createdAt: "2025-08-30", status: "active" },
  { id: "cust_16", name: "Kevin Walsh", email: "kevin.walsh@example.com", totalOrders: 4, totalSpent: 980.1, lastOrder: "2025-12-22", createdAt: "2025-06-18", status: "active" },
  { id: "cust_17", name: "Nina Patel", email: "nina.patel@example.com", totalOrders: 1, totalSpent: 105.31, lastOrder: "2026-01-28", createdAt: "2025-10-01", status: "inactive" },
  { id: "cust_18", name: "Omar Haddad", email: "omar.haddad@example.com", phone: "+1-555-0128", totalOrders: 6, totalSpent: 1750.9, lastOrder: "2026-04-02", createdAt: "2025-07-05", status: "active" },
  { id: "cust_19", name: "Sophie Laurent", email: "sophie.laurent@example.com", totalOrders: 5, totalSpent: 890.55, lastOrder: "2026-02-20", createdAt: "2025-11-11", status: "active" },
  { id: "cust_20", name: "Derek Collins", email: "derek.collins@example.com", totalOrders: 8, totalSpent: 2650.0, lastOrder: "2026-04-11", createdAt: "2025-05-28", status: "active" },
];

// ── Dashboard stats ──────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
  totalRevenue: 44980,
  revenueChange: 12.5,
  totalOrders: 248,
  ordersChange: 8.3,
  totalCustomers: 142,
  customersChange: 15.2,
  avgOrderValue: 181,
  aovChange: -2.1,
};

export const REVENUE_CHART_DATA = [
  { month: "May '25", revenue: 2480 },
  { month: "Jun '25", revenue: 2620 },
  { month: "Jul '25", revenue: 2760 },
  { month: "Aug '25", revenue: 2920 },
  { month: "Sep '25", revenue: 3180 },
  { month: "Oct '25", revenue: 3380 },
  { month: "Nov '25", revenue: 3680 },
  { month: "Dec '25", revenue: 3920 },
  { month: "Jan '26", revenue: 4320 },
  { month: "Feb '26", revenue: 4680 },
  { month: "Mar '26", revenue: 5180 },
  { month: "Apr '26", revenue: 5860 },
];

export const TOP_PRODUCTS_DATA = [
  { name: "Complete Drip Irrigation Kit", revenue: 11382.5, sold: 248, image: "/products/drip-kit-garden.png" },
  { name: "Submersible Water Pump 1HP", revenue: 9927.0, sold: 52, image: "/products/submersible-pump.png" },
  { name: "Field Row Crop Drip System", revenue: 8662.2, sold: 25, image: "/products/drip-kit-field.png" },
  { name: "Digital Water Timer Controller", revenue: 6820.0, sold: 110, image: "/products/irrigation-timer.png" },
  { name: "Impact Sprinkler on Tripod", revenue: 4536.7, sold: 83, image: "/products/impact-sprinkler.png" },
];
