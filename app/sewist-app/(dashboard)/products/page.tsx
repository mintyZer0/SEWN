"use client";

import React, { useState, useEffect } from "react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { 
  CollapsibleProductSection, 
  SectionItem 
} from "@/components/sewist-center/collapsible-product-section";
import { ProductModal } from "@/components/modals/product-modal";
import { CommissionsModal } from "@/components/modals/commissions-modal";
import { ViewPendingsModal } from "@/components/modals/view-pendings-modal";
import { ServiceRequestDetailsModal, ServiceRequest } from "@/components/modals/service-request-details-modal";
import { SuccessModal } from "@/components/modals/success-modal";
import { createClient } from '@/utils/supabase/client';
import { getS3PublicUrl } from '@/lib/s3-client';
import { Loader2 } from "lucide-react";

{/*There is nothing wrong with this code despite the syntax errors, I've tried to fix
  it but it just results in the page breaking despite removeing the syntax errors,
  I do not know how to remove it, and I plan on not trying to fix it, because it is WORKING*/}

export default function ProductsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState<SectionItem[]>([]);
  const [orders, setOrders] = useState<SectionItem[]>([]);
  const [commissions, setCommissions] = useState<SectionItem[]>([]);
  const [appointments, setAppointments] = useState<SectionItem[]>([]);
  
  // For details modal
  const [allServiceRequests, setAllServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCommissionsModalOpen, setIsCommissionsModalOpen] = useState(false);
  const [isViewPendingsModalOpen, setIsViewPendingsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SectionItem | null>(null);
  
  const [openSections, setOpenSections] = useState({
    activeProducts: true,
    declinedProducts: true,
    orders: true,
    commissions: true,
    appointments: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Products
      const { data: productsData } = await supabase
        .from('sewist_products')
        .select('id, name, verification_status, latest_rejection_log_id')
        .eq('user_id', user.id)
        .is('deleted_at', null); // Only fetch active products
      
      if (productsData) {
        setProducts(productsData.map(p => ({ 
          id: p.id, 
          name: p.name, 
          type: p.verification_status,
          rejectionLogId: p.latest_rejection_log_id
        })));
      }

      // 2. Fetch Orders (simplified for now)
      const { data: ordersData } = await supabase
        .from('order_items')
        .select(`
          id,
          sewist_products!inner (
            name,
            user_id,
            deleted_at
          )
        `)
        .eq('sewist_products.user_id', user.id)
        .is('sewist_products.deleted_at', null);
      
      if (ordersData) {
        setOrders(ordersData.map((o: any) => ({ 
          id: o.id, 
          name: o.sewist_products?.name || "Product Order" 
        })));
      }

      // 3. Fetch Service Requests (Commissions & Appointments)
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select(`
          id,
          client_id,
          address_id,
          service_type,
          subject,
          request_details,
          appointment_date,
          status,
          created_at,
          measurement_profile_id,
          users!service_requests_client_id_fkey (
            first_name,
            last_name,
            email
          ),
          user_addresses!service_requests_address_id_fkey (
            full_address,
            barangay,
            city,
            province,
            zip_code,
            contact_name,
            contact_phone
          )
        `)
        .eq('sewist_id', user.id)
        .is('deleted_at', null) // Only fetch non-archived requests
        .order('created_at', { ascending: false });

      if (requestsData) {
        const normalizedRequests = requestsData.map((request: any) => {
          const client = Array.isArray(request.users) ? request.users[0] : request.users;
          const address = Array.isArray(request.user_addresses) ? request.user_addresses[0] : request.user_addresses;
          return {
            ...request,
            users: client || null,
            user_addresses: address || null,
          };
        });
        setAllServiceRequests(normalizedRequests as ServiceRequest[]);
        
        // Filter into Commissions (Commissions, Repairs, Alterations)
        const commissionsList = normalizedRequests
          .filter(r => ['commission', 'repair', 'alteration'].includes(r.service_type))
          .map(r => ({
            id: r.id,
            name: `${`${r.users?.first_name || ""} ${r.users?.last_name || ""}`.trim() || "Customer"} - ${r.subject || r.service_type}`,
            type: r.status
          }));
        setCommissions(commissionsList);

        // Clear Appointments for now as requested
        setAppointments([]);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('sewist-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sewist_products',
        },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
        },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEditProduct = (item: SectionItem) => {
    setEditingProduct(item);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleItemClick = (item: SectionItem, variant: string) => {
    if (variant === 'commission' || variant === 'appointment') {
      const request = allServiceRequests.find(r => r.id === item.id);
      if (request) {
        setSelectedRequest(request);
        setIsRequestModalOpen(true);
      }
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    // Optimistic update or just refetch
    fetchData();
  };

  const handleSaveProduct = async (productData: any, targetStatus: string = 'pending') => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Insert/Update Product "Shell"
      // Note: Assumes img_src is nullable in DB to prevent constraint error on first insert
      const productPayload: any = {
        user_id: user.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        location: productData.location,
        type: productData.type,
        verification_status: targetStatus,
        is_active: true,
        // Note: Add these if columns exist in DB, otherwise they are ignored by upsert
        // care_instructions: productData.careInstructions,
        // fabric: productData.fabric,
        // shipping_time: productData.shippingTime,
        // weight: productData.weight,
      };

      if (productData.id) {
        productPayload.id = productData.id;
      }

      const { data: product, error: productError } = await supabase
        .from('sewist_products')
        .upsert(productPayload)
        .select()
        .single();

      if (productError) throw productError;

      // 2. Handle Image Reconciliation & Uploads
      if (productData.photos && productData.photos.length > 0) {
        const finalImageUrls: string[] = [];
        
        // Delete all old image mappings to start fresh (sync approach)
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', product.id);

        for (let i = 0; i < productData.photos.length; i++) {
          const slot = productData.photos[i];
          if (!slot.file && !slot.url) continue; // Empty slot

          let imageUrl = slot.url;

          if (slot.file) {
            // New file upload
            const file = slot.file;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${i}.${fileExt}`;
            const filePath = `products/${product.id}/${fileName}`;

            // Get presigned URL
            const res = await fetch('/api/media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: filePath, contentType: file.type }),
            });

            if (!res.ok) throw new Error('Failed to get upload URL');
            const { url, publicUrl } = await res.json();

            // Upload to S3
            const uploadRes = await fetch(url, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file.type },
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image to S3');
            imageUrl = publicUrl;
          }

          if (imageUrl) {
            finalImageUrls.push(imageUrl);

            // Save to product_images table
            await supabase.from('product_images').insert({
              product_id: product.id,
              image_url: imageUrl,
              is_main: finalImageUrls.length === 1, // First valid image is main
              display_order: i,
            });
          }
        }

        // Update product's main thumbnail
        if (finalImageUrls.length > 0) {
          await supabase
            .from('sewist_products')
            .update({ img_src: finalImageUrls[0] })
            .eq('id', product.id);
        }
      }

      // 3. Save selected product category.
      const rawCategory = String(productData.category ?? "").trim();
      const capitalizedCategory = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();

      const { error: categoryError } = await supabase
        .from("product_categories")
        .upsert({
          product_id: product.id,
          category: capitalizedCategory,
        });

      if (categoryError) throw categoryError;

      // 3. Handle Variations Matrix
      if (productData.variants && productData.variants.length > 0) {
        for (const variantData of productData.variants) {
          // A. Create/Update Variant Row (The physical item)
          const variantPayload: any = {
            product_id: product.id,
            sku: variantData.sku,
            stock_quantity: variantData.stock !== undefined && variantData.stock !== null && !isNaN(variantData.stock) ? Number(variantData.stock) : 0,
            price_override: variantData.price !== undefined && variantData.price !== null && !isNaN(variantData.price) ? Number(variantData.price) : null,
          };

          if (variantData.id && !variantData.id.startsWith('var-')) {
            variantPayload.id = variantData.id;
          }

          const { data: variant, error: variantError } = await supabase
            .from('product_variants')
            .upsert(variantPayload)
            .select()
            .single();

          if (variantError) {
            console.error("Variant error:", variantError);
            continue;
          }

          // B. Map Attributes for this variant (e.g., this SKU is both 'Red' and 'Small')
          const attributeEntries = Object.entries(variantData.attributes).map(([type, value]) => ({
            variant_id: variant.id,
            attribute_type: String(type).trim().toLowerCase(), // DB expects lowercase
            attribute_value: value as string,
          }));

          const { error: attrError } = await supabase
            .from('variant_attribute_values')
            .upsert(attributeEntries);

          if (attrError) {
            console.error("Attribute mapping error:", attrError);
            throw attrError;
          }
        }
      }
      await fetchData();
      setIsProductModalOpen(false);

      // Trigger success modal only if submitted for review (not draft)
      if (targetStatus === 'pending') {
        setIsSuccessModalOpen(true);
      }
    } catch (error: any) {
      console.error("Failed to save product:", error);
      alert("Failed to save product: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, variant: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();

      if (variant === 'commission' || variant === 'appointment') {
        // Soft delete Service Request
        const { error } = await supabase
          .from('service_requests')
          .update({ deleted_at: now })
          .eq('id', id);
        
        if (error) throw error;
      } else if (variant === 'product') {
        // Soft delete Product
        const { error } = await supabase
          .from('sewist_products')
          .update({ deleted_at: now })
          .eq('id', id);
        
        if (error) throw error;
      }

      await fetchData();
    } catch (error) {
      console.error(`Failed to delete ${variant}:`, error);
      alert(`Failed to delete ${variant}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const activeProducts = products.filter((product) =>
    ["approved", "accepted"].includes(String(product.type || "").toLowerCase())
  );
  const pendingProducts = products.filter((product) =>
    ["pending", "draft"].includes(String(product.type || "").toLowerCase())
  );
  const declinedProducts = products.filter((product) =>
    ["rejected", "declined"].includes(String(product.type || "").toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-third" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 pb-32 md:pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Tools Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-primary mb-4 md:mb-6 text-center md:text-left">Tools</h2>
          <div className="flex flex-row md:flex-row gap-2 md:gap-6 justify-between md:justify-around">
            <ProfileButton 
              variant="orange" 
              size="xl"
              onClick={handleAddProduct}
              className="flex-1 md:flex-none text-[10px] md:text-2xl px-2 py-2 md:px-12 md:py-3.5 rounded-xl md:rounded-[22px] whitespace-nowrap min-w-0 md:min-w-max font-bold md:font-black"
            >
              Add Product
            </ProfileButton>
            <ProfileButton 
              variant="orange" 
              size="xl"
              onClick={() => setIsCommissionsModalOpen(true)}
              className="flex-1 md:flex-none text-[10px] md:text-2xl px-2 py-2 md:px-12 md:py-3.5 rounded-xl md:rounded-[22px] whitespace-nowrap min-w-0 md:min-w-max font-bold md:font-black"
            >
              Commissions
            </ProfileButton>
            <ProfileButton 
              variant="orange" 
              size="xl"
              onClick={() => setIsViewPendingsModalOpen(true)}
              className="flex-1 md:flex-none text-[10px] md:text-2xl px-2 py-2 md:px-12 md:py-3.5 rounded-xl md:rounded-[22px] whitespace-nowrap min-w-0 md:min-w-max font-bold md:font-black"
            >
              View Pendings
            </ProfileButton>
          </div>
        </div>

        <p className="text-lg md:text-xl text-gray-500 italic mb-6 md:mb-8 text-center md:text-left">
          Click to accept order, commission, or appointment
        </p>

        {/* Active Products Section */}
        <CollapsibleProductSection
          title="Active Products"
          variant="product"
          isOpen={openSections.activeProducts}
          onToggle={() => toggleSection("activeProducts")}
          items={activeProducts}
          onItemDelete={(id) => handleDelete(id, 'product')}
          onItemEdit={handleEditProduct}
        />

        {/* Declined Products Section */}
        <CollapsibleProductSection
          title="Declined Products"
          variant="product"
          isOpen={openSections.declinedProducts}
          onToggle={() => toggleSection("declinedProducts")}
          items={declinedProducts}
          onItemDelete={(id) => handleDelete(id, 'product')}
          onItemEdit={handleEditProduct}
        />

        {/* Active Orders Section */}
        <CollapsibleProductSection
          title="Active Orders"
          variant="order"
          isOpen={openSections.orders}
          onToggle={() => toggleSection("orders")}
          items={orders}
          onItemDelete={(id) => handleDelete(id, 'order')}
        />

        {/* Commissions Section */}
        <CollapsibleProductSection
          title="Commissions"
          variant="commission"
          isOpen={openSections.commissions}
          onToggle={() => toggleSection("commissions")}
          items={commissions}
          onItemDelete={(id) => handleDelete(id, 'commission')}
          onItemClick={(item) => handleItemClick(item, 'commission')}
        />

        {/* Appointments Section */}
        <CollapsibleProductSection
          title="Appointments"
          variant="appointment"
          isOpen={openSections.appointments}
          onToggle={() => toggleSection("appointments")}
          items={appointments}
          onItemDelete={(id) => handleDelete(id, 'appointment')}
          onItemClick={(item) => handleItemClick(item, 'appointment')}
        />
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        product={editingProduct}
        onSave={handleSaveProduct}
        onClose={() => setIsProductModalOpen(false)} 
      />

      <CommissionsModal
        isOpen={isCommissionsModalOpen}
        onClose={() => setIsCommissionsModalOpen(false)}
      />

      <ViewPendingsModal
        isOpen={isViewPendingsModalOpen}
        onClose={() => setIsViewPendingsModalOpen(false)}
        items={pendingProducts.map((item) => ({ id: item.id, name: item.name }))}
        loading={loading}
        onDelete={(id) => handleDelete(id, "product")}
      />

      <ServiceRequestDetailsModal
        isOpen={isRequestModalOpen}
        request={selectedRequest}
        onClose={() => setIsRequestModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        variant="product"
      />
    </div>
  );
}
