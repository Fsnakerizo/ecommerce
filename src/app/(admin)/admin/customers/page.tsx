"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { CUSTOMERS, type MockCustomer } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
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

function CustomerStatusBadge({ status }: { status: string }) {
  const active = status === "active";
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

function parseCustomerRows(text: string): MockCustomer[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const ni = header.indexOf("name");
  const ei = header.indexOf("email");
  if (ni < 0 || ei < 0) return [];
  const imported: MockCustomer[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const name = cols[ni];
    const email = cols[ei];
    if (!name || !email) continue;
    imported.push({
      id: `cust_import_${Date.now()}_${i}`,
      name,
      email,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      status: "active",
    });
  }
  return imported;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<MockCustomer[]>(() => [...CUSTOMERS]);
  const [importOpen, setImportOpen] = React.useState(false);
  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addFirstName, setAddFirstName] = React.useState("");
  const [addLastName, setAddLastName] = React.useState("");
  const [addEmail, setAddEmail] = React.useState("");
  const [addPhone, setAddPhone] = React.useState("");
  const [addStatus, setAddStatus] = React.useState<"active" | "inactive">("active");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [search, customers]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">{filtered.length} customers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4" />
            Add customer
          </Button>
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            Import
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="max-w-md space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0 pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total spent</TableHead>
                  <TableHead className="pr-6">Last order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6 font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.totalOrders}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(c.totalSpent)}</TableCell>
                    <TableCell className="pr-6 text-muted-foreground">
                      {c.lastOrder ? formatDate(c.lastOrder) : "—"}
                    </TableCell>
                    <TableCell>
                      <CustomerStatusBadge status={c.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) {
            setAddFirstName("");
            setAddLastName("");
            setAddEmail("");
            setAddPhone("");
            setAddStatus("active");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add customer</DialogTitle>
            <DialogDescription>Create a customer record manually. Required fields are marked.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="add-first-name">
                First name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-first-name"
                autoComplete="given-name"
                value={addFirstName}
                onChange={(e) => setAddFirstName(e.target.value)}
                placeholder="Jane"
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="add-last-name">
                Last name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-last-name"
                autoComplete="family-name"
                value={addLastName}
                onChange={(e) => setAddLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-email"
                type="email"
                autoComplete="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-phone">Phone</Label>
              <Input
                id="add-phone"
                type="tel"
                autoComplete="tel"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-status">Status</Label>
              <Select value={addStatus} onValueChange={(v) => setAddStatus(v as "active" | "inactive")}>
                <SelectTrigger id="add-status" className="w-full">
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
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                const first = addFirstName.trim();
                const last = addLastName.trim();
                const email = addEmail.trim();
                if (!first) {
                  toast.error("First name required", { description: "Enter the customer’s first name." });
                  return;
                }
                if (!last) {
                  toast.error("Last name required", { description: "Enter the customer’s last name." });
                  return;
                }
                if (!email) {
                  toast.error("Email required", { description: "Enter a valid email address." });
                  return;
                }
                if (!isValidEmail(email)) {
                  toast.error("Invalid email", { description: "Check the email format and try again." });
                  return;
                }
                const phoneTrimmed = addPhone.trim();
                const createdAt = new Date().toISOString().slice(0, 10);
                const newCustomer: MockCustomer = {
                  id: `cust_${Date.now()}`,
                  name: `${first} ${last}`,
                  email,
                  ...(phoneTrimmed ? { phone: phoneTrimmed } : {}),
                  totalOrders: 0,
                  totalSpent: 0,
                  lastOrder: undefined,
                  createdAt,
                  status: addStatus,
                };
                setCustomers((prev) => [newCustomer, ...prev]);
                toast.success("Customer added", {
                  description: `${newCustomer.name} was added to your list.`,
                });
                setAddFirstName("");
                setAddLastName("");
                setAddEmail("");
                setAddPhone("");
                setAddStatus("active");
                setAddOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);
          if (!open) setImportFile(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import customers</DialogTitle>
            <DialogDescription>
              Upload a CSV file with <span className="font-mono">name</span> and{" "}
              <span className="font-mono">email</span> columns (header row required).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="cust-import">CSV file</Label>
            <Input
              id="cust-import"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!importFile}
              onClick={() => {
                if (!importFile) return;
                void (async () => {
                  const text = await importFile.text();
                  const rows = parseCustomerRows(text);
                  if (rows.length === 0) {
                    toast.error("No rows imported", {
                      description: "Check the file format and try again.",
                    });
                    return;
                  }
                  setCustomers((prev) => [...rows, ...prev]);
                  toast.success("Import complete", {
                    description: `Added ${rows.length} customer${rows.length === 1 ? "" : "s"} from ${importFile.name}.`,
                  });
                  setImportFile(null);
                  setImportOpen(false);
                })();
              }}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
