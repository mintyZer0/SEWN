"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";
import { createClient } from "@/utils/supabase/client";
import { approveProduct, rejectProduct } from "@/lib/admin-actions";

interface ProductData {
  id: string;
  name: string;
  category: string;
  sellerName: string;
  dateAdded: string;
  price: string;
  stock: string;
  status: StatusType;
}

const columns: Column<ProductData>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: (product) => (
      <TwoLineCell 
        title={product.name} 
        subtitle={product.category}
        showSquare 
      />
    ),
  },
  {
    header: "Seller",
    accessorKey: "sellerName",
    cell: (product) => (
      <TwoLineCell 
        title={product.sellerName} 
        subtitle={product.dateAdded} 
      />
    ),
  },
  {
    header: "Pricing & Inventory",
    accessorKey: "price",
    cell: (product) => (
      <TwoLineCell 
        title={product.price} 
        subtitle={product.stock} 
      />
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (product) => <StatusBadge status={product.status} />,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchProducts = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const { data, error } = await supabase
        .from('seller_products')
        .select(`
          id,
          name,
          price,
          description,
          location,
          type,
          img_src,
          created_at,
          verification_status,
          seller_name,
          user_id,
          users (
            first_name,
            last_name,
            created_at
          ),
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
        .neq('verification_status', 'draft')
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: any[] = data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.type,
          sellerName: p.seller_name || `${(p.users as any)?.first_name || ""} ${(p.users as any)?.last_name || ""}`.trim() || "Unknown Seller",
          dateAdded: new Date(p.created_at).toLocaleDateString(),
          price: `₱${p.price.toLocaleString()}`,
          stock: p.product_variants?.reduce((acc: number, v: any) => acc + v.stock_quantity, 0) + " items",
          status: p.verification_status === 'approved' ? 'Accepted' : (p.verification_status === 'rejected' ? 'Declined' : 'Pending') as StatusType,
          // Full fields for modal
          description: p.description,
          location: p.location,
          imageUrl: p.img_src,
          sellerJoined: (p.users as any)?.created_at ? new Date((p.users as any).created_at).toLocaleDateString() : "Jan 2024",
          variants: p.product_variants || [],
        }));        setProducts(mapped);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up Realtime subscription
    const channel = supabase
      .channel('admin-products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'seller_products' },
        () => fetchProducts(true)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_variants' },
        () => fetchProducts(true)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'variant_attribute_values' },
        () => fetchProducts(true)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const stats = [
    { label: "Active", count: products.filter(p => p.status === 'Accepted').length, color: "text-emerald-500" },
    { label: "Pending", count: products.filter(p => p.status === 'Pending').length, color: "text-amber-500" },
    { label: "Rejected", count: products.filter(p => p.status === 'Declined').length, color: "text-rose-500" },
  ];

  const handleDetailsClick = (product: ProductData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    await fetchProducts();
    setIsModalOpen(false);
  };

  const handleDecline = async (id: string) => {
    await fetchProducts();
    setIsModalOpen(false);
  };

  const modalData = selectedProduct ? {
    ...selectedProduct,
    productName: selectedProduct.name,
    customerName: selectedProduct.sellerName,
    orderDate: selectedProduct.dateAdded,
  } : null;

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Products" 
        total={products.length} 
        stats={stats} 
      />
      
      <AdminFilterBar 
        onSearchChange={(val) => console.log("Search:", val)}
        onStatusChange={(val) => console.log("Status:", val)}
        onDateChange={(val) => console.log("Date:", val)}
      />

      {loading ? (
        <div className="p-20 text-center text-gray-500 font-bold text-2xl">Loading...</div>
      ) : (
        <AdminDataTable 
          columns={columns} 
          data={products} 
          onDetailsClick={handleDetailsClick}
        />
      )}

      <AdminDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        type="product"
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </div>
  );
}
