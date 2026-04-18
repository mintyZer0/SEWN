"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminDataTable, TwoLineCell, StatusBadge, type StatusType, type Column } from "@/components/admin/admin-data-table";
import { AdminFilterBar, PageHeader } from "@/components/admin/admin-filter-bar";
import { AdminDetailModal } from "@/components/admin/admin-detail-modal";
import { createClient } from "@/utils/supabase/client";

interface CustomerData {
  id: string;
  name: string;
  userType: "buyer" | "seller";
  roleLabel: string;
  email: string;
  createdDate: string;
  purchaseCount: number;
  purchaseTotal: number;
  purchaseCountLabel: string;
  purchaseTotalLabel: string;
  verificationStatus: string | null;
  location: string;
  status: StatusType;
}

const columns: Column<CustomerData>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: (customer) => (
      <TwoLineCell
        title={customer.name}
        subtitle={customer.roleLabel}
        showSquare
      />
    ),
  },
  {
    header: "User ID",
    accessorKey: "id",
    cell: (customer) => (
      <TwoLineCell
        title={customer.id}
        subtitle={customer.createdDate}
      />
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: (customer) => (
      <span className="text-primary text-base font-medium">
        {customer.email}
      </span>
    ),
  },
  {
    header: "Purchases",
    accessorKey: "purchaseCount",
    cell: (customer) => (
      <TwoLineCell
        title={customer.purchaseCountLabel}
        subtitle={customer.purchaseTotalLabel}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select(`
          id,
          first_name,
          last_name,
          user_type,
          email,
          created_at,
          sewer_verifications (
            verification_status
          ),
          user_addresses (
            city,
            province
          )
        `)
        .in("user_type", ["buyer", "seller"]);

      if (usersError) {
        throw usersError;
      }

      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("user_id, total")
        .neq("status", "cancelled");

      if (ordersError) {
        throw ordersError;
      }

      const purchasesByUser = new Map<string, { count: number; total: number }>();
      for (const order of orders ?? []) {
        const current = purchasesByUser.get(order.user_id) ?? { count: 0, total: 0 };
        purchasesByUser.set(order.user_id, {
          count: current.count + 1,
          total: current.total + Number(order.total ?? 0),
        });
      }

      const mapped: CustomerData[] = (users ?? []).map((u: any) => {
        const purchaseSummary = purchasesByUser.get(u.id) ?? { count: 0, total: 0 };
        const fullName = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "Unnamed user";
        const userType: "buyer" | "seller" = u.user_type === "seller" ? "seller" : "buyer";
        const verificationStatus = u.sewer_verifications?.[0]?.verification_status ?? null;
        const status: StatusType =
          userType === "seller"
            ? verificationStatus === "verified"
              ? "Accepted"
              : verificationStatus === "rejected"
                ? "Declined"
                : "Pending"
            : "Accepted";

        return {
          id: u.id,
          name: fullName,
          userType,
          roleLabel: userType === "seller" ? "Sewer" : "Customer",
          email: u.email,
          createdDate: `Account created ${new Date(u.created_at).toLocaleDateString()}`,
          purchaseCount: purchaseSummary.count,
          purchaseTotal: purchaseSummary.total,
          purchaseCountLabel: `${purchaseSummary.count} purchase${purchaseSummary.count === 1 ? "" : "s"}`,
          purchaseTotalLabel: `Php ${purchaseSummary.total.toLocaleString()}`,
          verificationStatus,
          location: u.user_addresses?.[0] ? `${u.user_addresses[0].city}, ${u.user_addresses[0].province}` : "N/A",
          status,
        };
      });

      setCustomers(mapped);
    } catch (err) {
      console.error("Error fetching admin customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query);

      const normalizedStatus = statusFilter.toLowerCase();
      const matchesStatus =
        normalizedStatus === "all" ||
        customer.status.toLowerCase() === normalizedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const stats = [
    { label: "Customers", count: customers.length },
    { label: "Sewers", count: customers.filter((c) => c.userType === "seller").length },
    { label: "Approved", count: customers.filter((c) => c.status === "Accepted").length },
    { label: "Not approved", count: customers.filter((c) => c.status !== "Accepted").length },
  ];

  const handleDetailsClick = (customer: CustomerData) => {
    if (customer.userType !== "seller") return;
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    await fetchCustomers();
    setIsModalOpen(false);
  };

  const handleDecline = async (id: string) => {
    await fetchCustomers();
    setIsModalOpen(false);
  };

  const modalData = selectedCustomer ? {
    ...selectedCustomer,
    productName: selectedCustomer.name,
    customerName: selectedCustomer.name,
    description: `Sewer from ${selectedCustomer.location}. Joined on ${selectedCustomer.createdDate.replace("Account created ", "")}.`,
    orderDate: selectedCustomer.createdDate.replace("Account created ", ""),
    price: `Php ${selectedCustomer.purchaseTotal.toLocaleString()}`,
    paymentMethod: "ID Verification",
  } : null;

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Customers" 
        total={customers.length} 
        stats={stats} 
      />
      
      <AdminFilterBar 
        onSearchChange={(val) => setSearchQuery(val)}
        onStatusChange={(val) => setStatusFilter(val)}
        onDateChange={(val) => console.log("Date:", val)}
      />

      {loading ? (
        <div className="p-20 text-center text-gray-500 font-bold text-2xl">Loading...</div>
      ) : (
        <AdminDataTable 
          columns={columns} 
          data={filteredCustomers} 
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
