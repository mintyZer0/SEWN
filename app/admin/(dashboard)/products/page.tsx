"use client";

import React, { useState } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";

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

const mockProducts: ProductData[] = [
  {
    id: "PROD-001",
    name: "Classic Silk Scarf",
    category: "Accessories",
    sellerName: "Althea's Creations",
    dateAdded: "Oct 12, 2024",
    price: "₱850",
    stock: "15 in stock",
    status: "Accepted",
  },
  {
    id: "PROD-002",
    name: "Embroidered Table Runner",
    category: "Home Decor",
    sellerName: "Lola's Traditional",
    dateAdded: "Oct 11, 2024",
    price: "₱1,200",
    stock: "5 in stock",
    status: "Pending",
  },
  {
    id: "PROD-003",
    name: "Denim Jacket Patching",
    category: "Services",
    sellerName: "Modern Stitch",
    dateAdded: "Oct 09, 2024",
    price: "₱500",
    stock: "Service",
    status: "Accepted",
  },
  {
    id: "PROD-004",
    name: "Custom Prom Dress",
    category: "Dressmaking",
    sellerName: "Couture by Cara",
    dateAdded: "Oct 07, 2024",
    price: "₱15,000",
    stock: "Pre-order",
    status: "Pending",
  },
  {
    id: "PROD-005",
    name: "Vintage Lace Blouse",
    category: "Clothing",
    sellerName: "Retro Fits",
    dateAdded: "Oct 05, 2024",
    price: "₱2,100",
    stock: "Out of stock",
    status: "Declined",
  },
];

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
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "Active", count: 124, color: "text-emerald-500" },
    { label: "Pending", count: 18, color: "text-amber-500" },
    { label: "Rejected", count: 5, color: "text-rose-500" },
  ];

  const handleDetailsClick = (product: ProductData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    console.log("Approved product:", id);
  };

  const handleDecline = (id: string) => {
    console.log("Declined product:", id);
  };

  // Map product data to match modal expectations
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
        total={147} 
        stats={stats} 
      />
      
      <AdminFilterBar 
        onSearchChange={(val) => console.log("Search:", val)}
        onStatusChange={(val) => console.log("Status:", val)}
        onDateChange={(val) => console.log("Date:", val)}
      />

      <AdminDataTable 
        columns={columns} 
        data={mockProducts} 
        onDetailsClick={handleDetailsClick}
      />

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
