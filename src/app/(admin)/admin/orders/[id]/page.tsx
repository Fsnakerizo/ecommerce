"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import { ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from "@/lib/constants";
import { ORDERS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const order = ORDERS.find((o) => o.id === id);
  const [orderStatus, setOrderStatus] = React.useState(order?.status ?? "PENDING");

  React.useEffect(() => {
    if (order) setOrderStatus(order.status);
  }, [order]);

  if (!order) {
    return (
      <div className="p-6 md:p-8">
        <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
          ← Orders
        </Link>
        <p className="mt-8 text-center text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const addressLines = [
    `${addr.firstName} ${addr.lastName}`,
    addr.address1,
    `${addr.city}, ${addr.state} ${addr.postalCode}`,
    addr.country,
  ];

  return (
    <div className="space-y-6 p-6 md:p-8">
      <Link href="/admin/orders" className="inline-flex text-sm text-muted-foreground hover:text-foreground">
        ← Orders
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
            <OrderStatusBadge status={orderStatus} />
          </div>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt, "long")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              Update status
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Fulfillment</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {Object.keys(ORDER_STATUS_STYLES).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    setOrderStatus(s);
                    toast.success("Status updated", {
                      description: `Order set to ${s.charAt(0) + s.slice(1).toLowerCase()}.`,
                    });
                  }}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.print();
            }}
          >
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit</TableHead>
                      <TableHead className="pr-6 text-right">Line total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={`${order.id}-${item.productId}`}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.image}
                              alt=""
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="pr-6 text-right tabular-nums font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/40">
              <div className="flex w-full justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex w-full justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="tabular-nums">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex w-full justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="tabular-nums">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex w-full justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="tabular-nums">−{formatCurrency(order.discount)}</span>
              </div>
              <Separator />
              <div className="flex w-full justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </CardContent>
          </Card>

          {order.trackingNumber && order.carrier ? (
            <Card>
              <CardHeader>
                <CardTitle>Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-medium">{order.carrier}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Tracking #</span>
                  <span className="font-mono text-xs">{order.trackingNumber}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
