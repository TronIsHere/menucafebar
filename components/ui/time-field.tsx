"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/numerals";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TimeFieldProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  className?: string;
  /** Granularity of the minute list (defaults to 5 minutes). */
  minuteStep?: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDisplay(hour: number, minute: number) {
  return `${toPersianDigits(pad(hour))}:${toPersianDigits(pad(minute))}`;
}

interface PickerColumnProps {
  label: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  scrollKey?: boolean;
}

function PickerColumn({ label, options, value, onChange, scrollKey }: PickerColumnProps) {
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      selectedRef.current?.scrollIntoView({ block: "center" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [value, scrollKey]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-2 text-center text-sm font-medium text-muted-foreground">{label}</p>
      <div
        className="max-h-56 overflow-y-auto overscroll-contain rounded-lg border border-input [-webkit-overflow-scrolling:touch]"
      >
        {options.map((n) => {
          const selected = n === value;
          return (
            <button
              key={n}
              ref={selected ? selectedRef : undefined}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "flex h-12 w-full items-center justify-center text-xl font-medium transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted active:bg-muted"
              )}
            >
              {toPersianDigits(pad(n))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 24-hour time picker for Persian operators. Native `<select>` popups cram every
 * option onto mobile screens, so we use a bottom sheet with large tappable rows.
 */
export function TimeField({
  value,
  onChange,
  onBlur,
  id,
  className,
  minuteStep = 5,
}: TimeFieldProps) {
  const [open, setOpen] = React.useState(false);

  const [rawHour, rawMinute] = (value ?? "").split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  const safeHour = Number.isNaN(hour) ? 8 : Math.min(Math.max(hour, 0), 23);
  const safeMinute = Number.isNaN(minute) ? 0 : Math.min(Math.max(minute, 0), 59);

  const [draftHour, setDraftHour] = React.useState(safeHour);
  const [draftMinute, setDraftMinute] = React.useState(safeMinute);

  const hourOptions = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    []
  );
  const minuteOptions = React.useMemo(() => {
    const opts: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) opts.push(m);
    if (!opts.includes(safeMinute)) {
      opts.push(safeMinute);
      opts.sort((a, b) => a - b);
    }
    return opts;
  }, [minuteStep, safeMinute]);

  function openPicker() {
    setDraftHour(safeHour);
    setDraftMinute(safeMinute);
    setOpen(true);
  }

  function confirm() {
    onChange(`${pad(draftHour)}:${pad(draftMinute)}`);
    setOpen(false);
    onBlur?.();
  }

  function handleOpenChange(next: boolean) {
    if (!next) onBlur?.();
    setOpen(next);
  }

  return (
    <>
      <button
        id={id}
        type="button"
        dir="ltr"
        onClick={openPicker}
        className={cn(
          "flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm",
          className
        )}
      >
        {formatDisplay(safeHour, safeMinute)}
      </button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader className="pb-2">
            <SheetTitle>انتخاب ساعت</SheetTitle>
          </SheetHeader>

          <div dir="ltr" className="flex items-start gap-3 px-1">
            <PickerColumn
              label="ساعت"
              options={hourOptions}
              value={draftHour}
              onChange={setDraftHour}
              scrollKey={open}
            />
            <span className="mt-10 text-2xl font-medium text-muted-foreground">:</span>
            <PickerColumn
              label="دقیقه"
              options={minuteOptions}
              value={draftMinute}
              onChange={setDraftMinute}
              scrollKey={open}
            />
          </div>

          <p className="my-4 text-center text-3xl font-semibold tabular-nums">
            {formatDisplay(draftHour, draftMinute)}
          </p>

          <Button type="button" className="w-full" onClick={confirm}>
            تایید
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
