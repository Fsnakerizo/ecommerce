"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GripVertical, ImagePlus, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProductImage {
  id: string;
  file: File;
  preview: string;
}

function useProductImages() {
  const [images, setImages] = React.useState<ProductImage[]>([]);
  const [featuredId, setFeaturedId] = React.useState<string | null>(null);

  const addFiles = React.useCallback((files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (incoming.length === 0) {
      toast.error("Only image files are accepted");
      return;
    }
    const newImages: ProductImage[] = incoming.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const updated = [...prev, ...newImages];
      if (updated.length > 0 && !featuredId) {
        setFeaturedId(updated[0].id);
      }
      return updated;
    });
  }, [featuredId]);

  const removeImage = React.useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      const updated = prev.filter((i) => i.id !== id);
      return updated;
    });
    setFeaturedId((prev) => {
      if (prev !== id) return prev;
      return images.find((i) => i.id !== id)?.id ?? null;
    });
  }, [images]);

  const reorder = React.useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  React.useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { images, featuredId, setFeaturedId, addFiles, removeImage, reorder };
}

function ImageUploadZone({
  images,
  featuredId,
  onAdd,
  onRemove,
  onSetFeatured,
  onReorder,
}: {
  images: ProductImage[];
  featuredId: string | null;
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  onSetFeatured: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      onAdd(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleItemDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleItemDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  }

  function handleItemDragEnd() {
    setDraggedIndex(null);
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => {
            const isFeatured = img.id === featuredId;
            return (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleItemDragStart(index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDragEnd={handleItemDragEnd}
                className={cn(
                  "group relative aspect-square cursor-grab overflow-hidden rounded-lg border-2 bg-muted/30 transition-all active:cursor-grabbing",
                  isFeatured ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
                  draggedIndex === index && "opacity-50"
                )}
              >
                <Image
                  src={img.preview}
                  alt={img.file.name}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {isFeatured && (
                  <span className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow">
                    <Star className="size-3" aria-hidden />
                    Featured
                  </span>
                )}

                <div className="absolute inset-0 flex items-start justify-end gap-1 bg-gradient-to-t from-black/40 via-transparent to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute top-1.5 left-1.5">
                    <GripVertical className="size-4 text-white drop-shadow" aria-hidden />
                  </div>
                  <div className="flex gap-1">
                    {!isFeatured && (
                      <button
                        type="button"
                        onClick={() => onSetFeatured(img.id)}
                        className="flex size-7 items-center justify-center rounded-md bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-primary"
                        title="Set as featured image"
                        aria-label={`Set ${img.file.name} as featured image`}
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(img.id)}
                      className="flex size-7 items-center justify-center rounded-md bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-destructive"
                      title="Remove image"
                      aria-label={`Remove ${img.file.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
            aria-label="Add more images"
          >
            <ImagePlus className="size-6" />
            <span className="text-xs font-medium">Add more</span>
          </button>
        </div>
      )}

      {images.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40"
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Upload className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drag & drop images here
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              PNG, JPG, GIF, WebP — up to 5 MB each
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="mr-1.5 size-4" />
            Browse files
          </Button>
        </div>
      )}

      {images.length > 0 && images.length === 0 /* never, but for drop zone */ ? null : (
        <div
          onDrop={images.length > 0 ? handleDrop : undefined}
          onDragOver={images.length > 0 ? handleDragOver : undefined}
          onDragLeave={images.length > 0 ? () => setDragOver(false) : undefined}
          className={cn(
            "rounded-lg border border-dashed px-4 py-2 text-center text-xs text-muted-foreground transition-colors",
            images.length === 0 && "hidden",
            dragOver ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          Drop more images here or click &quot;Add more&quot; above
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) onAdd(e.target.files);
          e.target.value = "";
        }}
        aria-label="Upload product images"
      />

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""} · Drag to reorder · Click
          <Star className="mx-0.5 inline size-3" aria-hidden /> to set featured
        </p>
      )}
    </div>
  );
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [shortDescription, setShortDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [compareAt, setCompareAt] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [lowStock, setLowStock] = React.useState("20");
  const [category, setCategory] = React.useState(PRODUCT_CATEGORIES[0]?.slug ?? "");
  const [brand, setBrand] = React.useState("");
  const [tags, setTags] = React.useState("");
  const { images, featuredId, setFeaturedId, addFiles, removeImage, reorder } = useProductImages();

  React.useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Product saved!", {
      description: `${images.length} image${images.length !== 1 ? "s" : ""} attached.`,
    });
    router.push("/admin/products");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 md:p-8">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1" nativeButton={false} render={<Link href="/admin/products" />}>
        ← Products
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add product</h1>
        <p className="text-muted-foreground">Create a new catalog item</p>
      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Product information</CardTitle>
            <CardDescription>How this product appears to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short">Short description</Label>
              <Input id="short" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product images</CardTitle>
            <CardDescription>
              Upload images for the product gallery. The featured image is shown on product cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadZone
              images={images}
              featuredId={featuredId}
              onAdd={addFiles}
              onRemove={removeImage}
              onSetFeatured={setFeaturedId}
              onReorder={reorder}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compare">Compare-at price</Label>
              <Input id="compare" type="number" min={0} step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" min={0} step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock quantity</Label>
              <Input id="stock" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="low">Low stock threshold</Label>
              <Input id="low" type="number" min={0} value={lowStock} onChange={(e) => setLowStock(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v ?? PRODUCT_CATEGORIES[0]?.slug ?? "")}
              >
                <SelectTrigger className="w-full min-w-0 sm:max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="Comma-separated" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" nativeButton={false} render={<Link href="/admin/products" />}>
            Cancel
          </Button>
          <Button type="submit">Save product</Button>
        </div>
      </form>
    </div>
  );
}
