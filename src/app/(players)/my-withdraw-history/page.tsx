"use client";

import React, { useState } from "react";
import { useMyWithdrawsQuery } from "@/Redux/Apis/withdrawApis";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

interface WithdrawRecord {
  _id: string;
  amount: number;
  status: "Completed" | "Rejected" | "Pending" | string;
  entityType?: string;
  entityId?: string;
  stripeTransferId?: string | null;
  rejectionReason?: string | null;
  withdrawOption?: string;
  createdAt: string;
  updatedAt?: string;
}

interface WithdrawMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const WithdrawHistoryPage = () => {
  const [page, setPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useMyWithdrawsQuery({ page, limit: 10 });

  const withdrawals: WithdrawRecord[] = data?.data?.result || [];
  const pagination: WithdrawMeta | undefined = data?.data?.meta;

  // Aggregate stats
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "Completed")
    .reduce((acc, w) => acc + (Number(w.amount) || 0), 0);

  const pendingCount = withdrawals.filter((w) => w.status === "Pending").length;
  const pendingAmount = withdrawals
    .filter((w) => w.status === "Pending")
    .reduce((acc, w) => acc + (Number(w.amount) || 0), 0);

  const completedCount = withdrawals.filter(
    (w) => w.status === "Completed"
  ).length;
  const rejectedCount = withdrawals.filter(
    (w) => w.status === "Rejected"
  ).length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60 capitalize">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        {status || "Unknown"}
      </span>
    );
  };

  const getStatusIcon = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "completed") {
      return (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    }
    if (s === "pending") {
      return (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-amber-50 border-amber-100 text-amber-600">
          <Clock className="w-4 h-4" />
        </div>
      );
    }
    if (s === "rejected") {
      return (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-rose-50 border-rose-100 text-rose-600">
          <XCircle className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-slate-50 border-slate-200 text-slate-600">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Withdraw History
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track all your withdrawal requests and payouts
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-8 items-stretch">
        {/* Big Primary Card */}
        <div className="md:col-span-7 lg:col-span-8 bg-[#053697] text-white rounded-md p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-[#053697] min-h-[220px]">
          {/* Subtle Background Accents */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-12 top-2 w-36 h-36 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Total Withdrawn (Completed)
            </span>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              $
              {totalWithdrawn.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
            <span>Successfully processed withdrawals</span>
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              {completedCount} completed
            </span>
          </div>
        </div>

        {/* Two Stacked Secondary Cards */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-2">
          {/* Pending Withdrawals */}
          <div className="flex-1 bg-white border border-slate-200 rounded-md p-5 sm:p-6 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Requests
            </span>
            <div className="my-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{pendingCount}</span>
              {pendingAmount > 0 && (
                <span className="text-sm font-semibold text-amber-600">
                  ${pendingAmount.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Awaiting admin approval
            </p>
          </div>

          {/* Rejection Rate */}
          <div className="flex-1 bg-white border border-slate-200 rounded-md p-5 sm:p-6 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Success Rate
            </span>
            <div className="my-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>
                {withdrawals.length > 0
                  ? Math.round(
                      (completedCount /
                        (completedCount + rejectedCount || 1)) *
                        100
                    )
                  : 100}
                %
              </span>
              <span className="text-xs font-bold text-[#2FC191]">APPROVED</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {completedCount} approved · {rejectedCount} rejected
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Withdrawal Requests
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {pagination?.total ?? withdrawals.length} total
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Page {page} of {pagination?.totalPage || 1}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="divide-y divide-slate-100 p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-3.5 bg-slate-200 rounded" />
                    <div className="w-20 h-2.5 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-slate-200 rounded" />
                <div className="w-16 h-4 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : withdrawals.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Banknote className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Withdrawals Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Your withdrawal requests and payout history will appear here once
              you make your first withdrawal.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Withdrawal Details</th>
                    <th className="py-3.5 px-6">Date &amp; Time</th>
                    <th className="py-3.5 px-6">Method</th>
                    <th className="py-3.5 px-6">Reference</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {withdrawals.map((w, idx) => {
                    const formattedDate = new Date(
                      w.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const formattedTime = new Date(
                      w.createdAt
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr
                        key={w._id || idx}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Withdrawal Details */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(w.status)}
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 text-xs block">
                                -${Number(w.amount || 0).toFixed(2)}
                              </span>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Withdrawal Request
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900">
                            {formattedDate}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formattedTime}
                          </p>
                        </td>

                        {/* Method */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <Wallet className="w-3.5 h-3.5 text-slate-400" />
                            {w.withdrawOption || "Stripe"}
                          </span>
                        </td>

                        {/* Reference / Rejection Reason */}
                        <td className="py-4 px-6">
                          {w.status === "Completed" && w.stripeTransferId ? (
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  w.stripeTransferId!,
                                  w._id
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                              title="Copy Transfer ID"
                            >
                              <span className="truncate max-w-[120px]">
                                {w.stripeTransferId}
                              </span>
                              {copiedId === w._id ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          ) : w.status === "Rejected" && w.rejectionReason ? (
                            <div className="flex items-start gap-1.5 max-w-[200px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-rose-600 leading-tight">
                                {w.rejectionReason}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-right">
                          {getStatusBadge(w.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {withdrawals.map((w, idx) => {
                const formattedDate = new Date(
                  w.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = new Date(
                  w.createdAt
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={w._id || idx} className="p-4 space-y-3">
                    {/* Top: Icon + Amount & Date */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            w.status === "Completed"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : w.status === "Pending"
                              ? "bg-amber-50 border-amber-100 text-amber-600"
                              : w.status === "Rejected"
                              ? "bg-rose-50 border-rose-100 text-rose-600"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {w.status === "Completed" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : w.status === "Pending" ? (
                            <Clock className="w-4 h-4" />
                          ) : w.status === "Rejected" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900">
                            Withdrawal Request
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formattedDate} • {formattedTime}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900 block">
                          -${Number(w.amount || 0).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          via {w.withdrawOption || "Stripe"}
                        </span>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {w.status === "Rejected" && w.rejectionReason && (
                      <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{w.rejectionReason}</span>
                      </div>
                    )}

                    {/* Transfer ID for completed */}
                    {w.status === "Completed" && w.stripeTransferId && (
                      <button
                        onClick={() =>
                          copyToClipboard(w.stripeTransferId!, w._id)
                        }
                        className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 w-full cursor-pointer"
                      >
                        <span className="truncate">
                          {w.stripeTransferId}
                        </span>
                        {copiedId === w._id ? (
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 shrink-0" />
                        )}
                      </button>
                    )}

                    {/* Footer: Method & Status */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Wallet className="w-3 h-3 text-slate-400" />
                        {w.withdrawOption || "Stripe"}
                      </span>
                      <div className="shrink-0">
                        {getStatusBadge(w.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Controls — always visible */}
        {pagination && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {pagination.total === 0
                  ? 0
                  : (page - 1) * (pagination.limit || 10) + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(
                  page * (pagination.limit || 10),
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {pagination.total}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-700">
                <span>{page}</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-400">
                  {pagination.totalPage || 1}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPage((p) =>
                    Math.min(pagination.totalPage || 1, p + 1)
                  )
                }
                disabled={page >= (pagination.totalPage || 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawHistoryPage;
