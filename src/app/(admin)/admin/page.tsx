"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, Users } from "lucide-react";

import { ORDER_STATUS_STYLES } from "@/lib/constants";
import {
  DASHBOARD_STATS,
  ORDERS,
  PRODUCTS,
  REVENUE_CHART_DATA,
  TOP_PRODUCTS_DATA,
  type MockOrder,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

type PeriodId = "7d" | "30d" | "90d" | "12mo";

const PERIOD_OPTIONS: { id: PeriodId; label: string; days: number }[] = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "12mo", label: "Last 12 months", days: 365 },
];

const DASHBOARD_ANCHOR_MS = new Date("2026-04-20T23:59:59.000Z").getTime();
const MS_PER_DAY = 86_400_000;

function orderTimestamp(o: MockOrder): number {
  return new Date(o.createdAt).getTime();
}

function isInPeriod(o: MockOrder, days: number): boolean {
  return orderTimestamp(o) >= DASHBOARD_ANCHOR_MS - days * MS_PER_DAY;
}

function countRevenueForOrder(o: MockOrder): number {
  if (o.status === "CANCELLED") return 0;
  return o.total;
}

/** Tailwind 500 palette aligned with ORDER_STATUS_STYLES dots */
const STATUS_CHART_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PROCESSING: "#6366f1",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
  REFUNDED: "#a3a3a3",
};

