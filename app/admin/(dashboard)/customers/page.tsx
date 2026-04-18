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
  createdAt: string;
  createdDate: string;
  purchaseCount: number;
  purchaseTotal: number;
  purchaseCountLabel: string;
  purchaseTotalLabel: string;
  verificationStatus: string | null;
  idCardUrl: string | null;
  profileDocumentUrl: string | null;
  avatarUrl: string | null;
  hasCustomerRegistrationInfo: boolean;
  hasSewerRegistrationInfo: boolean;
  hasQuestionnaires: boolean;
  sewerOnboardingSurvey: Record<string, string>;
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
            verification_status,
            id_card_url,
            profile_document_url
          ),
          sewer_onboarding_surveys (
            educational_attainment,
            monthly_income,
            reason_for_sewing,
            favorite_aspect,
            gives_pride,
            expresses_self,
            community_goals,
            learn_method,
            teacher_relationship,
            motivations,
            is_only_livelihood,
            owns_machine,
            machine_owner,
            makes_traditional_products,
            common_products_used_for,
            specific_products,
            designs_garments
          ),
          user_avatars (
            avatar_url
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
        const verification = Array.isArray(u.sewer_verifications)
          ? u.sewer_verifications[0]
          : u.sewer_verifications;
        const survey = Array.isArray(u.sewer_onboarding_surveys)
          ? u.sewer_onboarding_surveys[0]
          : u.sewer_onboarding_surveys;
        const avatar = Array.isArray(u.user_avatars) ? u.user_avatars[0] : u.user_avatars;
        const purchaseSummary = purchasesByUser.get(u.id) ?? { count: 0, total: 0 };
        const fullName = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "Unnamed user";
        const userType: "buyer" | "seller" = u.user_type === "seller" ? "seller" : "buyer";
        const verificationStatus = verification?.verification_status ?? null;
        const status: StatusType =
          userType === "seller"
            ? verificationStatus === "verified"
              ? "Accepted"
              : verificationStatus === "rejected"
                ? "Declined"
                : "Pending"
            : "Accepted";

        const avatarPath = avatar?.avatar_url as string | undefined;
        const avatarUrl = avatarPath
          ? supabase.storage.from("product-images").getPublicUrl(avatarPath).data.publicUrl
          : "https://qgniaasqnjzvfjximawh.supabase.co/storage/v1/object/public/product-images/avatars/Default.jpg";
        const customerRegistrationFields = [
          survey?.educational_attainment,
          survey?.monthly_income,
          survey?.reason_for_sewing,
          survey?.favorite_aspect,
          survey?.gives_pride,
          survey?.expresses_self,
          survey?.community_goals,
        ];
        const sewerRegistrationFields = [
          survey?.learn_method,
          survey?.teacher_relationship,
          survey?.motivations,
          survey?.is_only_livelihood,
          survey?.owns_machine,
          survey?.machine_owner,
          survey?.makes_traditional_products,
          survey?.common_products_used_for,
          survey?.specific_products,
          survey?.designs_garments,
        ];
        const hasSurveyField = [...customerRegistrationFields, ...sewerRegistrationFields].some(
          (value) => typeof value === "string" && value.trim().length > 0
        );

        return {
          id: u.id,
          name: fullName,
          userType,
          roleLabel: userType === "seller" ? "Sewer" : "Customer",
          email: u.email,
          createdAt: u.created_at,
          createdDate: `Account created ${new Date(u.created_at).toLocaleDateString()}`,
          purchaseCount: purchaseSummary.count,
          purchaseTotal: purchaseSummary.total,
          purchaseCountLabel: `${purchaseSummary.count} purchase${purchaseSummary.count === 1 ? "" : "s"}`,
          purchaseTotalLabel: `Php ${purchaseSummary.total.toLocaleString()}`,
          verificationStatus,
          idCardUrl: verification?.id_card_url ?? null,
          profileDocumentUrl: verification?.profile_document_url ?? null,
          avatarUrl: avatarUrl ?? null,
          hasCustomerRegistrationInfo: customerRegistrationFields.some(
            (value) => typeof value === "string" && value.trim().length > 0
          ),
          hasSewerRegistrationInfo: sewerRegistrationFields.some(
            (value) => typeof value === "string" && value.trim().length > 0
          ),
          hasQuestionnaires: hasSurveyField,
          sewerOnboardingSurvey: {
            educational_attainment: survey?.educational_attainment ?? "",
            monthly_income: survey?.monthly_income ?? "",
            reason_for_sewing: survey?.reason_for_sewing ?? "",
            favorite_aspect: survey?.favorite_aspect ?? "",
            gives_pride: survey?.gives_pride ?? "",
            expresses_self: survey?.expresses_self ?? "",
            community_goals: survey?.community_goals ?? "",
            learn_method: survey?.learn_method ?? "",
            teacher_relationship: survey?.teacher_relationship ?? "",
            motivations: survey?.motivations ?? "",
            is_only_livelihood: survey?.is_only_livelihood ?? "",
            owns_machine: survey?.owns_machine ?? "",
            machine_owner: survey?.machine_owner ?? "",
            makes_traditional_products: survey?.makes_traditional_products ?? "",
            common_products_used_for: survey?.common_products_used_for ?? "",
            specific_products: survey?.specific_products ?? "",
            designs_garments: survey?.designs_garments ?? "",
          },
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
    submittedAt: selectedCustomer.createdAt,
    price: `Php ${selectedCustomer.purchaseTotal.toLocaleString()}`,
    paymentMethod: "ID Verification",
    profileImageUrl: selectedCustomer.profileDocumentUrl,
    idCardImageUrl: selectedCustomer.idCardUrl,
    avatarUrl: selectedCustomer.avatarUrl,
    hasCustomerRegistrationInfo: selectedCustomer.hasCustomerRegistrationInfo,
    hasSewerRegistrationInfo: selectedCustomer.hasSewerRegistrationInfo,
    hasQuestionnaires: selectedCustomer.hasQuestionnaires,
    sewerOnboardingSurvey: selectedCustomer.sewerOnboardingSurvey,
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
