"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import type { MockProduct } from "@/lib/mock-data";
import { useCart } from "@/hooks/use-cart";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-xs">{i < full ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export function ProductCard({ product }: { product: MockProduct }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const addItem = useCart((s) => s.addItem);
  const image = product.images[0] ?? "/products/drip-kit-garden.png";
  const onSale = product.compareAtPrice != null;
  const discount = onSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={product.name}
            width={400}
            height={400}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {onSale && (
            <Badge className="absolute top-2.5 left-2.5 shadow-sm" variant="destructive">
              −{discount}%
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-1">
            <span className="text-lg font-bold tracking-tight">{formatCurrency(product.price)}</span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
      {!isAdmin && (
        <div className="border-t border-border/60 p-3">
          <Button
            type="button"
            size="sm"
            className="w-full gap-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image,
                slug: product.slug,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="size-3.5" />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
}
