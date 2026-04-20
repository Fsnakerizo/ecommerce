"use client";

import * as React from "react";
import { toast } from "sonner";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  usage: number;
  active: boolean;
  expires: string;
};

const INITIAL: Coupon[] = [
  {
    id: "c1",
    code: "SPRING15",
    type: "percentage",
    value: 15,
    minOrder: 75,
    usage: 128,
    active: true,
    expires: "2026-06-30",
  },
  {
    id: "c2",
    code: "IRRIGATE10",
    type: "percentage",
    value: 10,
    minOrder: 50,
    usage: 340,
    active: true,
    expires: "2026-12-31",
  },
  {
    id: "c3",
    code: "FLAT20",
    type: "fixed",
    value: 20,
    minOrder: 100,
    usage: 42,
    active: true,
    expires: "2026-05-15",
  },
  {
    id: "c4",
    code: "WELCOME5",
    type: "fixed",
    value: 5,
    minOrder: 25,
    usage: 891,
    active: false,
    expires: "2026-04-01",
  },
  {
    id: "c5",
    code: "PROKIT25",
    type: "percentage",
    value: 25,
    minOrder: 200,
    usage: 18,
    active: true,
    expires: "2026-08-01",
  },
];

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-600"
      )}
    >
      <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-neutral-400")} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminCouponsPage() {
  const [rows, setRows] = React.useState<Coupon[]>(INITIAL);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [newCode, setNewCode] = React.useState("");
  const [newDiscount, setNewDiscount] = React.useState("");
  const [newMinOrder, setNewMinOrder] = React.useState("");
  const [newStatus, setNewStatus] = React.useState<string>("active");

  function toggle(id: string) {
    const current = rows.find((x) => x.id === id);
    const nextActive = !current?.active;
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    toast.success(nextActive ? "Coupon activated" : "Coupon deactivated", {
      description: current?.code,
    });
  }

  function remove(id: string) {
    const c = rows.find((x) => x.id === id);
    setRows((prev) => prev.filter((x) => x.id !== id));
    toast.success("Coupon deleted", { description: c?.code });
  }

  function saveNewCoupon() {
    const code = newCode.trim().toUpperCase();
    const discountPct = Number.parseFloat(newDiscount);
    const minOrder = Number.parseFloat(newMinOrder);
    if (!code) {
      toast.error("Code is required");
      return;
    }
    if (Number.isNaN(discountPct) || discountPct <= 0 || discountPct > 100) {
      toast.error("Enter a discount between 1 and 100%");
      return;
    }
    if (Number.isNaN(minOrder) || minOrder < 0) {
      toast.error("Enter a valid minimum order amount");
      return;
    }
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const row: Coupon = {
      id: `c_${Date.now()}`,
      code,
      type: "percentage",
      value: Math.round(discountPct * 10) / 10,
      minOrder: Math.round(minOrder * 100) / 100,
      usage: 0,
      active: newStatus === "active",
      expires: expires.toISOString().slice(0, 10),
    };
    setRows((prev) => [row, ...prev]);
    toast.success("Coupon created", { description: code });
    setNewCode("");
    setNewDiscount("");
    setNewMinOrder("");
    setNewStatus("active");
    setCreateOpen(false);
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">{rows.length} codes</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create coupon</Button>
      </div>

      <Card>
        <CardContent className="px-0 pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Min order</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6 font-mono text-sm font-medium">{c.code}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.type === "percentage" ? "Percentage" : "Fixed"}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.type === "percentage" ? `${c.value}%` : formatCurrency(c.value)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(c.minOrder)}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.usage}</TableCell>
                    <TableCell>
                      <StatusBadge active={c.active} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(c.expires)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggle(c.id)}>
                          {c.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create coupon</DialogTitle>
            <DialogDescription>Add a percentage discount code. It will be saved to this list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Code</Label>
              <Input
                id="coupon-code"
                placeholder="SUMMER20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-discount">Discount (%)</Label>
              <Input
                id="coupon-discount"
                inputMode="decimal"
                placeholder="15"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-min">Minimum order ($)</Label>
              <Input
                id="coupon-min"
                inputMode="decimal"
                placeholder="50"
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v ?? "active")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveNewCoupon}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
