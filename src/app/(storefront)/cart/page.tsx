"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeSubtotal = mounted ? subtotal() : 0;
  const shipping = safeSubtotal > 0 && safeSubtotal < 49 ? 8.99 : 0;
  const tax = safeSubtotal * 0.08;
  const total = safeSubtotal + shipping + tax;

  if (!mounted) {
    return (
      <div className="container-page py-12">
        <div className="h-8 max-w-xs animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="mb-4 size-12 text-muted-foreground" aria-hidden />
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Browse irrigation kits, pumps, and parts—then add what you need here.
        </p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/products" />}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Shopping Cart</h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="py-0" size="sm">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="size-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-lg border border-input" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button
                        type="button"
                        className="flex size-10 items-center justify-center rounded-l-lg text-base transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span className="flex size-10 items-center justify-center border-x border-input text-sm font-medium tabular-nums" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        className="flex size-10 items-center justify-center rounded-r-lg text-base transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="min-h-[44px] text-destructive" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name} from cart`}>
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="text-right sm:min-w-[100px]">
                  <p className="text-sm text-muted-foreground">Line total</p>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="ghost" className="px-0" nativeButton={false} render={<Link href="/products" />}>
            ← Continue Shopping
          </Button>
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(safeSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping (est.)</span>
                <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (est.)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" nativeButton={false} render={<Link href="/checkout" />}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
