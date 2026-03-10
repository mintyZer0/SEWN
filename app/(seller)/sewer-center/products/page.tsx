"use client";

import React, { useState } from "react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { 
  CollapsibleProductSection, 
  SectionItem 
} from "@/components/sewer-center/collapsible-product-section";
import { ProductModal } from "@/components/modals/product-modal";
import { CommissionsModal } from "@/components/modals/commissions-modal";

// Mock data with IDs
const INITIAL_PRODUCTS: SectionItem[] = [
  { id: "p1", name: "(Name of Product)" },
  { id: "p2", name: "(Name of Product)" },
  { id: "p3", name: "(Name of Product)" },
  { id: "p4", name: "(Name of Product)" },
];

const INITIAL_ORDERS: SectionItem[] = [
  { id: "o1", name: "(Name of Product)" },
  { id: "o2", name: "(Name of Product)" },
  { id: "o3", name: "(Name of Product)" },
  { id: "o4", name: "(Name of Product)" },
  { id: "o5", name: "(Name of Product)" },
  { id: "o6", name: "(Name of Product)" },
  { id: "o7", name: "(Name of Product)" },
  { id: "o8", name: "(Name of Product)" },
];

const INITIAL_COMMISSIONS: SectionItem[] = [
  { id: "c1", name: "(Name of Product)", type: "Alteration" },
  { id: "c2", name: "(Name of Product)", type: "Sew" },
  { id: "c3", name: "(Name of Product)", type: "Repair" },
];

const INITIAL_APPOINTMENTS: SectionItem[] = [
  { id: "a1", name: "(Name of customer)" },
  { id: "a2", name: "(Name of customer)" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [commissions, setCommissions] = useState(INITIAL_COMMISSIONS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCommissionsModalOpen, setIsCommissionsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SectionItem | null>(null);
  const [openSections, setOpenSections] = useState({
    products: true,
    orders: true,
    commissions: true,
    appointments: true,
  });

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

  const handleSaveProduct = async (productData: Partial<SectionItem>) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? { ...p, ...productData } as SectionItem : p
      ));
    } else {
      // Add new product
      const newProduct: SectionItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: productData.name || "New Product",
      };
      setProducts(prev => [...prev, newProduct]);
    }
  };

  const handleDelete = async (id: string, variant: string) => {
    console.log(`Deleting ${variant} with id: ${id} from Supabase...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    switch(variant) {
      case 'product': setProducts(prev => prev.filter(i => i.id !== id)); break;
      case 'order': setOrders(prev => prev.filter(i => i.id !== id)); break;
      case 'commission': setCommissions(prev => prev.filter(i => i.id !== id)); break;
      case 'appointment': setAppointments(prev => prev.filter(i => i.id !== id)); break;
    }
  };

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
            <ProfileButton variant="orange" size="xl">
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
        />

        {/* Appointments Section */}
        <CollapsibleProductSection
          title="Appointments"
          variant="appointment"
          isOpen={openSections.appointments}
          onToggle={() => toggleSection("appointments")}
          items={appointments}
          onItemDelete={(id) => handleDelete(id, 'appointment')}
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
    </div>
  );
}
