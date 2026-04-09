"use client";

import React, { useState, useEffect } from "react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { 
  CollapsibleProductSection, 
  SectionItem 
} from "@/components/sewer-center/collapsible-product-section";
import { ProductModal } from "@/components/modals/product-modal";
import { CommissionsModal } from "@/components/modals/commissions-modal";
import { ViewPendingsModal } from "@/components/modals/view-pendings-modal";
import { ServiceRequestDetailsModal, ServiceRequest } from "@/components/modals/service-request-details-modal";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

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
  const [editingProduct, setEditingProduct] = useState<SectionItem | null>(null);
  
  const [openSections, setOpenSections] = useState({
    products: true,
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
        .from('seller_products')
        .select('id, name')
        .eq('user_id', user.id)
        .is('deleted_at', null); // Only fetch active products
      
      if (productsData) {
        setProducts(productsData.map(p => ({ id: p.id, name: p.name })));
      }

      // 2. Fetch Orders (simplified for now)
      const { data: ordersData } = await supabase
        .from('order_items')
        .select(`
          id,
          seller_products!inner (
            name,
            user_id,
            deleted_at
          )
        `)
        .eq('seller_products.user_id', user.id)
        .is('seller_products.deleted_at', null);
      
      if (ordersData) {
        setOrders(ordersData.map((o: any) => ({ 
          id: o.id, 
          name: o.seller_products?.name || "Product Order" 
        })));
      }

      // 3. Fetch Service Requests (Commissions & Appointments)
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select('*')
        .eq('sewer_id', user.id)
        .is('deleted_at', null) // Only fetch non-archived requests
        .order('created_at', { ascending: false });

      if (requestsData) {
        setAllServiceRequests(requestsData as ServiceRequest[]);
        
        // Filter into Commissions (Commissions, Repairs, Alterations)
        const commissionsList = requestsData
          .filter(r => ['commission', 'repair', 'alteration'].includes(r.service_type))
          .map(r => ({
            id: r.id,
            name: `${r.contact_name} - ${r.subject || r.service_type}`,
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

  const handleSaveProduct = async (productData: Partial<SectionItem>) => {
    // Implementation for saving product to Supabase would go here
    // For now, let's just refetch
    fetchData();
    setIsProductModalOpen(false);
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
          .from('seller_products')
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

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-third" />
      </div>
    );
  }

  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        {/* Tools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Tools</h2>
          <div className="flex gap-6 justify-around">
            <ProfileButton 
              variant="orange" 
              size="xl"
              onClick={handleAddProduct}
            >
              Add Product
            </ProfileButton>
            <ProfileButton 
              variant="orange" 
              size="xl"
              onClick={() => setIsCommissionsModalOpen(true)}
            >
              Commissions
            </ProfileButton>
            <ProfileButton 
              variant="orange" 
              size="xl"
              onClick={() => setIsViewPendingsModalOpen(true)}
            >
              View Pendings
            </ProfileButton>
          </div>
        </div>

        <p className="text-xl text-gray-500 italic mb-8">
          Click to accept order, commission, or appointment
        </p>

        {/* Active Products Section */}
        <CollapsibleProductSection
          title="Active Products"
          variant="product"
          isOpen={openSections.products}
          onToggle={() => toggleSection("products")}
          items={products}
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
      />

      <ServiceRequestDetailsModal
        isOpen={isRequestModalOpen}
        request={selectedRequest}
        onClose={() => setIsRequestModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

