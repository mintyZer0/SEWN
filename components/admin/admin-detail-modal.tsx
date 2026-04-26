"use client";

import React, { useState } from "react";
import { ChevronLeft, User, Calendar, Package, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  approveOrder, rejectOrder, 
  approveProduct, rejectProduct, 
  approveSewist, rejectSewist 
} from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

export type AdminItemType = 'order' | 'product' | 'sewist';

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
  const [mainPreviewImage, setMainPreviewImage] = useState<string | null>(null);

  // Sync main preview when data changes
  React.useEffect(() => {
    if (data?.imageUrl) {
      setMainPreviewImage(data.imageUrl);
    } else if (data?.productImages?.[0]) {
      setMainPreviewImage(data.productImages[0]);
    }
  }, [data]);

  if (!isOpen || !data) return null;

  const rejectionReasons = [
    { code: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
    { code: "POOR_IMAGE_QUALITY", label: "Poor Image Quality" },
    { code: "INCORRECT_PRICING", label: "Incorrect Pricing" },
    { code: "MISSING_DETAILS", label: "Missing Details" },
    { code: "OTHER", label: "Other" },
  ];

  const submittedAt = data.submittedAt ? new Date(data.submittedAt) : null;
  const surveyFieldLabels: Record<string, string> = {
    educational_attainment: "Educational Attainment",
    monthly_income: "Monthly Income",
    reason_for_sewing: "Reason for Sewing",
    favorite_aspect: "Favorite Aspect of Sewing",
    gives_pride: "What Gives Pride",
    expresses_self: "How Sewing Expresses Self",
    community_goals: "Community Goals",
    learn_method: "How They Learned Sewing",
    teacher_relationship: "Teacher Relationship",
    motivations: "Motivations",
    is_only_livelihood: "Only Livelihood",
    owns_machine: "Owns Sewing Machine",
    machine_owner: "Machine Owner",
    makes_traditional_products: "Makes Traditional Products",
    common_products_used_for: "Common Product Use",
    specific_products: "Specific Products",
    designs_garments: "Designs Garments",
  };
  const onboardingSurveyEntries = Object.entries(
    (data.sewistOnboardingSurvey ?? {}) as Record<string, string | null | undefined>
  ).filter(([, value]) => typeof value === "string" && value.trim().length > 0);

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
        case 'sewist':
          result = await approveSewist(data.id);
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
    if (type === "sewist") {
      setIsSubmitting(true);
      try {
        const result = await rejectSewist(data.id, "Declined by admin");
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
      return;
    }

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
        {/* Close Button (Back Arrow) */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-10 z-10 p-2 text-primary/50 hover:text-primary transition-colors"
        >
          <ChevronLeft size={40} className="stroke-[3]" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12">
          {type === 'product' ? (
            /* Product Verification Layout */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Quadrant 1: Pictures */}
                <div className="space-y-6">
                   <div className="relative aspect-square rounded-[32px] bg-gray-100 overflow-hidden shadow-sm">
                      <img
                        src={mainPreviewImage || "https://placehold.co/600x600?text=Product+Image"}
                        alt={data.productName || "Product"}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                   </div>
                   
                   {data.productImages && data.productImages.length > 0 && (
                     <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                        {data.productImages.map((imgUrl: string, idx: number) => (
                          <div 
                            key={idx} 
                            onClick={() => setMainPreviewImage(imgUrl)}
                            className={cn(
                              "aspect-square rounded-2xl bg-gray-100 overflow-hidden border-2 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95",
                              mainPreviewImage === imgUrl ? "border-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                          >
                            <img src={imgUrl} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                     </div>
                   )}
                </div>

                {/* Quadrant 2: Specification */}
                <div className="p-8 rounded-[40px] bg-secondary/10 border border-secondary/20 flex flex-col space-y-6 shadow-sm">
                   <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">Specification</h3>
                   
                   <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-3xl font-black text-primary">{data.price || "₱0"}</span>
                        <h2 className="text-4xl font-extrabold text-primary leading-tight">{data.productName || data.name}</h2>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">{data.category}</span>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">In Stock</span>
                      </div>

                      <p className="text-gray-600 text-lg leading-relaxed pt-2">
                        {data.description || "No description provided."}
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-white border border-gray-100 flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase">Fabric</span>
                           <span className="text-sm font-bold text-primary">Cotton Silk</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-gray-100 flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase">Estimated Shipping</span>
                           <span className="text-sm font-bold text-primary">7-10 Days</span>
                        </div>
                      </div>

                      {/* Variant Information */}
                      {data.variants && data.variants.length > 0 && (
                        <div className="pt-6 space-y-4">
                          <h4 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Variants ({data.variants.length})</h4>
                          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {data.variants.map((variant: any) => (
                              <div key={variant.id} className="p-3 rounded-xl bg-white border border-gray-100 flex justify-between items-center shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-primary">
                                    {variant.variant_attribute_values?.map((attr: any) => attr.attribute_value).join(' / ')}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-medium">SKU: {variant.sku}</span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <span className="text-sm font-black text-primary">{variant.price_override ? `₱${variant.price_override.toLocaleString()}` : data.price}</span>
                                  <span className="text-[10px] text-emerald-600 font-bold uppercase">{variant.stock_quantity} in stock</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Quadrant 3: Sewist Information */}
              <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/10 space-y-8 shadow-sm">
                 <h3 className="text-sm font-bold text-primary/60 uppercase tracking-widest">Sewist Information</h3>
                 
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-orchid flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                      <User size={48} />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sewist Name</span>
                          <span className="text-2xl font-extrabold text-primary">{data.sewistName}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Location</span>
                          <span className="text-lg font-bold text-primary flex items-center gap-1.5">
                            <Package size={16} className="text-primary/40" />
                            {data.location || "Quezon City"}
                          </span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Member Since</span>
                          <span className="text-lg font-bold text-primary flex items-center gap-1.5">
                            <Calendar size={16} className="text-primary/40" />
                            {data.sewistJoined || "Jan 2024"}
                          </span>
                       </div>
                    </div>

                    <div className="px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-sm uppercase tracking-wider">
                       Verified Sewist
                    </div>
                 </div>
              </div>

              {/* Metadata area */}
              <div className="flex justify-between items-center px-4 pt-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Product ID</span>
                    <span className="text-sm font-black text-primary/70">{data.id}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Date Submitted</span>
                    <span className="text-sm font-black text-primary/70">{data.orderDate || data.dateAdded}</span>
                 </div>
              </div>
            </div>
          ) : type === "sewist" ? (
            <div className="space-y-5">
              <div className="rounded-3xl border-2 border-sky-500 bg-primary/60 p-5 min-h-[520px] relative">
                <div className="flex items-start gap-4">
                  <div className="h-44 w-48 rounded-2xl bg-gray-300 overflow-hidden">
                    <img
                      src={data.avatarUrl || "https://placehold.co/320x280?text=Avatar"}
                      alt={data.customerName || "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-h-44 flex-1 rounded-2xl bg-white/20 p-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/70">Sewist Profile</p>
                    <p className="mt-2 text-2xl font-black">{data.customerName || "Unnamed user"}</p>
                    <div className="mt-3 space-y-1 text-sm font-semibold">
                      <p>{data.email || "No email"}</p>
                      <p>{data.location || "No location"}</p>
                      <p>Member since {data.orderDate || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white/95 p-4 text-primary">
                  <p className="text-sm font-black uppercase tracking-wide">
                    Sewist Onboarding Survey
                  </p>
                  {onboardingSurveyEntries.length > 0 ? (
                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {onboardingSurveyEntries.map(([key, value]) => (
                        <div key={key} className="rounded-xl border border-primary/10 bg-white p-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-primary/60">
                            {surveyFieldLabels[key] ?? key.replaceAll("_", " ")}
                          </p>
                          <p className="mt-1 text-sm font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-primary/70">
                      No onboarding survey data submitted.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-primary/70 px-1 font-bold">
                <span>Customer ID: {data.id}</span>
                <span>Date: {submittedAt ? submittedAt.toLocaleDateString() : "-"}</span>
              </div>
            </div>
          ) : (
            /* Existing Layout for Orders/Others */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* ... (keep existing order layout if needed or just use this one for all) ... */}
              {/* Quadrant 1: Image Carousel */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-[32px] bg-gray-100 overflow-hidden group">
                  <img
                    src={data.imageUrl || "https://placehold.co/600x600?text=Order+Image"}
                    alt={data.productName || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* ... rest of the original code ... */}
            </div>
          )}

          {/* Rejection Reason Input */}
          {isDeclineMode && type !== "sewist" && (
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
        </div>

        {/* Action Footer */}
        {data.status === 'Pending' ? (
          <div className="p-8 sm:p-10 bg-gray-50/80 border-t border-gray-100 flex gap-4 sm:gap-6">
            <ProfileButton
              disabled={isSubmitting}
              onClick={handleDeclineClick}
              variant="white"
              size="xl"
              className={cn(
                "flex-1 border-2 border-rose-500 text-rose-500 uppercase tracking-wider h-16",
                isDeclineMode && "bg-rose-500 text-white"
              )}
            >
              {isSubmitting ? "Processing..." : isDeclineMode ? "Confirm Decline" : "Decline"}
            </ProfileButton>
            {!isDeclineMode && (
              <ProfileButton
                disabled={isSubmitting}
                onClick={handleApproveClick}
                variant="green"
                size="xl"
                className="flex-2 uppercase tracking-wider shadow-xl shadow-emerald-200 h-16"
              >
                {isSubmitting ? "Processing..." : type === "sewist" ? "Approve" : "Approve Request"}
              </ProfileButton>
            )}
          </div>
        ) : (
          <div className="p-8 sm:p-10 bg-gray-50/80 border-t border-gray-100 flex items-center justify-center">
            <p className="text-lg font-bold text-gray-500 uppercase tracking-widest">
              This request is {data.status}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
