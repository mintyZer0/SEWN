export interface FilterState {
  categories: string[];
  colors: string[];
  materials: string[];
  sizes: string[];
  locations: string[];
  types: string[];
  priceRange: { min: number; max: number };
}

export interface Section {
  label: string;
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
}
