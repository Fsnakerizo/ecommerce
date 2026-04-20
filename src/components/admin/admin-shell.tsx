"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Logo } from "@/components/logo";
import { SITE_CONFIG } from "@/lib/constants";
import { getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type NavItem = { href: string; label: string; icon: React.ElementType; exact?: boolean };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
    ],
  },
  {
    label: "Customers",
    items: [{ href: "/admin/customers", label: "Customers", icon: Users }],
  },
  {
    label: "Marketing",
    items: [{ href: "/admin/coupons", label: "Coupons", icon: Tag }],
  },
  {
    label: "Shipping",
    items: [{ href: "/admin/shipping", label: "Shipping", icon: Truck }],
  },
];

const DASHBOARD_ITEM: NavItem = {
  href: "/admin",
  label: "Dashboard",
  icon: LayoutDashboard,
  exact: true,
};

function isNavActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href || pathname === `${item.href}/`;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function breadcrumbFromPath(pathname: string) {
  if (pathname === "/admin" || pathname === "/admin/") {
    return [{ href: "/admin", label: "Dashboard", current: true }];
  }
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const crumbs: { href: string; label: string; current?: boolean }[] = [
    { href: "/admin", label: "Dashboard" },
  ];
  const rest = segments.slice(1);
  const labels: Record<string, string> = {
    orders: "Orders",
    products: "Products",
    customers: "Customers",
    inventory: "Inventory",
    payments: "Payments",
    shipping: "Shipping",
    coupons: "Coupons",
    settings: "Settings",
    new: "New",
  };
  let acc = "/admin";
  for (let i = 0; i < rest.length; i++) {
    const seg = rest[i];
    acc += `/${seg}`;
    const isLast = i === rest.length - 1;
    const label =
      seg.startsWith("ord_") ? "Order" : labels[seg] ?? seg.replace(/-/g, " ");
    crumbs.push({ href: acc, label, current: isLast });
  }
  return crumbs;
}

function SidebarNav({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md border-l-2 py-2 text-sm transition-colors",
      collapsed ? "justify-center px-0" : "px-3",
      active
        ? "border-primary bg-primary/10 font-medium text-primary"
        : "border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground"
    );

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
      <Link
        href={DASHBOARD_ITEM.href}
        onClick={onNavigate}
        title={collapsed ? DASHBOARD_ITEM.label : undefined}
        className={linkClass(isNavActive(pathname, DASHBOARD_ITEM))}
      >
        <DASHBOARD_ITEM.icon className="size-4 shrink-0" />
        {!collapsed && DASHBOARD_ITEM.label}
      </Link>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mt-4 space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {group.label}
            </p>
          )}
          {collapsed && <Separator className="my-2" />}
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={linkClass(isNavActive(pathname, item))}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSignOut = React.useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }, [router]);

  React.useEffect(() => {
    const stored = window.localStorage.getItem("aquaflow-admin-sidebar");
    if (stored === "collapsed") setCollapsed(true);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("aquaflow-admin-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  const user = session?.user;
  const name = user?.name ?? "Admin User";
  const email = user?.email ?? "admin@aquaflow.store";
  const image = user?.image;

  const crumbs = breadcrumbFromPath(pathname);

  const sidebarInner = (
    <>
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b px-3",
          collapsed ? "justify-center" : "gap-2"
        )}
      >
        <Link href="/admin" className="flex min-w-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Logo size="md" showText={!collapsed} />
        </Link>
      </div>
      <SidebarNav pathname={pathname} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
      <div className="mt-auto border-t p-2">
        {!collapsed ? (
          <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar size="sm">
              {image ? <AvatarImage src={image} alt="" /> : null}
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        ) : (
          <div className="mb-2 flex justify-center">
            <Avatar size="sm">
              {image ? <AvatarImage src={image} alt="" /> : null}
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>
        )}
        {collapsed ? (
          <Link
            href="/admin/settings"
            title="Settings"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "mb-1 w-full")}
          >
            <Settings className="size-4" />
          </Link>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mb-1 w-full justify-start gap-2"
            nativeButton={false}
            render={<Link href="/admin/settings" />}
          >
            <Settings className="size-4" />
            Settings
          </Button>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon-sm" : "sm"}
          title={collapsed ? "Sign out" : undefined}
          className={cn("w-full", collapsed ? "" : "justify-start gap-2")}
          onClick={() => void handleSignOut()}
        >
          <LogOut className="size-4" />
          {!collapsed && "Sign out"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn("mt-2 w-full", collapsed && "size-8 p-0")}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && "Collapse"}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-card transition-[width] duration-200 md:flex",
            collapsed ? "w-16" : "w-[280px]"
          )}
        >
          {sidebarInner}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon-sm" className="md:hidden">
                    <Menu className="size-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                }
              />
              <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[280px]">
                <div className="flex h-full flex-col">
                  <div className="flex h-14 items-center border-b px-3">
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <Logo showText />
                    </Link>
                  </div>
                  <SidebarNav pathname={pathname} collapsed={false} onNavigate={() => setMobileOpen(false)} />
                  <div className="mt-auto border-t p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2"
                      nativeButton={false}
                      render={<Link href="/admin/settings" />}
                    >
                      <Settings className="size-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setMobileOpen(false);
                        void handleSignOut();
                      }}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Breadcrumb className="min-w-0 flex-1">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem>
                  <span className="text-xs text-muted-foreground">{SITE_CONFIG.name}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {crumbs.map((c, i) => (
                  <React.Fragment key={`${c.href}-${i}`}>
                    <BreadcrumbItem>
                      {c.current ? (
                        <BreadcrumbPage className="max-w-[140px] truncate text-sm md:max-w-none">
                          {c.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          className="max-w-[120px] truncate text-sm md:max-w-none"
                          render={<Link href={c.href} />}
                        >
                          {c.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {i < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button size="sm" className="hidden gap-2 sm:inline-flex" />}
              >
                <Plus className="size-4" />
                Quick add
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = "/admin/products/new";
                  }}
                >
                  Add product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = "/admin/orders/new";
                  }}
                >
                  Create order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="rounded-full">
                    <Avatar size="sm">
                      {image ? <AvatarImage src={image} alt="" /> : null}
                      <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="block truncate text-sm font-medium">{name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{email}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/admin/settings" />}>Profile</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/admin/settings" />}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => void handleSignOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
  );
}
