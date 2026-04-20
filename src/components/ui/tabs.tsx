"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-row gap-4" : "flex-col gap-3",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "inline-flex w-fit items-center text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "h-9 gap-0.5 rounded-lg bg-muted p-1",
        line:
          "h-10 gap-1 border-b border-border bg-transparent px-0",
      },
      orientation: {
        horizontal: "",
        vertical: "h-fit w-48 flex-col items-stretch",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
    },
  }
)

type TabsListProps = TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants> & {
    orientation?: "horizontal" | "vertical"
  }

function TabsList({
  className,
  variant = "default",
  orientation = "horizontal",
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant, orientation }), className)}
      {...props}
    />
  )
}

const tabsTriggerVariants = cva(
  "relative inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "h-full flex-1 rounded-md px-3 text-muted-foreground hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm",
        line:
          "h-full border-b-2 border-transparent px-3 text-muted-foreground hover:text-foreground data-active:border-primary data-active:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TabsTriggerProps = TabsPrimitive.Tab.Props &
  VariantProps<typeof tabsTriggerVariants>

function TabsTrigger({
  className,
  variant = "default",
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
