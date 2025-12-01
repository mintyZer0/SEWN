import FilterTab from "@/components/sections/shop/filter-tab";
import ShopGrid from "@/components/sections/shop/shop-grid";

export default function Shop() {
  return (
    <>
      <div className="flex flex-row my-20">
        <FilterTab />
        <ShopGrid />
      </div>
    </>
  );
}
