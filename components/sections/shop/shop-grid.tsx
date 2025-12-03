import ProductCard from "@/components/sections/shop/product-card";
import { products } from "@/data/products";

export default function ShopGrid() {
  return (
    <div className="w-full p-2">
      <div className="flex justify-between ">
        <span className=" text-2xl mx-5">{products.length} Products</span>
        <div className="mb-4 mx-4">
          <select className="px-4 py-2 bg-primary-light rounded-lg border-none text-lg">
            <option>Filter by most sold</option>
            <option>Highest rated</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 p-4  justify-items-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
