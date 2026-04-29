import { VARIATION_GROUP_OPTIONS } from "./constants";

export const toAttributeTypeLabel = (value: string) => {
  const normalized = value.trim().toLowerCase();
  const matched = VARIATION_GROUP_OPTIONS.find(
    (option) => option.value.toLowerCase() === normalized
  );
  return matched?.value ?? value;
};

export const normalizeStockInput = (value: string) => value.replace(/\D/g, "");

export const normalizeDecimalInput = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...fractionParts] = cleaned.split(".");
  const fraction = fractionParts.join("").slice(0, 2);
  return fractionParts.length > 0 ? `${whole}.${fraction}` : whole;
};
