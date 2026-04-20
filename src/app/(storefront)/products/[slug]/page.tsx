"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/storefront/product-card";
import { formatCurrency } from "@/lib/formatters";
import { getProductBySlug, getProductsByCategory } from "@/lib/mock-data";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const items = useCart((s) => s.items);

  const related = useMemo(() => {
    if (!product) return [];
    return getProductsByCategory(product.categorySlug).filter((p) => p.slug !== product.slug).slice(0, 3);
  }, [product]);

  if (!product) {
    notFound();
  }

  const p = product;
  const image = p.images[0] ?? "/products/drip-kit-garden.png";
  const onSale = p.compareAtPrice != null;
  const stockLabel = p.stock <= 0 ? "Out of stock" : p.stock < 20 ? `Only ${p.stock} left` : "In stock";

  function addToCart() {
    const existing = items.find((i) => i.id === p.id);
    if (existing) {
      updateQuantity(p.id, existing.quantity + qty);
    } else {
      addItem({
        id: p.id,
        name: p.name,
        price: p.price,
        image,
        slug: p.slug,
      });
      if (qty > 1) updateQuantity(p.id, qty);
    }
    toast.success(`${p.name} added to cart`);
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/products?category=${p.categorySlug}`} />}>
              {p.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{p.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={image}
            alt={p.name}
            width={600}
            height={600}
            className="size-full object-cover"
            priority
          />
          {onSale ? (
            <Badge className="absolute top-3 left-3" variant="destructive">
              Sale
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{p.brand}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{p.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Stars rating={p.rating} />
              <span className="text-muted-foreground">
                {p.rating.toFixed(1)} ({p.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-semibold">{formatCurrency(p.price)}</span>
            {onSale ? (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(p.compareAtPrice!)}
              </span>
            ) : null}
          </div>

          <p className="text-muted-foreground">{p.shortDescription}</p>

          {!isAdmin && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground" id="qty-label">Qty</span>
            <div className="inline-flex items-center rounded-lg border border-input" role="group" aria-labelledby="qty-label">
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-l-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="flex h-11 min-w-12 items-center justify-center border-x border-input text-sm font-medium tabular-nums" aria-live="polite">{qty}</span>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-r-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          )}

          {!isAdmin && (
          <Button type="button" size="lg" className="w-full sm:w-auto" disabled={p.stock <= 0} onClick={addToCart}>
            Add to Cart
          </Button>
          )}

          <p className="text-sm">
            <span className="font-medium text-foreground">Availability: </span>
            <span className={p.stock <= 0 ? "text-destructive" : "text-muted-foreground"}>{stockLabel}</span>
          </p>

          <Separator />

          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-primary" aria-hidden />
              Free shipping over $49
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              Secure checkout and 60-day returns
            </span>
          </div>
        </div>
      </article>

      <Tabs defaultValue="description" className="mt-14">
        <TabsList variant="line" className="w-full max-w-lg overflow-x-auto">
          <TabsTrigger variant="line" value="description">Description</TabsTrigger>
          <TabsTrigger variant="line" value="specs">Specifications</TabsTrigger>
          <TabsTrigger variant="line" value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {p.description}
        </TabsContent>
        <TabsContent value="specs" className="mt-6 max-w-3xl">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(p.specs).map(([k, v]) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <th
                      scope="row"
                      className="w-1/3 bg-muted/50 px-4 py-3 text-left font-medium text-foreground"
                    >
                      {k}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6 max-w-3xl text-sm text-muted-foreground">
          Reviews will appear here once this storefront is connected to live data.
        </TabsContent>
      </Tabs>

      {related.length ? (
        <section className="mt-16 border-t border-border pt-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-xl font-semibold">
            Related products
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
