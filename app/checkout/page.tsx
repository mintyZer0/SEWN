import { supabase } from '@/lib/supabase';
import CheckoutClient from './checkout';
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: productId } = await searchParams;
  
  const { data: product } = await supabase
    .from('sewist_products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .single();
    
  if (!product) return <div>No product found</div>;

  return <CheckoutClient initialProduct={product} />;
}
