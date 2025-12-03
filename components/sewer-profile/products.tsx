import ProductCard from "@/components/sections/shop/product-card";
import { products as allProducts } from "@/data/products";

export default function Products() {
  const products = allProducts.slice(0, 3);

  return (
    <div className="flex flex-col items-center py-16 px-8">
      <h2 className="text-6xl text-primary-dark font-light mb-12">Products</h2>
      <div className="grid grid-cols-3 gap-x-20 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button className="text-2xl text-primary-dark hover:underline">
        See more
      </button>
    </div>
  );
}
