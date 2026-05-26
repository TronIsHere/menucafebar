"use client";

import { cn } from "@/lib/utils";

interface Props {
  tableNumbers: string[];
  occupied: string[];
  selected?: string;
  onSelect: (tableNumber: string) => void;
  disabled?: boolean;
}

export default function TablePicker({
  tableNumbers,
  occupied,
  selected,
  onSelect,
  disabled,
}: Props) {
  if (tableNumbers.length === 0) return null;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {tableNumbers.map((num) => {
        const isOccupied = occupied.includes(num);
        const isSelected = selected === num;

        return (
          <button
            key={num}
            type="button"
            disabled={disabled || isOccupied}
            onClick={() => onSelect(num)}
            className={cn(
              "aspect-square rounded-lg border-2 text-sm font-semibold transition-colors",
              isOccupied &&
                "border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-60",
              !isOccupied &&
                isSelected &&
                "border-primary bg-primary text-primary-foreground",
              !isOccupied &&
                !isSelected &&
                "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}

interface TableStatusGridProps {
  tableNumbers: string[];
  occupied: string[];
}

export function TableStatusGrid({ tableNumbers, occupied }: TableStatusGridProps) {
  if (tableNumbers.length === 0) return null;

  const freeCount = tableNumbers.filter((t) => !occupied.includes(t)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">وضعیت میزها</p>
        <p className="text-xs text-muted-foreground">
          {freeCount} خالی · {occupied.length} اشغال
        </p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {tableNumbers.map((num) => {
          const isOccupied = occupied.includes(num);
          return (
            <div
              key={num}
              className={cn(
                "aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold",
                isOccupied
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-green-200 bg-green-50 text-green-700"
              )}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
