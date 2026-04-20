import { addBusinessDays } from "date-fns";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ order?: string }>;
}) {
  const sp = await props.searchParams;
  const raw = typeof sp.order === "string" ? sp.order.trim() : "";
  const orderNumber = /^AQ-\d{5}$/.test(raw) ? raw : "AQ-10000";

  const start = addBusinessDays(new Date(), 5);
  const end = addBusinessDays(new Date(), 7);
  const windowLabel = `${formatDate(start)} – ${formatDate(end)}`;

  return (
    <div className="container-page flex flex-col items-center py-16 text-center sm:py-24">
      <CheckCircle2 className="mb-4 size-14 text-success" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Order Confirmed!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order number <span className="font-mono font-medium text-foreground">{orderNumber}</span>
      </p>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        Thank you for your purchase. You will receive a confirmation email shortly with tracking once your
        shipment leaves our warehouse.
      </p>
      <p className="mt-3 text-sm font-medium text-foreground">Estimated delivery: {windowLabel}</p>
      <p className="mt-1 text-xs text-muted-foreground">(5–7 business days)</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button nativeButton={false} render={<Link href="/products" />}>
          Continue Shopping
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/account" />}>
          View Account
        </Button>
      </div>
    </div>
  );
}
