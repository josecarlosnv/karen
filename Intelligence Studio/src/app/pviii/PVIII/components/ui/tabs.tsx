"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";

/* =========================
   Tabs Root
========================= */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/* =========================
   Tabs List
========================= */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-[#00266A] inline-flex h-11 w-fit min-w-[420px] items-center rounded-full p-[5px]",
        className,
      )}
      {...props}
    />
  );
}

/* =========================
   Tabs Trigger ✅ FIXED
========================= */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      {...props}
     className={cn(
  // base
  "inline-flex h-full flex-1 items-center justify-center rounded-full px-6 text-[12px] font-normal tracking-[0.06em] whitespace-nowrap transition-all duration-200",

  // inactive
  "text-white/55",

  // hover
  "hover:text-white/85",

  // active
  "data-[state=active]:text-white",
  "data-[state=active]:bg-white/15",
  "data-[state=active]:shadow-[0_0_20px_rgba(255,255,255,0.25)]",

  className,
)}
    />
  );
}

/* =========================
   Tabs Content
========================= */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };