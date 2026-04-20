"use client";

import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { PRODUCTS, searchProducts, type MockProduct } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name" },
] as const;

const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();

function useProductQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (val === null || val === undefined || val === "") next.delete(key);
        else next.set(key, val);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { searchParams, setParams };
}

function filterAndSort(
  list: MockProduct[],
  sort: string
): MockProduct[] {
  const next = [...list];
  switch (sort) {
    case "price-asc":
      next.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      next.sort((a, b) => b.price - a.price);
      break;
    case "name":
      next.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating":
    default:
      next.sort((a, b) => b.rating - a.rating);
      break;
  }
  return next;
}

function FilterBlock({
  category,
  min,
  max,
  brands,
  categoryHref,
  onBrandToggle,
  onMinChange,
  onMaxChange,
  onClearCategory,
  onClearBrands,
  onClearPrice,
  onAfterNavigate,
}: {
  category: string;
  min: string;
  max: string;
  brands: string[];
  categoryHref: (slug: string | null) => string;
  onBrandToggle: (brand: string, checked: boolean) => void;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  onClearCategory: () => void;
  onClearBrands: () => void;
  onClearPrice: () => void;
  onAfterNavigate?: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <button
              type="button"
              onClick={() => {
                onClearCategory();
                onAfterNavigate?.();
              }}
              className={cn(
                "text-left text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                !category && "font-medium text-foreground"
              )}
            >
              All products
            </button>
          </li>
          {PRODUCT_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryHref(c.slug)}
                onClick={() => onAfterNavigate?.()}
                className={cn(
                  "block text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  category === c.slug && "font-medium text-foreground"
                )}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-semibold">Price</h3>
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <Label htmlFor="filter-min">Min</Label>
            <Input
              id="filter-min"
              inputMode="decimal"
              placeholder="0"
              value={min}
              onChange={(e) => onMinChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="filter-max">Max</Label>
            <Input
              id="filter-max"
              inputMode="decimal"
              placeholder="Any"
              value={max}
              onChange={(e) => onMaxChange(e.target.value)}
            />
          </div>
          <Button type="button" variant="ghost" size="sm" className="self-start px-0" onClick={onClearPrice}>
            Clear price
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Brand</h3>
          {brands.length ? (
            <button
              type="button"
              onClick={onClearBrands}
              className="text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Clear
            </button>
          ) : null}
        </div>
        <ul className="space-y-2">
          {BRANDS.map((brand, i) => (
            <li key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-filter-${i}`}
                checked={brands.includes(brand)}
                onCheckedChange={(c) => onBrandToggle(brand, c === true)}
              />
              <Label htmlFor={`brand-filter-${i}`} className="cursor-pointer font-normal">
                {brand}
              </Label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProductsCatalogInner() {
  const { searchParams, setParams } = useProductQuery();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "rating";
  const min = searchParams.get("min") ?? "";
  const max = searchParams.get("max") ?? "";
  const brandsParam = searchParams.get("brands");
  const selectedBrands = brandsParam ? brandsParam.split(",").filter(Boolean) : [];

  const categoryHref = useCallback(
    (slug: string | null) => {
      const p = new URLSearchParams(searchParams.toString());
      if (slug) p.set("category", slug);
      else p.delete("category");
      const s = p.toString();
      return s ? `/products?${s}` : "/products";
    },
    [searchParams]
  );

  const filtered = useMemo(() => {
    let list: MockProduct[] = PRODUCTS;
    if (q.trim()) {
      const hit = new Set(searchProducts(q.trim()).map((p) => p.id));
      list = list.filter((p) => hit.has(p.id));
    }
    if (category) list = list.filter((p) => p.categorySlug === category);
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    const minN = parseFloat(min);
    const maxN = parseFloat(max);
    if (min !== "" && !Number.isNaN(minN)) list = list.filter((p) => p.price >= minN);
    if (max !== "" && !Number.isNaN(maxN)) list = list.filter((p) => p.price <= maxN);
    return filterAndSort(list, sort);
  }, [category, q, sort, min, max, selectedBrands]);

  function onBrandToggle(brand: string, checked: boolean) {
    const set = new Set(selectedBrands);
    if (checked) set.add(brand);
    else set.delete(brand);
    const next = [...set];
    setParams({ brands: next.length ? next.join(",") : null });
  }

  function applyMobileFilters(next: { min: string; max: string; brands: string[] }) {
    setParams({
      min: next.min || null,
      max: next.max || null,
      brands: next.brands.length ? next.brands.join(",") : null,
    });
    setMobileFiltersOpen(false);
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shop</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {filtered.length} product{filtered.length === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
            {category
              ? ` in ${PRODUCT_CATEGORIES.find((c) => c.slug === category)?.name ?? category}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
              <SlidersHorizontal className="size-4" />
              Filters
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,360px)] gap-0 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="p-4 pt-0">
                <MobileFiltersForm
                  category={category}
                  categoryHref={categoryHref}
                  initialMin={min}
                  initialMax={max}
                  initialBrands={selectedBrands}
                  onApply={applyMobileFilters}
                  onClearCategory={() => setParams({ category: null })}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Select
            value={SORT_OPTIONS.some((o) => o.value === sort) ? sort : "rating"}
            onValueChange={(v: string | null) => {
              if (!v) return;
              setParams({ sort: v === "rating" ? null : v });
            }}
          >
            <SelectTrigger className="w-[200px] min-w-0 sm:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-xl border border-border bg-card p-4">
            <FilterBlock
              category={category}
              categoryHref={categoryHref}
              min={min}
              max={max}
              brands={selectedBrands}
              onBrandToggle={onBrandToggle}
              onMinChange={(v) => setParams({ min: v || null })}
              onMaxChange={(v) => setParams({ max: v || null })}
              onClearCategory={() => setParams({ category: null })}
              onClearBrands={() => setParams({ brands: null })}
              onClearPrice={() => {
                setParams({ min: null, max: null });
              }}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              No products match your filters.{" "}
              <button
                type="button"
                onClick={() =>
                  setParams({
                    category: null,
                    q: null,
                    min: null,
                    max: null,
                    brands: null,
                    sort: null,
                  })
                }
                className="font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Reset filters
              </button>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileFiltersForm({
  category,
  categoryHref,
  initialMin,
  initialMax,
  initialBrands,
  onApply,
  onClearCategory,
  onClose,
}: {
  category: string;
  categoryHref: (slug: string | null) => string;
  initialMin: string;
  initialMax: string;
  initialBrands: string[];
  onApply: (next: { min: string; max: string; brands: string[] }) => void;
  onClearCategory: () => void;
  onClose: () => void;
}) {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [brands, setBrands] = useState(initialBrands);

  useEffect(() => {
    setMin(initialMin);
    setMax(initialMax);
    setBrands(initialBrands);
  }, [initialMin, initialMax, initialBrands]);

  return (
    <>
      <FilterBlock
        category={category}
        categoryHref={categoryHref}
        min={min}
        max={max}
        brands={brands}
        onBrandToggle={(b, c) => {
          setBrands((prev) => {
            const s = new Set(prev);
            if (c) s.add(b);
            else s.delete(b);
            return [...s];
          });
        }}
        onMinChange={setMin}
        onMaxChange={setMax}
        onClearCategory={() => {
          onClearCategory();
          onClose();
        }}
        onClearBrands={() => setBrands([])}
        onClearPrice={() => {
          setMin("");
          setMax("");
        }}
        onAfterNavigate={onClose}
      />
      <Button type="button" className="mt-6 w-full" onClick={() => onApply({ min, max, brands })}>
        Apply filters
      </Button>
    </>
  );
}

function ProductsFallback() {
  return (
    <div className="container-page space-y-6 py-8">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsCatalogInner />
    </Suspense>
  );
}
