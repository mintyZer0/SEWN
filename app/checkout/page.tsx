import { supabase } from '@/lib/supabase';
import CheckoutClient from './Checkout';
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: productId } = await searchParams;
  
  // STEP 1: Get product (unchanged)
  const { data: product } = await supabase
    .from('seller_products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .single();
    
  if (!product) {
    return <div>No product found</div>;
  }
  
  const { data: seller } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('id', product.user_id); 
    
    const fullProduct = {
    ...product,
    users: seller?.[0] || null  
  };

  console.log('PRODUCT USER_ID:', product.user_id);
  console.log('SELLER ARRAY:', seller);  // Will show [] or [{first_name, last_name}]
  console.log('FINAL USERS:', fullProduct.users);
  
  return <CheckoutClient initialProduct={fullProduct} />;
}
