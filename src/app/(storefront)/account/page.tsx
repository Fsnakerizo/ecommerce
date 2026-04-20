"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  CalendarDays,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_STATUS_STYLES } from "@/lib/constants";
import { formatCurrency, formatDate, getInitials } from "@/lib/formatters";
import { ORDERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated" || !session?.user) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  const user = session.user;
  const email = user.email ?? "";
  const isAdmin = user.role === "ADMIN";
  const recentOrders = ORDERS.filter((o) => o.customer.email === email).slice(0, 5);
  const allOrders = isAdmin ? ORDERS.slice(0, 5) : recentOrders;
  const totalSpent = allOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground sm:p-8">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px, 40px 40px",
            }}
            aria-hidden
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <Avatar className="size-20 border-3 border-primary-foreground/20 text-lg shadow-lg sm:size-24">
              <AvatarFallback className="bg-primary-foreground/15 text-xl font-bold text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{user.name}</h1>
                {isAdmin && (
                  <Badge className="border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-primary-foreground/75">{email}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-primary-foreground/65 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Package className="size-3.5" aria-hidden />
                  {allOrders.length} order{allOrders.length !== 1 ? "s" : ""}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" aria-hidden />
                  Member since 2025
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col">
              {isAdmin && (
                <Button
                  size="sm"
                  variant="secondary"
                  nativeButton={false}
                  render={<Link href="/admin" />}
                  className="gap-1.5"
                >
                  <Settings className="size-3.5" />
                  Dashboard
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="size-3.5" />
                Sign out
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{allOrders.length}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalSpent)}</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">
                  {allOrders.length > 0 ? formatDate(allOrders[0].createdAt, "short") : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Last Order</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="w-full max-w-xs">
            <TabsTrigger value="orders" className="gap-1.5">
              <Package className="size-3.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5">
              <User className="size-3.5" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {allOrders.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <Package className="mb-3 size-10 text-muted-foreground/50" />
                  <p className="font-medium">No orders yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your order history will appear here once you make a purchase.
                  </p>
                  <Button className="mt-4" nativeButton={false} render={<Link href="/products" />}>
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {allOrders.map((order) => {
                  const st = ORDER_STATUS_STYLES[order.status] ?? ORDER_STATUS_STYLES.PENDING;
                  return (
                    <Card key={order.id} className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                      <CardContent className="p-0">
                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="relative size-12 overflow-hidden rounded-lg border-2 border-card bg-muted"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="size-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="flex size-12 items-center justify-center rounded-lg border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  st.bg,
                                  st.text
                                )}
                              >
                                <span className={cn("size-1.5 rounded-full", st.dot)} aria-hidden />
                                {order.status}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold tabular-nums">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <User className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</p>
                      <p className="mt-0.5 font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                      <p className="mt-0.5 font-medium">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                      <p className="mt-0.5 text-muted-foreground">Not provided</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Address</p>
                      <p className="mt-0.5 text-muted-foreground">No address on file</p>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Account Type</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={isAdmin ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                      {isAdmin && (
                        <span className="text-xs text-muted-foreground">Full admin access</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
