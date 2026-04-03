import ProductCard from "@/components/sections/shop/product-card";
import { createClient } from "@/utils/supabase/server";

export default async function Products() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("seller_products")
    .select("*")
    .eq("is_active", true)
    .limit(3);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center py-16 px-8">
      <h2 className="text-6xl text-heading-dark font-light mb-12">Products</h2>
      <div className="grid grid-cols-3 gap-x-20 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button className="text-2xl text-heading-dark hover:underline">
        See more
      </button>
    </div>
  );
}
