import ProductCard from "@/components/sections/shop/product-card";
import { createClient } from "@/utils/supabase/server";

interface ProductsProps {
  sewistId: string;
}

export default async function Products({ sewistId }: ProductsProps) {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("sewist_products")
    .select("*")
    .eq("user_id", sewistId)
    .eq("is_active", true)
    .limit(3);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <h2 className="text-3xl sm:text-4xl md:text-6xl text-heading-dark font-light mb-6 sm:mb-8 md:mb-12">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-x-20 mb-6 sm:mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button className="text-base sm:text-lg md:text-2xl text-heading-dark hover:underline">
        See more
      </button>
    </div>
  );
}
