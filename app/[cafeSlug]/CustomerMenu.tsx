"use client";

import type { TemplateProps } from "./templates/types";
import { useInitTableFromUrl } from "@/hooks/useInitTableFromUrl";
import ClassicTemplate   from "./templates/ClassicTemplate";
import ModernTemplate    from "./templates/ModernTemplate";
import ColorfulTemplate  from "./templates/ColorfulTemplate";
import NaturalTemplate   from "./templates/NaturalTemplate";
import DarkTemplate      from "./templates/DarkTemplate";
import WarmTemplate      from "./templates/WarmTemplate";
import OceanTemplate     from "./templates/OceanTemplate";
import ChocolateTemplate from "./templates/ChocolateTemplate";

const TEMPLATE_MAP: Record<string, React.ComponentType<TemplateProps>> = {
  classic:   ClassicTemplate,
  modern:    ModernTemplate,
  colorful:  ColorfulTemplate,
  natural:   NaturalTemplate,
  dark:      DarkTemplate,
  warm:      WarmTemplate,
  ocean:     OceanTemplate,
  chocolate: ChocolateTemplate,
};

interface RawTemplate {
  primaryColor: string;
  accentColor: string;
  bgColor?: string;
  cardBg?: string;
  textColor?: string;
  darkMode?: boolean;
  templateKey?: string;
}

interface Props {
  cafe: TemplateProps["cafe"];
  categories: TemplateProps["categories"];
  items: TemplateProps["items"];
  template: RawTemplate | null;
  tableFromUrl?: string;
}

export default function CustomerMenu({ cafe, categories, items, template, tableFromUrl }: Props) {
  useInitTableFromUrl(tableFromUrl, cafe.tableNumbers);
  const key = template?.templateKey ?? "classic";
  const Component = TEMPLATE_MAP[key] ?? ClassicTemplate;

  const resolved: TemplateProps["template"] = {
    primaryColor: template?.primaryColor ?? "#1a1a1a",
    accentColor:  template?.accentColor  ?? "#c8a96e",
    bgColor:      template?.bgColor      ?? "#ffffff",
    cardBg:       template?.cardBg       ?? "#fafafa",
    textColor:    template?.textColor    ?? "#1a1a1a",
    darkMode:     template?.darkMode     ?? false,
    templateKey:  key,
  };

  return <Component cafe={cafe} categories={categories} items={items} template={resolved} />;
}
