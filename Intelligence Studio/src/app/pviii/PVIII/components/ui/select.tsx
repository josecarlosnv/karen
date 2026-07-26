"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "./utils";

// Filter out Figma-specific props
const filterFigmaProps = (props: Record<string, any>) => {
  const filtered = { ...props };
  Object.keys(filtered).forEach(key => {
    if (key.startsWith('_fg')) {
      delete filtered[key];
    }
  });
  return filtered;
};

// Wrapper components for icons to filter Figma props
const ChevronDown = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof ChevronDownIcon>
>((props, ref) => <ChevronDownIcon {...filterFigmaProps(props)} ref={ref} />);
ChevronDown.displayName = "ChevronDown";

const ChevronUp = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof ChevronUpIcon>
>((props, ref) => <ChevronUpIcon {...filterFigmaProps(props)} ref={ref} />);
ChevronUp.displayName = "ChevronUp";

const Check = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof CheckIcon>
>((props, ref) => <CheckIcon {...filterFigmaProps(props)} ref={ref} />);
Check.displayName = "Check";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...filterFigmaProps(props)} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...filterFigmaProps(props)} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...filterFigmaProps(props)} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
  "flex w-full items-center justify-between gap-2 " +
  "h-9 px-3 rounded-md " +
  "bg-white border border-[#00338D]/10 " +
  "text-[14px] font-normal text-[#00338D] " +
  "placeholder:text-[#00338D]/50 " +
  "outline-none transition-colors " +
  "focus:border-[#1E49E2] focus:ring-1 focus:ring-[#1E49E2]/30 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "[&_svg]:size-4 [&_svg]:text-[#00338D]/50 [&_svg]:shrink-0",
  className,
)}
      {...filterFigmaProps(props)}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
  "bg-white text-[#00338D] " +
  "border border-[#00338D]/10 rounded-md " +
  "shadow-[0_6px_18px_rgba(0,51,141,0.10)] " +
  "z-50 max-h-56 overflow-y-auto",
  position === "popper" &&
    "data-[side=bottom]:translate-y-1",
  className,
)}
        position={position}
        {...filterFigmaProps(props)}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...filterFigmaProps(props)}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
  "relative flex w-full items-center gap-2 " +
  "px-2 py-1.5 rounded-sm cursor-default select-none " +
  "text-[14px] font-normal text-[#00338D] " +
  "focus:bg-[#00338D]/5 focus:text-[#00338D] " +
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
  "[&_svg]:size-4 [&_svg]:text-[#00338D]/50 [&_svg]:shrink-0",
  className,
)}
      {...filterFigmaProps(props)}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...filterFigmaProps(props)}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...filterFigmaProps(props)}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...filterFigmaProps(props)}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};