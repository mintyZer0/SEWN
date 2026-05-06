import { createClient } from "@/utils/supabase/server";
import CheckoutClient from './checkout';
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: productId } = await searchParams;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('sewist_products')
    .select(`
      *,
      users (first_name, last_name),
      product_images (image_url, display_order),
      product_variants (
        id,
        sku,
        stock_quantity,
        price_override,
        variant_attribute_values (
          attribute_type,
          attribute_value
        )
      )
    `)
    .eq('id', productId)
    .eq('is_active', true)
    .single();
    
  if (!product) return <div>No product found</div>;

  return <CheckoutClient initialProduct={product} />;
}
