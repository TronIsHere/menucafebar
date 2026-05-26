"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/stores/cart";

export function resolveTableFromUrl(
  tableFromUrl: string | undefined,
  tableNumbers: string[] | undefined
): string | null {
  const table = tableFromUrl?.trim();
  if (!table) return null;

  const defined = tableNumbers ?? [];
  if (defined.length > 0 && !defined.includes(table)) return null;

  return table;
}

export function useInitTableFromUrl(
  tableFromUrl: string | undefined,
  tableNumbers: string[] | undefined
) {
  const setTableNumber = useCartStore((s) => s.setTableNumber);

  useEffect(() => {
    const table = resolveTableFromUrl(tableFromUrl, tableNumbers);
    if (table) setTableNumber(table);
  }, [tableFromUrl, tableNumbers, setTableNumber]);
}
