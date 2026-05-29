"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/icons/registry";
import { CATEGORY_ICON_MAP } from "@/lib/icons/category-icons";
import { X } from "@/lib/icons/app-icons";

type IconPickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icons?: readonly string[];
};

export default function IconPicker({
  value,
  onChange,
  label = "آیکون",
  icons = CATEGORY_ICONS,
}: IconPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            حذف آیکون
          </button>
        )}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1 rounded-lg border border-border p-2">
        {icons.map((id) => {
          const Icon = CATEGORY_ICON_MAP[id as keyof typeof CATEGORY_ICON_MAP];
          if (!Icon) return null;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors",
                value === id && "bg-primary/10 ring-1 ring-primary"
              )}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
