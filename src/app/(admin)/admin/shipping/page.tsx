"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { SHIPMENT_STATUS_STYLES } from "@/lib/constants";
import type { MockOrder } from "@/lib/mock-data";
import { ORDERS } from "@/lib/mock-data";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function shipmentKey(order: MockOrder): keyof typeof SHIPMENT_STATUS_STYLES {
  if (order.status === "DELIVERED") return "DELIVERED";
  if (order.status === "SHIPPED") return "IN_TRANSIT";
  if (order.status === "CANCELLED") return "RETURNED";
  return "PENDING";
}

function ShipmentStatusBadge({ status }: { status: keyof typeof SHIPMENT_STATUS_STYLES }) {
  const styles = SHIPMENT_STATUS_STYLES[status];
  const dot: Record<string, string> = {
    PENDING: "bg-amber-500",
    PICKED_UP: "bg-blue-500",
    IN_TRANSIT: "bg-indigo-500",
    OUT_FOR_DELIVERY: "bg-violet-500",
    DELIVERED: "bg-emerald-500",
    RETURNED: "bg-red-500",
  };
  const label =
    status === "IN_TRANSIT"
      ? "In transit"
      : status === "OUT_FOR_DELIVERY"
        ? "Out for delivery"
        : status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[status] ?? "bg-neutral-400")} />
      {label}
    </span>
  );
}

function estDelivery(order: MockOrder) {
  const base = new Date(order.updatedAt).getTime();
  const days = order.status === "DELIVERED" ? 0 : order.status === "SHIPPED" ? 3 : 5;
  return formatDate(new Date(base + days * 86400000));
}

export default function AdminShippingPage() {
  const router = useRouter();
  const tracked = ORDERS.filter((o) => o.trackingNumber && o.carrier);

  const pending = ORDERS.filter((o) => shipmentKey(o) === "PENDING").length;
  const transit = ORDERS.filter((o) => shipmentKey(o) === "IN_TRANSIT").length;
  const delivered = ORDERS.filter((o) => shipmentKey(o) === "DELIVERED").length;

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Shipping</h1>
        <p className="text-muted-foreground">Carriers and delivery tracking</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-amber-600">{pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In transit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-indigo-600">{transit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-emerald-600">{delivered}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-0 pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6">Est. delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracked.map((o) => (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/orders/${o.id}`)}
                  >
                    <TableCell className="pl-6 font-medium">{o.orderNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{o.customer.name}</span>
                        <span className="text-xs text-muted-foreground">{o.customer.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{o.carrier}</TableCell>
                    <TableCell className="font-mono text-xs">{o.trackingNumber}</TableCell>
                    <TableCell>
                      <ShipmentStatusBadge status={shipmentKey(o)} />
                    </TableCell>
                    <TableCell className="pr-6 text-muted-foreground">{estDelivery(o)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
