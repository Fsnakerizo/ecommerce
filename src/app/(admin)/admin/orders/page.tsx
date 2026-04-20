"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from "@/lib/constants";
import { ORDERS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MockOrder } from "@/lib/mock-data";

function downloadOrdersCsv(orders: MockOrder[]) {
  const headers = ["Order #", "Customer", "Email", "Status", "Payment", "Total", "Created"];
  const escape = (cell: string | number) => {
    const s = String(cell);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.map(escape).join(","),
    ...orders.map((o) =>
      [
        o.orderNumber,
        o.customer.name,
        o.customer.email,
        o.status,
        o.paymentStatus,
        o.total,
        o.createdAt,
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles = ORDER_STATUS_STYLES[status] ?? ORDER_STATUS_STYLES.PENDING;
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} />
      {label}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles = PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES.PENDING;
  const dot =
    status === "COMPLETED"
      ? "bg-emerald-500"
      : status === "FAILED"
        ? "bg-red-500"
        : status === "REFUNDED"
          ? "bg-neutral-400"
          : "bg-amber-500";
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<string>("all");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return ORDERS.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hit =
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q);
        if (!hit) return false;
      }
      const t = new Date(o.createdAt).getTime();
      if (from) {
        const f = new Date(from).setHours(0, 0, 0, 0);
        if (t < f) return false;
      }
      if (to) {
        const end = new Date(to).setHours(23, 59, 59, 999);
        if (t > end) return false;
      }
      return true;
    });
  }, [status, from, to, search]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">{filtered.length} orders</p>
        </div>
        <Button
          variant="outline"
          className="hidden sm:inline-flex"
          onClick={() => {
            downloadOrdersCsv(filtered);
            toast.success("Export complete", {
              description: `Downloaded ${filtered.length} order${filtered.length === 1 ? "" : "s"} as CSV.`,
            });
          }}
        >
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.keys(ORDER_STATUS_STYLES).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Order # or customer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0 pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="pr-6 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
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
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(o.total)}</TableCell>
                    <TableCell className="pr-6 text-right text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </TableCell>
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
