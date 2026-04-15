"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "Accepted" | "Declined" | "Pending" | "Completed" | "Cancelled";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onDetailsClick?: (item: T) => void;
}

export function AdminDataTable<T extends { id: string | number }>({
  columns,
  data,
  onDetailsClick,
}: AdminDataTableProps<T>) {
  return (
    <div className="bg-primary/5 rounded-3xl overflow-hidden p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/20">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-4 py-4 text-sm font-semibold text-primary/70 whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-4 py-4 text-sm font-semibold text-primary/70 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {data.map((item, rowIdx) => (
              <tr
                key={item.id || rowIdx}
                className="hover:bg-white/40 transition-colors"
              >
                {columns.map((column, colIdx) => (
                  <td key={colIdx} className="px-4 py-4 align-middle">
                    {column.cell ? (
                      column.cell(item)
                    ) : (
                      <span className="text-primary text-sm">
                        {String(item[column.accessorKey as keyof T])}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-4 align-middle text-right">
                  <button
                    onClick={() => onDetailsClick?.(item)}
                    className="inline-flex items-center px-5 py-1.5 rounded-full bg-primary/70 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 font-medium">No records found.</p>
        </div>
      )}
    </div>
  );
}

// Reusable Cell Components for the two-line format
export function TwoLineCell({ 
  title, 
  subtitle, 
  titleClassName,
  subtitleClassName,
  showSquare = false
}: { 
  title: string; 
  subtitle: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showSquare?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {showSquare && (
        <div className="w-5 h-5 mt-0.5 bg-primary/20 rounded-sm shrink-0" />
      )}
      <div className="flex flex-col">
        <span className={cn("text-primary font-bold text-sm", titleClassName)}>
          {title}
        </span>
        <span className={cn("text-primary/70 text-xs font-medium", subtitleClassName)}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: StatusType }) {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "Accepted":
      case "Completed":
        return "bg-emerald-400";
      case "Declined":
      case "Cancelled":
        return "bg-rose-400";
      case "Pending":
      default:
        return "bg-amber-400";
    }
  };

  return (
    <div className="inline-flex items-center gap-2 text-sm text-primary">
      <span className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(status))} />
      {status}
    </div>
  );
}
