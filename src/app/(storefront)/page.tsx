import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/mock-data";
import {
  ArrowRight,
  Droplets,
  Gauge,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Sprout,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS = { Droplets, Wrench, Gauge, Sprout } as const;

const trustItems = [
  { icon: Truck, title: "Free Shipping $49+", text: "Fast delivery on qualifying orders" },
  { icon: Headphones, title: "Expert Support", text: "Real irrigation specialists on call" },
  { icon: RotateCcw, title: "60-Day Returns", text: "No-hassle money-back guarantee" },
  { icon: ShieldCheck, title: "Secure Checkout", text: "256-bit encrypted transactions" },
] as const;

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary/60" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />
        <div className="container-page relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm">
              <Droplets className="size-3.5" />
              Professional-grade irrigation equipment
            </div>
            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tight text-balance text-primary-foreground sm:text-5xl lg:text-6xl"
            >
              Water Smarter, Grow Better
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-primary-foreground/80">
              Save up to 70% water with precision drip systems, high-performance pumps, and
              pro-grade parts designed for real farms and gardens.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                nativeButton={false}
                className="gap-2 bg-white text-foreground shadow-lg hover:bg-white/90"
                render={<Link href="/products" />}
              >
                Shop All Products
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                render={<Link href="/products?category=irrigation-kits" />}
              >
                Browse Kits
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="categories-heading">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 id="categories-heading" className="text-2xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find exactly what your irrigation project needs
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const count = getProductsByCategory(cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {count} products
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-16" aria-labelledby="featured-heading">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="featured-heading" className="text-2xl font-bold tracking-tight">
                Popular Products
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Top-rated picks from our customers
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              View all products
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16" aria-label="Why choose AquaFlow">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="bg-gradient-to-r from-primary to-primary/80 py-14 text-primary-foreground"
        aria-labelledby="cta-heading"
      >
        <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 id="cta-heading" className="text-2xl font-bold sm:text-3xl">
              Ready to upgrade your irrigation?
            </h2>
            <p className="mt-2 max-w-xl text-primary-foreground/75">
              Shop {SITE_CONFIG.name} for professional kits, pumps, and parts with clear specs
              and fast checkout.
            </p>
          </div>
          <Button
            size="lg"
            nativeButton={false}
            className="shrink-0 gap-2 bg-white text-foreground shadow-lg hover:bg-white/90"
            render={<Link href="/products" />}
          >
            Start Shopping
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
