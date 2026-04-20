"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Droplets,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
  ShoppingCart,
  Sprout,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const CATEGORY_ICONS = {
  Droplets,
  Wrench,
  Gauge,
  Sprout,
} as const;

export function StorefrontHeader() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const itemCount = useCart((s) => s.itemCount);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = session?.user?.role === "ADMIN";
  const isCustomer = status === "authenticated" && !isAdmin;
  const safeCount = mounted ? itemCount() : 0;

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }, [router]);

  const categoryLinks = useMemo(
    () =>
      PRODUCT_CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICONS[c.icon];
        return { ...c, Icon };
      }),
    []
  );

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/products${params.toString() ? `?${params}` : ""}`);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top utility bar */}
      <div className="bg-foreground text-background">
        <div className="container-page flex items-center justify-between gap-2 py-2 text-xs">
          {isAdmin ? (
            <span className="truncate font-medium">
              You are signed in as Admin
            </span>
          ) : (
            <span className="truncate font-medium">Free shipping on orders over $49</span>
          )}
          <nav aria-label="Utility links" className="flex shrink-0 items-center gap-3 sm:gap-4">
            {isAdmin ? (
              <Link
                href="/admin"
                className="flex items-center gap-1 rounded-sm font-medium underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-background/80 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                <LayoutDashboard className="size-3" aria-hidden />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <a
                  href="tel:+18005550199"
                  className="hidden rounded-sm underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-background/80 focus-visible:ring-offset-1 focus-visible:outline-none sm:inline"
                >
                  1-800-555-0199
                </a>
                <Link
                  href="/account"
                  className="rounded-sm underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-background/80 focus-visible:ring-offset-1 focus-visible:outline-none"
                >
                  Track Order
                </Link>
                <Link
                  href="/products"
                  className="rounded-sm underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-background/80 focus-visible:ring-offset-1 focus-visible:outline-none"
                >
                  Help
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="container-page flex items-center gap-3 py-3 sm:gap-4">
        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,320px)] gap-0 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4 pt-0">
              <form onSubmit={submitSearch} role="search" className="flex gap-2">
                <label htmlFor="mobile-search" className="sr-only">Search products</label>
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  type="search"
                  autoComplete="off"
                  className="h-9 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" size="icon" variant="secondary" aria-label="Submit search">
                  <Search className="size-4" aria-hidden="true" />
                </Button>
              </form>

              <Collapsible defaultOpen>
                <CollapsibleTrigger
                  render={<Button variant="outline" className="flex w-full justify-between" />}
                >
                  Categories
                  <ChevronDown className="size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 flex flex-col gap-1 border-l pl-3">
                  {categoryLinks.map(({ slug, name, Icon }) => (
                    <Link
                      key={slug}
                      href={`/products?category=${slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Icon className="size-4 text-primary" />
                      {name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <div className="flex flex-col gap-2 border-t pt-4">
                {status === "authenticated" ? (
                  <>
                    {isAdmin ? (
                      <Button
                        nativeButton={false}
                        render={<Link href="/admin" />}
                        onClick={() => setMobileOpen(false)}
                        className="gap-1.5"
                      >
                        <LayoutDashboard className="size-4" />
                        Admin Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          nativeButton={false}
                          render={<Link href="/account" />}
                          onClick={() => setMobileOpen(false)}
                        >
                          My Account
                        </Button>
                        <Button
                          variant="outline"
                          nativeButton={false}
                          render={<Link href="/cart" />}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="flex items-center gap-2">
                            <ShoppingCart className="size-4" />
                            Cart{safeCount > 0 ? ` (${safeCount})` : ""}
                          </span>
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMobileOpen(false);
                        void handleSignOut();
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      nativeButton={false}
                      render={<Link href="/login" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/register" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Button>
                    <Button
                      variant="outline"
                      nativeButton={false}
                      render={<Link href="/cart" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="size-4" />
                        Cart{safeCount > 0 ? ` (${safeCount})` : ""}
                      </span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Logo size="md" />
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={submitSearch}
          role="search"
          className="mx-auto hidden max-w-xl flex-1 lg:flex"
        >
          <div className="flex h-10 w-full rounded-lg border border-border bg-card shadow-sm transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <label htmlFor="desktop-search" className="sr-only">Search products</label>
            <input
              id="desktop-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search irrigation products…"
              type="search"
              autoComplete="off"
              className="h-full min-w-0 flex-1 rounded-l-lg bg-transparent px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="flex h-full shrink-0 items-center gap-1.5 rounded-r-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-7 w-24 animate-pulse rounded-md bg-muted" aria-hidden />
          ) : status === "authenticated" ? (
            <>
              {/* Admin: show dashboard button instead of cart */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/admin" />}
                  className="hidden gap-1.5 sm:inline-flex"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="gap-2 px-2" aria-label="Account menu" />
                  }
                >
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                    {session.user?.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{session.user?.name}</span>
                        <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <LayoutDashboard className="mr-2 size-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/account")}>My Account</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/cart")}>
                        <ShoppingCart className="mr-2 size-4" />
                        Cart{safeCount > 0 ? ` (${safeCount})` : ""}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => void handleSignOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart icon — only for customers and guests */}
              {!isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  render={<Link href="/cart" />}
                  className="relative min-h-[44px] min-w-[44px]"
                  aria-label={safeCount > 0 ? `Cart, ${safeCount} item${safeCount !== 1 ? "s" : ""}` : "Cart, empty"}
                >
                  <ShoppingCart className="size-5" aria-hidden="true" />
                  {safeCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground" aria-hidden="true">
                      {safeCount > 99 ? "99+" : safeCount}
                    </span>
                  ) : null}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
                Sign in
              </Button>
              <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
                Register
              </Button>
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={<Link href="/cart" />}
                className="relative min-h-[44px] min-w-[44px]"
                aria-label={safeCount > 0 ? `Cart, ${safeCount} item${safeCount !== 1 ? "s" : ""}` : "Cart, empty"}
              >
                <ShoppingCart className="size-5" aria-hidden="true" />
                {safeCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground" aria-hidden="true">
                    {safeCount > 99 ? "99+" : safeCount}
                  </span>
                ) : null}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Category nav */}
      <nav
        aria-label="Product categories"
        className="hidden border-t border-border bg-muted/30 lg:block"
      >
        <div className="container-page flex items-center justify-center gap-2 py-2.5">
          {categoryLinks.map(({ slug, name, Icon }) => (
            <Link
              key={slug}
              href={`/products?category=${slug}`}
              className={cn(
                "group flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                "text-muted-foreground hover:bg-primary/8 hover:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="size-3.5" />
              </span>
              {name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
