"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, User, Calendar, CreditCard, Phone, Mail, Package, FileText, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  approveOrder, rejectOrder, 
  approveProduct, rejectProduct, 
  approveSewer, rejectSewer 
} from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

export type AdminItemType = 'order' | 'product' | 'sewer';

interface AdminDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: AdminItemType;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export const AdminDetailModal = ({
  isOpen,
  onClose,
  data,
  type,
  onApprove,
  onDecline,
}: AdminDetailModalProps) => {
  const router = useRouter();
  const [isDeclineMode, setIsDeclineMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionCode, setRejectionCode] = useState("INAPPROPRIATE_CONTENT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !data) return null;

  const rejectionReasons = [
    { code: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
    { code: "POOR_IMAGE_QUALITY", label: "Poor Image Quality" },
    { code: "INCORRECT_PRICING", label: "Incorrect Pricing" },
    { code: "MISSING_DETAILS", label: "Missing Details" },
    { code: "OTHER", label: "Other" },
  ];

  const handleApproveClick = async () => {
    setIsSubmitting(true);
    try {
      let result;
      switch (type) {
        case 'order':
          result = await approveOrder(data.id);
          break;
        case 'product':
          result = await approveProduct(data.id);
          break;
        case 'sewer':
          result = await approveSewer(data.id);
          break;
      }

      if (result?.success) {
        onApprove?.(data.id);
        router.refresh();
        onClose();
      } else {
        alert("Failed to approve: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("An error occurred during approval.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineClick = async () => {
    if (!isDeclineMode) {
      setIsDeclineMode(true);
      return;
    }

    if (!rejectionReason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      switch (type) {
        case 'order':
          result = await rejectOrder(data.id, rejectionReason);
          break;
        case 'product':
          result = await rejectProduct(data.id, rejectionCode, rejectionReason);
          break;
        case 'sewer':
          result = await rejectSewer(data.id, rejectionReason);
          break;
      }

      if (result?.success) {
        onDecline?.(data.id);
        router.refresh();
        onClose();
      } else {
        alert("Failed to decline: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Decline error:", error);
      alert("An error occurred during rejection.");
    } finally {
      setIsSubmitting(false);
      setIsDeclineMode(false);
      setRejectionReason("");
    }
  };

  const handleClose = () => {
    setIsDeclineMode(false);
    setRejectionReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12">
          {/* 2x2 Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Quadrant 1: Image Carousel */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-[32px] bg-gray-100 overflow-hidden group">
                <img
                  src={data.imageUrl || "https://placehold.co/600x600?text=Product+Image"}
                  alt={data.productName || "Product"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-full bg-white/80 text-primary hover:bg-white shadow-lg transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 text-primary hover:bg-white shadow-lg transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === 1 ? "bg-white w-6" : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-gray-100 overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all cursor-pointer">
                    <img src={`https://placehold.co/150x150?text=View+${i}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant 2: Subject Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  {data.category || "General"}
                </span>
                <h2 className="text-4xl font-extrabold text-primary leading-tight">
                  {data.productName || "Silk Evening Gown"}
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {data.description || "High-quality custom-made evening gown with intricate silk detailing. Perfect for formal events and gala nights."}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-secondary/30 border border-secondary text-primary-dark font-semibold">
                    Size: Custom
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-secondary/30 border border-secondary text-primary-dark font-semibold">
                    Color: Royal Blue
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-secondary/30 border border-secondary text-primary-dark font-semibold">
                    Fabric: Silk
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/10 space-y-3">
                <div className="flex items-center gap-3 text-primary/70">
                  <Package size={18} />
                  <span className="font-bold">Variant Details</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  SKU: SEWN-DRS-001-BLU | Stock: 5 available
                </p>
              </div>
            </div>

            {/* Quadrant 3: User Profile */}
            <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orchid flex items-center justify-center text-white shadow-lg">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">
                    {data.customerName || "Maria Santos"}
                  </h3>
                  <p className="text-primary/60 font-medium flex items-center gap-1.5">
                    <Calendar size={14} />
                    Joined Jan 2024
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-primary/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Total Orders</span>
                  <span className="text-primary font-bold">12 Orders</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Account Status</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Location</span>
                  <span className="text-gray-700 font-bold">Quezon City, PH</span>
                </div>
              </div>
            </div>

            {/* Quadrant 4: Financials/Contact */}
            <div className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <p className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Total Amount</p>
                <p className="text-5xl font-black text-primary">
                  {data.price || "₱4,500"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Payment Method</p>
                    <p className="font-bold text-gray-800">{data.paymentMethod || "GCash"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <Phone size={16} className="text-primary/60" />
                    <span className="text-sm font-bold text-gray-700">0912...789</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <Mail size={16} className="text-primary/60" />
                    <span className="text-sm font-bold text-gray-700">m.santos@...</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Rejection Reason Input */}
          {isDeclineMode && (
            <div className="mt-12 p-8 rounded-[32px] bg-rose-50 border-2 border-rose-100 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3 mb-4 text-rose-600">
                <AlertCircle size={24} />
                <h4 className="text-xl font-bold">Reason for Declining</h4>
              </div>
              
              {type === 'product' && (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-rose-700 mb-2 uppercase">Reason Category</label>
                  <select 
                    value={rejectionCode}
                    onChange={(e) => setRejectionCode(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none bg-white text-gray-700 font-medium mb-4"
                  >
                    {rejectionReasons.map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <label className="block text-sm font-bold text-rose-700 mb-2 uppercase">
                {type === 'product' ? 'Additional Comments' : 'Rejection Message'}
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please enter the reason for rejecting this request..."
                className="w-full h-32 p-4 rounded-2xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none transition-colors text-gray-700 font-medium"
              />
              <button
                onClick={() => setIsDeclineMode(false)}
                className="mt-4 text-rose-500 font-bold hover:underline"
              >
                Cancel and go back
              </button>
            </div>
          )}

          {/* Metadata Row */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2.5">
                <Package size={20} className="text-primary/40" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Product ID</p>
                  <p className="text-sm font-bold text-gray-700">PROD-99218</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-primary/40" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Order ID</p>
                  <p className="text-sm font-bold text-gray-700">{data.id || "ORD-001"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={20} className="text-primary/40" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Transaction Date</p>
                  <p className="text-sm font-bold text-gray-700">{data.orderDate || "Oct 12, 2024"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 sm:p-10 bg-gray-50/80 border-t border-gray-100 flex gap-4 sm:gap-6">
          <button
            disabled={isSubmitting}
            onClick={handleDeclineClick}
            className={cn(
              "flex-1 py-5 rounded-full bg-white border-2 border-rose-500 text-rose-500 text-xl font-black transition-all duration-200 active:scale-[0.98] shadow-sm uppercase tracking-wider disabled:opacity-50",
              isDeclineMode ? "bg-rose-500 text-white" : "hover:bg-rose-500 hover:text-white"
            )}
          >
            {isSubmitting ? "Processing..." : isDeclineMode ? "Confirm Decline" : "Decline"}
          </button>
          {!isDeclineMode && (
            <button
              disabled={isSubmitting}
              onClick={handleApproveClick}
              className="flex-2 py-5 rounded-full bg-emerald-500 text-white text-xl font-black hover:bg-emerald-600 transition-all duration-200 active:scale-[0.98] shadow-xl shadow-emerald-200 uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Approve Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
