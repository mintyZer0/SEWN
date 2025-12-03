import FilterTab from "@/components/sections/shop/filter-tab";
import ShopGrid from "@/components/sections/shop/shop-grid";
import SearchBar from "@/components/ui/search-bar";

export default function Shop() {
  return (
    <>
      <h1 className="flex justify-center mx-20 text-9xl text-primary p-4">
        Order
      </h1>
      <div className="flex flex-row my-20">
        <FilterTab />
        <div className="flex flex-1 flex-col m-4 gap-4">
          <SearchBar />
          <ShopGrid />
        </div>
      </div>
    </>
  );
}
