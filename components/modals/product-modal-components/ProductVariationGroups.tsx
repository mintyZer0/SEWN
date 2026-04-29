import React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { CustomField } from "@/components/ui/custom-field";
import { MARKETPLACE_FILTERS } from "@/lib/constants";
import { VARIATION_GROUP_OPTIONS } from "./constants";
import { VariationGroup } from "./types";

interface ProductVariationGroupsProps {
  variationGroups: VariationGroup[];
  addVariationGroup: () => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, updates: Partial<VariationGroup>) => void;
}

export const ProductVariationGroups = ({
  variationGroups,
  addVariationGroup,
  removeGroup,
  updateGroup,
}: ProductVariationGroupsProps) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-third/10 pb-2">
        <h3 className="text-2xl font-bold text-third">Variation Groups</h3>
        <button 
          type="button" 
          onClick={addVariationGroup}
          className="text-primary font-bold hover:underline flex items-center gap-1"
        >
          <Plus size={16} /> Add Group
        </button>
      </div>

      <div className="space-y-6">
        {variationGroups.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 flex flex-col items-center text-center">
            <p className="text-gray-400 font-medium mb-1">No variations yet</p>
            <p className="text-sm text-gray-400/70">Add groups like "Size" or "Color" to create product variations.</p>
          </div>
        ) : (
          variationGroups.map((group) => (
            <div key={group.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
              <button 
                type="button" 
                onClick={() => removeGroup(group.id)}
                className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
                <div className="flex flex-col gap-1">
                  <CustomField
                    label="Variant Category"
                    isSelect
                    value={group.name}
                    onValueChange={(val) => updateGroup(group.id, { name: val, options: [""] })}
                    options={VARIATION_GROUP_OPTIONS.map((option) => ({
                      ...option,
                      disabled: variationGroups.some(
                        (g) => g.id !== group.id && g.name === option.value
                      ),
                    }))}
                    containerClassName="mt-0"
                  />
                  {variationGroups.some((g) => g.id !== group.id && g.name === group.name) && (
                    <span className="text-[10px] text-rose-500 font-bold uppercase ml-4">Already selected</span>
                  )}
                </div>
                <div className="md:col-span-2 relative">
                  <label className="absolute -top-3 left-6 bg-white px-2 text-third font-bold text-sm z-10 whitespace-nowrap uppercase tracking-tight">
                    Options
                  </label>
                  
                  {["Color", "Material", "Size"].includes(group.name) ? (
                    <div className="space-y-3">
                      <CustomField
                        label=""
                        placeholder={`Select ${group.name}`}
                        isSelect
                        value=""
                        onValueChange={(val) => {
                          if (!group.options.includes(val)) {
                            updateGroup(group.id, { options: [...group.options.filter((o) => o !== ""), val] });
                          }
                        }}
                        options={MARKETPLACE_FILTERS[group.name as keyof typeof MARKETPLACE_FILTERS].map((opt) => ({ value: opt, label: opt }))}
                        containerClassName="mt-0"
                      />
                      <div className="flex flex-wrap gap-2 px-2">
                        {group.options.filter((o) => o !== "").map((opt) => (
                          <span 
                            key={opt} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-third/10 text-third rounded-full text-sm font-bold border border-third/20 animate-in fade-in zoom-in-95 duration-200"
                          >
                            {opt}
                            <button 
                              type="button"
                              onClick={() => updateGroup(group.id, { options: group.options.filter((o) => o !== opt) })}
                              className="hover:bg-third/20 rounded-full p-0.5 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                        {group.options.filter((o) => o !== "").length === 0 && (
                          <span className="text-gray-400 text-sm italic py-1">No {group.name.toLowerCase()}s selected</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Red, Blue, Green"
                      value={group.options.join(", ")}
                      onChange={(e) => updateGroup(group.id, { options: e.target.value.split(",").map((o) => o.trim()) })}
                      className="w-full px-6 py-3 rounded-full border-2 border-third/50 focus:border-third outline-none transition-all bg-white h-14 text-gray-700"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
