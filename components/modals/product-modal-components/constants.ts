import { MARKETPLACE_FILTERS } from "@/lib/constants";

export const CATEGORY_OPTIONS = MARKETPLACE_FILTERS.Categories.map((category) => ({
  value: category,
  label: category,
}));

export const VARIATION_GROUP_OPTIONS = (["Color", "Material", "Size"] as const).map((label) => ({
  value: label,
  label,
}));
