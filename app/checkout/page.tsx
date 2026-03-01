import { supabase } from '@/lib/supabase';
import CheckoutClient from './Checkout';

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: productId } = await searchParams;  // Destructure directly
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId!)
    .limit(1);
    
  const product = products?.[0];
  
  if (!product) {
    return <div>No product found</div>;
  }
  
  return <CheckoutClient initialProduct={product} />;
}