"use client";

import * as React from "react";
import { toast } from "sonner";

import { PRODUCTS, type MockProduct } from "@/lib/mock-data";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ProductStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      )}
    >
      <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-red-500")} />
      {active ? "In stock" : "Out of stock"}
    </span>
  );
}

export default function AdminInventoryPage() {
  const [items, setItems] = React.useState<MockProduct[]>(() => PRODUCTS.map((p) => ({ ...p })));
  const [adjustOpen, setAdjustOpen] = React.useState(false);
  const [adjustProductId, setAdjustProductId] = React.useState<string | null>(null);
  const [qtyInput, setQtyInput] = React.useState("");

  const adjusting = adjustProductId ? items.find((p) => p.id === adjustProductId) : null;

  const totalItems = items.length;
  const lowStock = items.filter((p) => p.stock > 0 && p.stock < 20).length;
  const out = items.filter((p) => p.stock === 0).length;

  function openAdjust(p: MockProduct) {
    setAdjustProductId(p.id);
    setQtyInput(String(p.stock));
    setAdjustOpen(true);
  }

  function saveAdjust() {
    if (!adjustProductId) return;
    const next = Number.parseInt(qtyInput, 10);
    if (Number.isNaN(next) || next < 0) {
      toast.error("Enter a valid quantity", { description: "Use a whole number zero or greater." });
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === adjustProductId ? { ...p, stock: next } : p)));
    toast.success("Stock updated", { description: adjusting?.name });
    setAdjustOpen(false);
    setAdjustProductId(null);
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">Stock levels across your catalog</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatNumber(totalItems)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-amber-600">{formatNumber(lowStock)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-red-600">{formatNumber(out)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-0 pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reorder point</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => {
                  const reorder = Math.max(10, Math.floor(p.stock * 0.2));
                  const qtyClass =
                    p.stock === 0 ? "text-red-600" : p.stock < 10 ? "text-red-600" : p.stock < 20 ? "text-amber-600" : "text-emerald-600";
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="pl-6 font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell className={cn("text-right font-medium tabular-nums", qtyClass)}>
                        {formatNumber(p.stock)}
                      </TableCell>
                      <TableCell>
                        <ProductStatusBadge active={p.stock > 0} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(reorder)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button size="sm" variant="outline" onClick={() => openAdjust(p)}>
                          Adjust stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={adjustOpen}
        onOpenChange={(open) => {
          setAdjustOpen(open);
          if (!open) setAdjustProductId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>
              {adjusting ? `Set on-hand quantity for ${adjusting.name}.` : "Set a new quantity."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="inv-qty">Quantity</Label>
            <Input
              id="inv-qty"
              inputMode="numeric"
              value={qtyInput}
              onChange={(e) => setQtyInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAdjustOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveAdjust}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
