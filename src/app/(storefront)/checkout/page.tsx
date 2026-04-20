"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BadgeCheck, Lock, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State / region is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal);
  const clearCart = useCart((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const safeSubtotal = mounted ? subtotal() : 0;
  const shipping = safeSubtotal > 0 && safeSubtotal < 49 ? 8.99 : 0;
  const tax = safeSubtotal * 0.08;
  const total = safeSubtotal + shipping + tax;

  const watched = form.watch();
  const filledCount = useMemo(() => {
    const vals: string[] = [
      watched.firstName,
      watched.lastName,
      watched.email,
      watched.address,
      watched.city,
      watched.state,
      watched.zip,
    ];
    return vals.filter((x) => x && String(x).trim().length > 0).length;
  }, [watched]);

  const step = form.formState.isValid ? 3 : filledCount >= 4 ? 2 : 1;

  if (!mounted) {
    return (
      <div className="container-page py-12">
        <div className="h-8 max-w-md animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" nativeButton={false} render={<Link href="/products" />}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  function onSubmit() {
    const orderNumber = `AQ-${String(Math.floor(10000 + Math.random() * 90000))}`;
    clearCart();
    toast.success("Order placed successfully.");
    router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
  }

  return (
    <div className="container-page py-8">
      <nav aria-label="Checkout progress" className="mb-10">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {(["Shipping", "Payment", "Review"] as const).map((label, i) => {
            const n = i + 1;
            const active = step >= n;
            return (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border-2 border-muted-foreground/20 bg-background text-muted-foreground"
                    )}
                  >
                    {n}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="mx-2 mb-5 h-0.5 flex-1 rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full bg-primary transition-all duration-300",
                        step > n ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Checkout</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Guest checkout — no account required. We only use your details to ship this order.
          </p>

          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-1">
                  <Label htmlFor="co-first">First name</Label>
                  <Input id="co-first" autoComplete="given-name" aria-invalid={Boolean(form.formState.errors.firstName)} {...form.register("firstName")} />
                  {form.formState.errors.firstName ? (
                    <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <Label htmlFor="co-last">Last name</Label>
                  <Input id="co-last" autoComplete="family-name" aria-invalid={Boolean(form.formState.errors.lastName)} {...form.register("lastName")} />
                  {form.formState.errors.lastName ? (
                    <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="co-email">Email</Label>
                  <Input
                    id="co-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(form.formState.errors.email)}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email ? (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="co-address">Address</Label>
                  <Input id="co-address" autoComplete="street-address" aria-invalid={Boolean(form.formState.errors.address)} {...form.register("address")} />
                  {form.formState.errors.address ? (
                    <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5 sm:col-span-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="co-city">City</Label>
                    <Input id="co-city" autoComplete="address-level2" aria-invalid={Boolean(form.formState.errors.city)} {...form.register("city")} />
                    {form.formState.errors.city ? (
                      <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="co-state">State</Label>
                    <Input id="co-state" autoComplete="address-level1" aria-invalid={Boolean(form.formState.errors.state)} {...form.register("state")} />
                    {form.formState.errors.state ? (
                      <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="co-zip">ZIP</Label>
                    <Input id="co-zip" autoComplete="postal-code" inputMode="numeric" aria-invalid={Boolean(form.formState.errors.zip)} {...form.register("zip")} />
                    {form.formState.errors.zip ? (
                      <p className="text-xs text-destructive">{form.formState.errors.zip.message}</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  No card is charged in this storefront preview—submitting confirms your shipping details only.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Lock className="size-4 text-primary" aria-hidden />
                    SSL encrypted
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Shield className="size-4 text-primary" aria-hidden />
                    Money-back guarantee
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="size-4 text-primary" aria-hidden />
                    Secure checkout
                  </span>
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!form.formState.isValid}>
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <aside>
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.image} alt={item.name} width={400} height={400} className="size-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-medium leading-snug">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(safeSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
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
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" nativeButton={false} render={<Link href="/cart" />}>
                Back to cart
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
