import React from "react";
import { ProductVariant } from "./types";
import { normalizeStockInput, normalizeDecimalInput } from "./utils";

interface ProductInventoryMatrixProps {
  variants: ProductVariant[];
  updateVariant: (id: string, updates: Partial<ProductVariant>) => void;
}

export const ProductInventoryMatrix = ({ variants, updateVariant }: ProductInventoryMatrixProps) => {
  if (variants.length === 0) return null;

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-third border-b border-third/10 pb-2">Variant Inventory Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-gray-400 text-sm uppercase font-bold tracking-wider">
              <th className="px-6 py-2">Variant</th>
              <th className="px-6 py-2">SKU</th>
              <th className="px-6 py-2">Stock</th>
              <th className="px-6 py-2">Price Override</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
                <td className="px-6 py-4 font-bold text-primary bg-gray-50/50 rounded-l-2xl">
                  {Object.values(v.attributes).join(" / ")}
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    value={v.sku} 
                    readOnly
                    className="w-full bg-transparent border-b border-gray-200 outline-none text-sm py-1 text-gray-400 cursor-not-allowed"
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={v.stock} 
                    onChange={(e) => updateVariant(v.id, { stock: normalizeStockInput(e.target.value) })}
                    className="w-32 bg-transparent border-b border-gray-200 focus:border-third outline-none text-sm py-1"
                  />
                </td>
                <td className="px-6 py-4 rounded-r-2xl">
                  <input 
                    type="text" 
                    placeholder="Optional"
                    value={v.price} 
                    onChange={(e) => updateVariant(v.id, { price: normalizeDecimalInput(e.target.value) })}
                    inputMode="decimal"
                    className="w-32 bg-transparent border-b border-gray-200 focus:border-third outline-none text-sm py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
