"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

const supportLinks = [
  { href: "/products", label: "FAQ" },
  { href: "/products", label: "Shipping" },
  { href: "/products", label: "Returns" },
  { href: "/products", label: "Contact" },
];

const companyLinks = [
  { href: "/products", label: "About" },
  { href: "/products", label: "Blog" },
  { href: "/products", label: "Careers" },
];

export function StorefrontFooter() {
  const [email, setEmail] = React.useState("");

  function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You are subscribed", { description: trimmed });
    setEmail("");
  }

  return (
    <footer className="border-t border-border bg-muted/30" role="contentinfo">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">Shop</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/products"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                All products
              </Link>
            </li>
            {PRODUCT_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">Support</h2>
          <ul className="space-y-2 text-sm">
            {supportLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">Company</h2>
          <ul className="space-y-2 text-sm">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">Newsletter</h2>
          <p className="text-sm text-muted-foreground">
            Irrigation tips, new arrivals, and seasonal offers.
          </p>
          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={onSubscribe} noValidate>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="footer-email" className="sr-only">
                Email
              </Label>
              <Input
                id="footer-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <Separator />
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
        <p>Visa · Mastercard · Amex · PayPal — secure checkout</p>
      </div>
    </footer>
  );
}
