"use client";

import React, { useState } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";

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

const mockCustomers: CustomerData[] = [
  {
    id: "CUST-001",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    joinDate: "Jan 15, 2024",
    totalOrders: "12 Orders",
    location: "Quezon City, Metro Manila",
    phone: "+63 912 345 6789",
    status: "Accepted",
  },
  {
    id: "CUST-002",
    name: "Juan Dela Cruz",
    email: "juan.dc@email.com",
    joinDate: "Feb 20, 2024",
    totalOrders: "5 Orders",
    location: "Makati City, Metro Manila",
    phone: "+63 923 456 7890",
    status: "Accepted",
  },
  {
    id: "CUST-003",
    name: "Elena Reyes",
    email: "elena.reyes@email.com",
    joinDate: "Mar 10, 2024",
    totalOrders: "2 Orders",
    location: "Cebu City, Cebu",
    phone: "+63 934 567 8901",
    status: "Pending",
  },
  {
    id: "CUST-004",
    name: "Roberto Lim",
    email: "roberto.lim@email.com",
    joinDate: "Apr 05, 2024",
    totalOrders: "0 Orders",
    location: "Davao City, Davao del Sur",
    phone: "+63 945 678 9012",
    status: "Declined",
  },
  {
    id: "CUST-005",
    name: "Ana Villanueva",
    email: "ana.v@email.com",
    joinDate: "May 12, 2024",
    totalOrders: "8 Orders",
    location: "Baguio City, Benguet",
    phone: "+63 956 789 0123",
    status: "Accepted",
  },
];

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
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "Active", count: 1250, color: "text-emerald-500" },
    { label: "New", count: 45, color: "text-primary" },
    { label: "Banned", count: 8, color: "text-rose-500" },
  ];

  const handleDetailsClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    console.log("Approved customer:", id);
  };

  const handleDecline = (id: string) => {
    console.log("Banned customer:", id);
  };

  // Map customer data to match modal expectations
  const modalData = selectedCustomer ? {
    ...selectedCustomer,
    productName: selectedCustomer.name,
    customerName: selectedCustomer.name,
    description: `Customer from ${selectedCustomer.location}. Joined on ${selectedCustomer.joinDate}.`,
    orderDate: selectedCustomer.joinDate,
    price: selectedCustomer.totalOrders, // Using total orders as a "financial" metric here
    paymentMethod: "Account Verified",
  } : null;

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Customers" 
        total={1303} 
        stats={stats} 
      />
      
      <AdminFilterBar 
        onSearchChange={(val) => console.log("Search:", val)}
        onStatusChange={(val) => console.log("Status:", val)}
        onDateChange={(val) => console.log("Date:", val)}
      />

      <AdminDataTable 
        columns={columns} 
        data={mockCustomers} 
        onDetailsClick={handleDetailsClick}
      />

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
