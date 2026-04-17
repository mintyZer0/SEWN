"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";
import { createClient } from "@/utils/supabase/client";
import { approveSewer, rejectSewer } from "@/lib/admin-actions";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalOrders: string;
  location: string;
  phone: string;
  status: StatusType;
}

const columns: Column<CustomerData>[] = [
  {
    header: "Customer",
    accessorKey: "name",
    cell: (customer) => (
      <TwoLineCell 
        title={customer.name} 
        subtitle={customer.email}
        showSquare
      />
    ),
  },
  {
    header: "Membership",
    accessorKey: "joinDate",
    cell: (customer) => (
      <TwoLineCell 
        title={customer.joinDate} 
        subtitle={customer.totalOrders} 
      />
    ),
  },
  {
    header: "Contact Details",
    accessorKey: "location",
    cell: (customer) => (
      <TwoLineCell 
        title={customer.location} 
        subtitle={customer.phone} 
      />
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (customer) => (
      <StatusBadge 
        status={customer.status === "Accepted" ? "Accepted" : customer.status === "Declined" ? "Cancelled" : "Pending"} 
      />
    ),
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchSewers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          email,
          created_at,
          sewer_verifications (
            verification_status
          ),
          user_addresses (
            city,
            province
          ),
          user_phones (
            phone
          )
        `)
        .eq('user_type', 'seller');

      if (data) {
        const mapped: CustomerData[] = data.map((u: any) => ({
          id: u.id,
          name: `${u.first_name} ${u.last_name}`,
          email: u.email,
          joinDate: new Date(u.created_at).toLocaleDateString(),
          totalOrders: "Seller Account",
          location: u.user_addresses?.[0] ? `${u.user_addresses[0].city}, ${u.user_addresses[0].province}` : "N/A",
          phone: u.user_phones?.[0]?.phone || "N/A",
          status: u.sewer_verifications?.[0]?.verification_status === 'verified' ? 'Accepted' : 
                  (u.sewer_verifications?.[0]?.verification_status === 'rejected' ? 'Declined' : 'Pending') as StatusType
        }));
        setCustomers(mapped);
      }
    } catch (err) {
      console.error("Error fetching admin sewers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSewers();
  }, []);

  const stats = [
    { label: "Active", count: customers.filter(c => c.status === 'Accepted').length, color: "text-emerald-500" },
    { label: "New", count: customers.filter(c => c.status === 'Pending').length, color: "text-primary" },
    { label: "Banned", count: customers.filter(c => c.status === 'Declined').length, color: "text-rose-500" },
  ];

  const handleDetailsClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    await fetchSewers();
    setIsModalOpen(false);
  };

  const handleDecline = async (id: string) => {
    await fetchSewers();
    setIsModalOpen(false);
  };

  // Map customer data to match modal expectations
  const modalData = selectedCustomer ? {
    ...selectedCustomer,
    productName: selectedCustomer.name,
    customerName: selectedCustomer.name,
    description: `Sewer from ${selectedCustomer.location}. Joined on ${selectedCustomer.joinDate}.`,
    orderDate: selectedCustomer.joinDate,
    price: "Seller Account",
    paymentMethod: "ID Verification",
  } : null;

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Sewer Verifications" 
        total={customers.length} 
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
          data={customers} 
          onDetailsClick={handleDetailsClick}
        />
      )}

      <AdminDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        type="sewer"
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </div>
  );
}
