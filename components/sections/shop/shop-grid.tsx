import ProductCard from "@/components/ui/product-card";
import { shopGridProducts } from "@/data/shop-grid-products";

export default function ShopGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 p-2 place-items-center w-full">
      {shopGridProducts.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
