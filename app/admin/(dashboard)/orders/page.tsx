"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";
import { createClient } from "@/utils/supabase/client";
import { approveOrder, rejectOrder } from "@/lib/admin-actions";

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
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          status,
          created_at,
          users (
            first_name,
            last_name
          ),
          order_items (
            seller_products (
              name,
              type
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: OrderData[] = data.map((o: any) => {
          const firstProduct = o.order_items?.[0]?.seller_products;
          return {
            id: o.id,
            productName: firstProduct?.name || "Multiple Items",
            category: firstProduct?.type || "General",
            customerName: `${o.users?.first_name} ${o.users?.last_name}`,
            orderDate: new Date(o.created_at).toLocaleDateString(),
            price: `₱${o.total.toLocaleString()}`,
            paymentMethod: "Online Payment", // Needs a real column in DB
            status: o.status.charAt(0).toUpperCase() + o.status.slice(1) as StatusType
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = [
    { label: "New", count: orders.filter(o => o.status === 'Pending').length, color: "text-amber-500" },
    { label: "Completed", count: orders.filter(o => o.status === 'Completed').length, color: "text-emerald-500" },
    { label: "Cancelled", count: orders.filter(o => o.status === 'Cancelled').length, color: "text-rose-500" },
  ];

  const handleDetailsClick = (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    await fetchOrders();
    setIsModalOpen(false);
  };

  const handleDecline = async (id: string) => {
    await fetchOrders();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Orders" 
        total={orders.length} 
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
          data={orders} 
          onDetailsClick={handleDetailsClick}
        />
      )}

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
