import SewersGrid from "@/components/sections/sewers-old/sewers-grid";
import FilterTab from "@/components/sections/shop/filter-tab";
import ShopGrid from "@/components/sections/shop/shop-grid";
import SearchBar from "@/components/ui/search-bar";

export default function Sewers() {
  return (
    <>
      <h1 className="flex justify-center mx-20 text-9xl text-heading p-4">
        Order
      </h1>
      <div className="flex flex-row my-20">
        <div className="flex flex-1 flex-col m-4 gap-4">
          <SewersGrid />
        </div>
      </div>
    </>
  );
}
