"use client";

import React, { useState } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";

interface OrderData {
  id: string;
  productName: string;
  category: string;
  customerName: string;
  orderDate: string;
  price: string;
  paymentMethod: string;
  status: StatusType;
}

const mockOrders: OrderData[] = [
  {
    id: "ORD-001",
    productName: "Silk Evening Gown",
    category: "Dressmaking",
    customerName: "Maria Santos",
    orderDate: "Oct 12, 2024",
    price: "₱4,500",
    paymentMethod: "GCash",
    status: "Pending",
  },
  {
    id: "ORD-002",
    productName: "Barong Tagalog Modern",
    category: "Tailoring",
    customerName: "Juan Dela Cruz",
    orderDate: "Oct 10, 2024",
    price: "₱3,200",
    paymentMethod: "Bank Transfer",
    status: "Accepted",
  },
  {
    id: "ORD-003",
    productName: "School Uniform Set",
    category: "Alteration",
    customerName: "Elena Reyes",
    orderDate: "Oct 08, 2024",
    price: "₱1,200",
    paymentMethod: "Cash on Delivery",
    status: "Declined",
  },
  {
    id: "ORD-004",
    productName: "Wedding Gown Alteration",
    category: "Alteration",
    customerName: "Ana Villanueva",
    orderDate: "Oct 05, 2024",
    price: "₱8,500",
    paymentMethod: "GCash",
    status: "Completed",
  },
  {
    id: "ORD-005",
    productName: "Custom Suit",
    category: "Tailoring",
    customerName: "Roberto Lim",
    orderDate: "Oct 01, 2024",
    price: "₱12,000",
    paymentMethod: "Bank Transfer",
    status: "Cancelled",
  },
];

const columns: Column<OrderData>[] = [
  {
    header: "Order Details",
    accessorKey: "productName",
    cell: (order) => (
      <TwoLineCell 
        title={order.productName} 
        subtitle={order.category} 
        showSquare
      />
    ),
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: (order) => (
      <TwoLineCell 
        title={order.customerName} 
        subtitle={order.orderDate} 
      />
    ),
  },
  {
    header: "Payment",
    accessorKey: "price",
    cell: (order) => (
      <TwoLineCell 
        title={order.price} 
        subtitle={order.paymentMethod} 
      />
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (order) => <StatusBadge status={order.status} />,
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "New", count: 12, color: "text-amber-500" },
    { label: "Completed", count: 45, color: "text-emerald-500" },
    { label: "Cancelled", count: 3, color: "text-rose-500" },
  ];

  const handleDetailsClick = (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    console.log("Approved order:", id);
    // Add logic to update status in backend/state
  };

  const handleDecline = (id: string) => {
    console.log("Declined order:", id);
    // Add logic to update status in backend/state
  };

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Orders" 
        total={60} 
        stats={stats} 
      />
      
      <AdminFilterBar 
        onSearchChange={(val) => console.log("Search:", val)}
        onStatusChange={(val) => console.log("Status:", val)}
        onDateChange={(val) => console.log("Date:", val)}
      />

      <AdminDataTable 
        columns={columns} 
        data={mockOrders} 
        onDetailsClick={handleDetailsClick}
      />

      <AdminDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedOrder}
        type="order"
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </div>
  );
}