function startOfUtcDay(ms: number): number {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function addUtcDays(ms: number, delta: number): number {
  return ms + delta * MS_PER_DAY;
}

function formatChartDay(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatChartWeek(startMs: number): string {
  const end = addUtcDays(startMs, 6);
  return `${formatChartDay(startMs)} – ${formatChartDay(end)}`;
}

function sumRevenueSeries(points: { revenue: number }[]): number {
  return points.reduce((s, p) => s + p.revenue, 0);
}

function scaleSeriesToTotal<T extends { revenue: number }>(
  points: T[],
  targetTotal: number
): (T & { pctChange: number | null })[] {
  const current = sumRevenueSeries(points);
  const factor = current > 0 ? targetTotal / current : 0;
  let prev: number | null = null;
  return points.map((p) => {
    const revenue = p.revenue * factor;
    let pctChange: number | null = null;
    if (prev !== null && prev !== 0) {
      pctChange = ((revenue - prev) / prev) * 100;
    } else if (prev === 0 && revenue > 0) {
      pctChange = 100;
    }
    const row = { ...p, revenue, pctChange } as T & { pctChange: number | null };
    prev = revenue;
    return row;
  });
}

function buildRevenueChart7d(orders: MockOrder[], days: number): { label: string; revenue: number; pctChange: number | null }[] {
  const start = addUtcDays(startOfUtcDay(DASHBOARD_ANCHOR_MS), -(days - 1));
  const points: { label: string; revenue: number; pctChange: number | null }[] = [];
  let prev: number | null = null;
  for (let i = 0; i < days; i++) {
    const dayStart = addUtcDays(start, i);
    const dayEnd = addUtcDays(dayStart, 1);
    const revenue = orders.reduce((sum, o) => {
      const t = orderTimestamp(o);
      if (t >= dayStart && t < dayEnd) return sum + countRevenueForOrder(o);
      return sum;
    }, 0);
    let pctChange: number | null = null;
    if (prev !== null) {
      if (prev === 0 && revenue > 0) pctChange = 100;
      else if (prev !== 0) pctChange = ((revenue - prev) / prev) * 100;
    }
    points.push({ label: formatChartDay(dayStart), revenue, pctChange });
    prev = revenue;
  }
  return points;
}

function buildRevenueChart30d(orders: MockOrder[], days: number): { label: string; revenue: number; pctChange: number | null }[] {
  const start = DASHBOARD_ANCHOR_MS - days * MS_PER_DAY;
  const weekStarts: number[] = [];
  let cursor = startOfUtcDay(start);
  while (cursor <= DASHBOARD_ANCHOR_MS) {
    weekStarts.push(cursor);
    cursor = addUtcDays(cursor, 7);
  }
  const points: { label: string; revenue: number; pctChange: number | null }[] = [];
  let prev: number | null = null;
  for (let i = 0; i < weekStarts.length; i++) {
    const ws = weekStarts[i];
    const we = i + 1 < weekStarts.length ? weekStarts[i + 1] : DASHBOARD_ANCHOR_MS + 1;
    const revenue = orders.reduce((sum, o) => {
      const t = orderTimestamp(o);
      if (t >= ws && t < we) return sum + countRevenueForOrder(o);
      return sum;
    }, 0);
    let pctChange: number | null = null;
    if (prev !== null) {
      if (prev === 0 && revenue > 0) pctChange = 100;
      else if (prev !== 0) pctChange = ((revenue - prev) / prev) * 100;
    }
    points.push({ label: formatChartWeek(ws), revenue, pctChange });
    prev = revenue;
  }
  return points;
}

function monthKeyUTC(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabelFromKey(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function buildRevenueChartByMonth(
  orders: MockOrder[],
  days: number,
  template: { month: string; revenue: number }[]
): { label: string; revenue: number; pctChange: number | null }[] {
  const start = DASHBOARD_ANCHOR_MS - days * MS_PER_DAY;
  const keys: string[] = [];
  const cursor = new Date(start);
  cursor.setUTCDate(1);
  cursor.setUTCHours(0, 0, 0, 0);
  let ck = Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1);
  while (ck <= DASHBOARD_ANCHOR_MS) {
    keys.push(monthKeyUTC(ck));
    ck = Date.UTC(new Date(ck).getUTCFullYear(), new Date(ck).getUTCMonth() + 1, 1);
  }

  const fromOrders = keys.map((key) => {
    const [y, m] = key.split("-").map(Number);
    const monthStart = Date.UTC(y, m - 1, 1);
    const monthEnd = Date.UTC(y, m, 1);
    const revenue = orders.reduce((sum, o) => {
      const t = orderTimestamp(o);
      if (t >= monthStart && t < monthEnd) return sum + countRevenueForOrder(o);
      return sum;
    }, 0);
    return { key, label: monthLabelFromKey(key), revenue };
  });

  const orderTotal = sumRevenueSeries(fromOrders);
  if (orderTotal > 0) {
    const withoutKey = fromOrders.map(({ key: _key, ...rest }) => rest);
    return scaleSeriesToTotal(withoutKey, orderTotal);
  }

  const tpl = template.map((row, idx) => ({
    label: row.month,
    revenue: row.revenue * (0.85 + (idx % 3) * 0.05),
  }));
  const tplSum = sumRevenueSeries(tpl);
  const target = Math.max(
    tplSum * 0.15,
    orders.reduce((s, o) => s + countRevenueForOrder(o), 0) || DASHBOARD_STATS.totalRevenue * (days / 365) * 0.25
  );
  return scaleSeriesToTotal(tpl, target);
}

function extendRevenueTemplateTo12(): { month: string; revenue: number }[] {
  const labels = ["May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const pattern = [...REVENUE_CHART_DATA, ...REVENUE_CHART_DATA];
  return labels.map((month, idx) => ({
    month,
    revenue: Math.round(pattern[idx % pattern.length].revenue * (0.78 + (idx % 4) * 0.04) * 100) / 100,
  }));
}

function ordersByStatus(orders: MockOrder[]): { status: string; name: string; value: number; fill: string }[] {
  const map = new Map<string, number>();
  for (const o of orders) {
    map.set(o.status, (map.get(o.status) ?? 0) + 1);
  }
  return [...map.entries()].map(([status, value]) => ({
    status,
    name: status.charAt(0) + status.slice(1).toLowerCase(),
    value,
    fill: STATUS_CHART_COLORS[status] ?? "#64748b",
  }));
}

function salesByCategory(orders: MockOrder[]): { category: string; revenue: number; fill: string }[] {
  const map = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "CANCELLED") continue;
    for (const line of o.items) {
      const cat =
        PRODUCTS.find((p) => p.id === line.productId)?.category ?? "Other";
      map.set(cat, (map.get(cat) ?? 0) + line.price * line.quantity);
    }
  }
  const palette = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#64748b"];
  return [...map.entries()]
    .map(([category, revenue], i) => ({
      category,
      revenue,
      fill: palette[i % palette.length],
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

function aggregateTopProducts(
  orders: MockOrder[],
  periodDays: number
): { name: string; revenue: number; sold: number; image: string }[] {
  const map = new Map<string, { revenue: number; sold: number; image: string }>();
  for (const o of orders) {
    if (o.status === "CANCELLED") continue;
    for (const line of o.items) {
      const prev = map.get(line.name) ?? { revenue: 0, sold: 0, image: line.image };
      map.set(line.name, {
        revenue: prev.revenue + line.price * line.quantity,
        sold: prev.sold + line.quantity,
        image: line.image || prev.image,
      });
    }
  }
  const fromOrders = [...map.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue);

  const merged: { name: string; revenue: number; sold: number; image: string }[] = [...fromOrders];
  const seen = new Set(merged.map((p) => p.name));
  const fillerScale = Math.min(1, periodDays / 365);
  for (const p of TOP_PRODUCTS_DATA) {
    if (merged.length >= 5) break;
    if (seen.has(p.name)) continue;
    merged.push({
      name: p.name,
      revenue: Math.round(p.revenue * fillerScale * 100) / 100,
      sold: Math.max(1, Math.floor(p.sold * fillerScale)),
      image: p.image,
    });
    seen.add(p.name);
  }
  return merged.slice(0, 5);
}

function trendForPeriod(period: PeriodId, base: number): number {
  const mult = period === "7d" ? 0.35 : period === "30d" ? 0.65 : period === "90d" ? 0.85 : 1;
  return Math.round(base * mult * 10) / 10;
}

function buildPeriodBundle(period: PeriodId) {
  const days = PERIOD_OPTIONS.find((p) => p.id === period)!.days;
  const orders = ORDERS.filter((o) => isInPeriod(o, days)).sort(
    (a, b) => orderTimestamp(b) - orderTimestamp(a)
  );

  const totalRevenue = orders.reduce((s, o) => s + countRevenueForOrder(o), 0);
  const totalOrders = orders.length;
  const customerSet = new Set(orders.map((o) => o.customer.email.toLowerCase()));
  const totalCustomers = customerSet.size;
  const paidOrders = orders.filter((o) => o.status !== "CANCELLED").length;
  const avgOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  const stats = {
    totalRevenue: totalRevenue > 0 ? totalRevenue : DASHBOARD_STATS.totalRevenue * (days / 365) * 0.4,
    revenueChange: trendForPeriod(period, DASHBOARD_STATS.revenueChange),
    totalOrders: totalOrders > 0 ? totalOrders : Math.max(1, Math.round(DASHBOARD_STATS.totalOrders * (days / 365))),
    ordersChange: trendForPeriod(period, DASHBOARD_STATS.ordersChange),
    totalCustomers:
      totalCustomers > 0 ? totalCustomers : Math.max(1, Math.round(DASHBOARD_STATS.totalCustomers * (days / 365))),
    customersChange: trendForPeriod(period, DASHBOARD_STATS.customersChange),
    avgOrderValue: avgOrderValue > 0 ? avgOrderValue : DASHBOARD_STATS.avgOrderValue * (period === "7d" ? 1.04 : period === "30d" ? 1.01 : 0.99),
    aovChange: trendForPeriod(period, DASHBOARD_STATS.aovChange),
  };

  let revenueChart: { label: string; revenue: number; pctChange: number | null }[];
  if (period === "7d") {
    revenueChart = buildRevenueChart7d(orders, 7);
  } else if (period === "30d") {
    revenueChart = buildRevenueChart30d(orders, 30);
  } else if (period === "90d") {
    revenueChart = buildRevenueChartByMonth(orders, 90, REVENUE_CHART_DATA);
  } else {
    revenueChart = buildRevenueChartByMonth(orders, 365, extendRevenueTemplateTo12());
  }

  const statusSlices = ordersByStatus(orders);
  const categoryBars = salesByCategory(orders);
  const topProducts = aggregateTopProducts(orders, days);
  const topRevenueSum = topProducts.reduce((s, p) => s + p.revenue, 0) || 1;
  const topProductsWithShare = topProducts.map((p) => ({
    ...p,
    share: (p.revenue / topRevenueSum) * 100,
  }));

  return {
    stats,
    revenueChart,
    statusSlices,
    categoryBars,
    topProductsWithShare,
    recentOrders: orders.slice(0, 5),
  };
}

const PERIOD_DATA: Record<PeriodId, ReturnType<typeof buildPeriodBundle>> = {
  "7d": buildPeriodBundle("7d"),
  "30d": buildPeriodBundle("30d"),
  "90d": buildPeriodBundle("90d"),
  "12mo": buildPeriodBundle("12mo"),
};

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

function TrendBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <Badge variant="secondary" className={cn("gap-1 font-normal", up ? "text-emerald-700" : "text-red-700")}>
      {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {Math.abs(value)}%
    </Badge>
  );
}

type RevenueTooltipProps = {
  active?: boolean;
  payload?: { payload: { label: string; revenue: number; pctChange: number | null } }[];
};

function RevenueTooltip({ active, payload }: RevenueTooltipProps) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  const change = row.pctChange;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{row.label}</p>
      <p className="text-muted-foreground">{formatCurrency(row.revenue)}</p>
      {change !== null && (
        <p className={cn("text-xs font-medium tabular-nums", change >= 0 ? "text-emerald-600" : "text-red-600")}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}% vs prior
        </p>
      )}
    </div>
  );
}

type PieTooltipProps = {
  active?: boolean;
  payload?: { name: string; value: number; payload: { name: string; status: string } }[];
};

function StatusPieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{row.name}</p>
      <p className="text-muted-foreground">{formatNumber(payload[0].value)} orders</p>
    </div>
  );
}

type BarTooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: { category: string; revenue: number } }[];
};

function CategoryBarTooltip({ active, payload }: BarTooltipProps) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{row.category}</p>
      <p className="text-muted-foreground">{formatCurrency(row.revenue)}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodId>("30d");

  const data = useMemo(() => PERIOD_DATA[period], [period]);

  const gradientId = "adminRevenueFill";

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="mt-1 flex items-center gap-3">
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your store</p>
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodId)}>
            <SelectTrigger aria-label="Time period" className="h-7 text-xs">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          role="button"
          tabIndex={0}
          onClick={() => router.push("/admin/payments")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push("/admin/payments");
            }
          }}
          className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(data.stats.totalRevenue)}</p>
            <div className="mt-2">
              <TrendBadge value={data.stats.revenueChange} />
            </div>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          onClick={() => router.push("/admin/orders")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push("/admin/orders");
            }
          }}
          className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatNumber(data.stats.totalOrders)}</p>
            <div className="mt-2">
              <TrendBadge value={data.stats.ordersChange} />
            </div>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          onClick={() => router.push("/admin/customers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push("/admin/customers");
            }
          }}
          className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatNumber(data.stats.totalCustomers)}</p>
            <div className="mt-2">
              <TrendBadge value={data.stats.customersChange} />
            </div>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          onClick={() => router.push("/admin/orders")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push("/admin/orders");
            }
          }}
          className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(data.stats.avgOrderValue)}</p>
            <div className="mt-2">
              <TrendBadge value={data.stats.aovChange} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Trend for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 pl-0">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueChart} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                    minTickGap={24}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => {
                      if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
                      if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
                      return `$${formatNumber(v)}`;
                    }}
                    width={52}
                  />
                  <Tooltip
                    content={<RevenueTooltip />}
                    cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
            <CardDescription>Distribution in this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusSlices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={100}
                    paddingAngle={2}
                    isAnimationActive
                    animationDuration={800}
                  >
                    {data.statusSlices.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} stroke="var(--background)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<StatusPieTooltip />} />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    formatter={(value, entry) => {
                      const payload = entry as { payload?: { value?: number } };
                      const v = payload.payload?.value ?? 0;
                      return `${value} (${formatNumber(v)})`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by category</CardTitle>
          <CardDescription>Revenue attributed to product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.categoryBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${formatNumber(v)}`)}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={140}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CategoryBarTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.22)" }} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={800}>
                  {data.categoryBars.map((entry) => (
                    <Cell key={entry.category} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest activity across your store</CardDescription>
            </div>
            <Link
              href="/admin/orders"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="pr-6 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.map((o) => (
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
                      <TableCell className="text-right">{formatCurrency(o.total)}</TableCell>
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

        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Share of top product revenue this period</CardDescription>
            </div>
            <Link
              href="/admin/products"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.topProductsWithShare.map((p, i) => (
              <div key={p.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium">
                    {i + 1}
                  </span>
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(p.sold)} sold</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium tabular-nums">{formatCurrency(p.revenue)}</p>
                </div>
                <div className="ml-9 h-2 overflow-hidden rounded-full bg-muted sm:ml-12">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                    style={{ width: `${p.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
