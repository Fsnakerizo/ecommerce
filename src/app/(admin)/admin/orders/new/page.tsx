"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Minus,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PRODUCTS, CUSTOMERS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface OrderLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  sku: string;
  quantity: number;
  stock: number;
}

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Shipping", price: 9.99, eta: "5–7 business days" },
  { id: "express", label: "Express Shipping", price: 19.99, eta: "2–3 business days" },
  { id: "overnight", label: "Overnight Shipping", price: 34.99, eta: "Next business day" },
  { id: "free", label: "Free Shipping", price: 0, eta: "7–10 business days" },
];

const TAX_RATE = 0.0825;

export default function AdminCreateOrderPage() {
  const router = useRouter();

  const [lines, setLines] = React.useState<OrderLine[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  const [shippingMethod, setShippingMethod] = React.useState("standard");
  const [notes, setNotes] = React.useState("");
  const [discount, setDiscount] = React.useState("");

  const [productSearch, setProductSearch] = React.useState("");
  const [showProductPicker, setShowProductPicker] = React.useState(false);
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [showCustomerPicker, setShowCustomerPicker] = React.useState(false);

  const pickerRef = React.useRef<HTMLDivElement>(null);
  const customerPickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowProductPicker(false);
      }
      if (customerPickerRef.current && !customerPickerRef.current.contains(e.target as Node)) {
        setShowCustomerPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      !lines.some((l) => l.productId === p.id) &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredCustomers = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const selectedCustomer = CUSTOMERS.find((c) => c.id === selectedCustomerId);

  function addProduct(productId: string) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    setLines((prev) => [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        sku: product.sku,
        quantity: 1,
        stock: product.stock,
      },
    ]);
    setProductSearch("");
    setShowProductPicker(false);
  }

  function updateQuantity(productId: string, delta: number) {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId
          ? { ...l, quantity: Math.max(1, Math.min(l.stock, l.quantity + delta)) }
          : l
      )
    );
  }

  function removeLine(productId: string) {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const discountAmount = discount ? parseFloat(discount) || 0 : 0;
  const shipping = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 0;
  const taxable = Math.max(0, subtotal - discountAmount);
  const tax = taxable * TAX_RATE;
  const total = taxable + tax + shipping;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      toast.error("Add at least one product to the order");
      return;
    }
    if (!selectedCustomerId) {
      toast.error("Select a customer for this order");
      return;
    }
    toast.success("Order created!", {
      description: `Order for ${selectedCustomer?.name} — ${formatCurrency(total)}`,
    });
    router.push("/admin/orders");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1"
        nativeButton={false}
        render={<Link href="/admin/orders" />}
      >
        ← Orders
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create order</h1>
        <p className="text-muted-foreground">
          Build a new order on behalf of a customer
        </p>
      </div>

      <form onSubmit={handleCreate}>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Product picker */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Search and add products to this order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div ref={pickerRef} className="relative">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or SKU…"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductPicker(true);
                      }}
                      onFocus={() => setShowProductPicker(true)}
                      className="pl-9"
                    />
                  </div>
                  {showProductPicker && productSearch.length > 0 && (
                    <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border bg-popover shadow-lg">
                      {filteredProducts.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                          No products found
                        </p>
                      ) : (
                        filteredProducts.slice(0, 8).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => addProduct(p.id)}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                          >
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                              {p.images[0] ? (
                                <Image
                                  src={p.images[0]}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                                  —
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {p.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {p.sku} · {formatCurrency(p.price)}
                              </p>
                            </div>
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {p.stock} in stock
                            </Badge>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {lines.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed py-10 text-center text-muted-foreground">
                    <Search className="size-8 opacity-50" />
                    <p className="text-sm font-medium">No products added yet</p>
                    <p className="text-xs">
                      Use the search bar above to find and add products
                    </p>
                  </div>
                ) : (
                  <div className="divide-y rounded-lg border">
                    {lines.map((line) => (
                      <div
                        key={line.productId}
                        className="flex items-center gap-3 px-3 py-3"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                          {line.image ? (
                            <Image
                              src={line.image}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                              —
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {line.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {line.sku} · {formatCurrency(line.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.productId, -1)}
                            disabled={line.quantity <= 1}
                            className="flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.productId, 1)}
                            disabled={line.quantity >= line.stock}
                            className="flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <p className="w-20 text-right text-sm font-medium tabular-nums">
                          {formatCurrency(line.price * line.quantity)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeLine(line.productId)}
                          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${line.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Shipping method</Label>
                  <Select value={shippingMethod} onValueChange={(v) => setShippingMethod(v ?? "standard")}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHIPPING_METHODS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="flex items-center gap-2">
                            {m.label}
                            <span className="text-muted-foreground">
                              — {m.price === 0 ? "Free" : formatCurrency(m.price)} · {m.eta}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Discount & Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Discount & notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount ($)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Internal notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Notes visible only to staff…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCustomer ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {selectedCustomer.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {selectedCustomer.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCustomerId("")}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
                        aria-label="Remove customer"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md bg-muted/50 px-2.5 py-2">
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-semibold">{selectedCustomer.totalOrders}</p>
                      </div>
                      <div className="rounded-md bg-muted/50 px-2.5 py-2">
                        <p className="text-muted-foreground">Total spent</p>
                        <p className="font-semibold">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div ref={customerPickerRef} className="relative">
                    <div className="relative">
                      <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search customers…"
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setShowCustomerPicker(true);
                        }}
                        onFocus={() => setShowCustomerPicker(true)}
                        className="pl-9"
                      />
                    </div>
                    {showCustomerPicker && (
                      <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border bg-popover shadow-lg">
                        {filteredCustomers.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No customers found
                          </p>
                        ) : (
                          filteredCustomers.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedCustomerId(c.id);
                                setCustomerSearch("");
                                setShowCustomerPicker(false);
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                            >
                              <Avatar size="sm">
                                <AvatarFallback className="text-xs">
                                  {c.name
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {c.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {c.email}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({lines.reduce((s, l) => s + l.quantity, 0)} items)
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium tabular-nums">
                      −{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium tabular-nums">
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax ({(TAX_RATE * 100).toFixed(2)}%)
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                  Create order
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/admin/orders" />}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
