"use client";

import * as React from "react";
import {
  Bell,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SECTIONS = [
  { id: "general", label: "General", icon: Store },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function AdminSettingsPage() {
  const [active, setActive] = React.useState<SectionId>("general");

  const [storeName, setStoreName] = React.useState(SITE_CONFIG.name);
  const [email, setEmail] = React.useState("hello@aquaflow.store");
  const [phone, setPhone] = React.useState("+1 (555) 010-0200");
  const [address, setAddress] = React.useState("1200 Irrigation Way, Fresno, CA 93721");
  const [currency, setCurrency] = React.useState("USD");
  const [timezone, setTimezone] = React.useState("America/Los_Angeles");

  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});

  function scrollToSection(id: SectionId) {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(section.id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Store configuration and integrations</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar nav — desktop */}
        <nav
          className="sticky top-20 hidden h-fit w-48 shrink-0 lg:block"
          aria-label="Settings sections"
        >
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active === s.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <s.icon className="size-4 shrink-0" aria-hidden />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile nav — horizontal scroll */}
        <div className="sticky top-14 z-20 -mx-6 mb-2 border-b bg-card/95 px-6 backdrop-blur lg:hidden">
          <nav className="-mb-px flex gap-1 overflow-x-auto py-1" aria-label="Settings sections">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  active === s.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <s.icon className="size-3.5" aria-hidden />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* General */}
          <section
            ref={(el) => { sectionRefs.current.general = el; }}
            id="settings-general"
            aria-labelledby="settings-general-title"
          >
            <Card>
              <CardHeader>
                <CardTitle id="settings-general-title" className="flex items-center gap-2">
                  <Store className="size-5 text-primary" aria-hidden />
                  General
                </CardTitle>
                <CardDescription>
                  Store identity — shown on invoices, emails, and your storefront
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-name" className="flex items-center gap-1.5">
                      <Store className="size-3.5 text-muted-foreground" aria-hidden />
                      Store name
                    </Label>
                    <Input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email" className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-muted-foreground" aria-hidden />
                      Email
                    </Label>
                    <Input id="store-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-phone" className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-muted-foreground" aria-hidden />
                      Phone
                    </Label>
                    <Input id="store-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-address" className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground" aria-hidden />
                      Address
                    </Label>
                    <Input id="store-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-currency" className="flex items-center gap-1.5">
                      <Globe className="size-3.5 text-muted-foreground" aria-hidden />
                      Currency
                    </Label>
                    <Input id="store-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                    <p className="text-xs text-muted-foreground">ISO 4217 code (e.g. USD, EUR)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-tz" className="flex items-center gap-1.5">
                      <Globe className="size-3.5 text-muted-foreground" aria-hidden />
                      Timezone
                    </Label>
                    <Input id="store-tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  type="button"
                  onClick={() => toast.success("General settings saved", { description: "Store details updated." })}
                >
                  Save general
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Shipping */}
          <section
            ref={(el) => { sectionRefs.current.shipping = el; }}
            id="settings-shipping"
            aria-labelledby="settings-shipping-title"
          >
            <Card>
              <CardHeader>
                <CardTitle id="settings-shipping-title" className="flex items-center gap-2">
                  <Truck className="size-5 text-primary" aria-hidden />
                  Shipping
                </CardTitle>
                <CardDescription>
                  Carrier accounts, label defaults, and package presets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ship-origin">Ship-from address</Label>
                    <Input id="ship-origin" defaultValue="1200 Irrigation Way, Fresno, CA 93721" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="handling-time">Handling time (days)</Label>
                    <Input id="handling-time" type="number" min={0} defaultValue="1" />
                  </div>
                </div>

                <Separator />
                <div>
                  <h3 className="text-sm font-medium">Shipping zones</h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Define rates by region. Advanced zone configuration coming soon.
                  </p>
                  <div className="space-y-2">
                    {[
                      { zone: "Domestic (US)", standard: "$9.99", express: "$19.99" },
                      { zone: "Canada", standard: "$14.99", express: "$29.99" },
                      { zone: "International", standard: "$24.99", express: "$49.99" },
                    ].map((z) => (
                      <div key={z.zone} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
                        <span className="font-medium">{z.zone}</span>
                        <div className="flex gap-4 text-muted-foreground">
                          <span>Standard: {z.standard}</span>
                          <span>Express: {z.express}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                <div>
                  <h3 className="text-sm font-medium">Package presets</h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Default package dimensions for shipping label calculation
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="pkg-length">Length (in)</Label>
                      <Input id="pkg-length" type="number" min={0} defaultValue="12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkg-width">Width (in)</Label>
                      <Input id="pkg-width" type="number" min={0} defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkg-height">Height (in)</Label>
                      <Input id="pkg-height" type="number" min={0} defaultValue="6" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  type="button"
                  onClick={() => toast.success("Shipping settings saved", { description: "Shipping configuration updated." })}
                >
                  Save shipping
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Payments */}
          <section
            ref={(el) => { sectionRefs.current.payments = el; }}
            id="settings-payments"
            aria-labelledby="settings-payments-title"
          >
            <Card>
              <CardHeader>
                <CardTitle id="settings-payments-title" className="flex items-center gap-2">
                  <CreditCard className="size-5 text-primary" aria-hidden />
                  Payments
                </CardTitle>
                <CardDescription>
                  Payment processors, payout schedule, and fraud protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Payment providers</h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Connect a payment gateway to start accepting payments
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: "Stripe", status: "Connected", statusColor: "text-green-600 bg-green-50" },
                      { name: "PayPal", status: "Not connected", statusColor: "text-muted-foreground bg-muted" },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <CreditCard className="size-4 text-muted-foreground" aria-hidden />
                          <span className="font-medium">{p.name}</span>
                        </div>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", p.statusColor)}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="payout-schedule">Payout schedule</Label>
                    <Input id="payout-schedule" defaultValue="Weekly (every Monday)" readOnly className="bg-muted/50" />
                    <p className="text-xs text-muted-foreground">Managed by your payment provider</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-calc">Tax calculation</Label>
                    <Input id="tax-calc" defaultValue="Automatic (Stripe Tax)" readOnly className="bg-muted/50" />
                    <p className="text-xs text-muted-foreground">Tax is calculated at checkout</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  type="button"
                  onClick={() => toast.success("Payment settings saved", { description: "Payment configuration updated." })}
                >
                  Save payments
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Notifications */}
          <section
            ref={(el) => { sectionRefs.current.notifications = el; }}
            id="settings-notifications"
            aria-labelledby="settings-notifications-title"
          >
            <Card>
              <CardHeader>
                <CardTitle id="settings-notifications-title" className="flex items-center gap-2">
                  <Bell className="size-5 text-primary" aria-hidden />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Email alerts for orders, inventory, and payouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Order notifications</h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Get notified when orders are placed, paid, or shipped
                  </p>
                  {[
                    { label: "New order placed", desc: "Email when a customer completes checkout", on: true },
                    { label: "Order shipped", desc: "Confirmation when tracking is added", on: true },
                    { label: "Order cancelled", desc: "Alert when an order is cancelled or refunded", on: false },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">{n.label}</p>
                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                      </div>
                      <div className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        n.on ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"
                      )}>
                        {n.on ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />
                <div>
                  <h3 className="text-sm font-medium">Inventory alerts</h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Stay ahead of stockouts with low-inventory notifications
                  </p>
                  {[
                    { label: "Low stock warning", desc: "When a product falls below its reorder point", on: true },
                    { label: "Out of stock", desc: "When a product reaches zero quantity", on: true },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">{n.label}</p>
                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                      </div>
                      <div className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        n.on ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"
                      )}>
                        {n.on ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  type="button"
                  onClick={() => toast.success("Notification settings saved", { description: "Notification preferences updated." })}
                >
                  Save notifications
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
