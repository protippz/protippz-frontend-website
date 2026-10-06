"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { get } from "@/ApisRequests/server";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpRight as ArrowUpRightIcon,
  RefreshCw,
} from "lucide-react";

interface TransitionLog {
  amount: number;
  createdAt: string;
  transactionType: string;
  status: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const TransactionLogPage = () => {
  const [page, setPage] = useState<number>(1);
  const [transactions, setTransactions] = useState<TransitionLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const token =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("token")
            : "";
        const res = await get(`/transaction/my-transactions?page=${page}`, {
          headers: {
            Authorization: `${token || ""}`,
          },
        });
        if (res?.data?.result) {
          setTransactions(res.data.result);
          setPagination(res.data.meta);
        }
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [page]);

  // Aggregate stats from current transaction data
  const totalVolume = transactions.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );
  const completedCount = transactions.filter(
    (t) => t.status?.toLowerCase() === "completed" || t.status?.toLowerCase() === "success"
  ).length;

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Transaction Log
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Monitor and track your wallet deposits, withdrawals, and payments
          </p>
        </div>

        <Link
          href="/deposit"
          className="inline-flex items-center justify-center gap-1.5 bg-[#053697] hover:bg-[#053697]/90 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <span>Deposit Funds</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards: 1 Big Primary Card on Left + 2 Stacked Rows on Right (Equal Total Height) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 items-stretch">
        {/* Big Primary Card */}
        <div className="md:col-span-7 lg:col-span-8 bg-[#053697] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-[#053697] min-h-[220px]">
          {/* Minimal Subtle Background Accent */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-12 top-2 w-36 h-36 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Total Transaction Volume
            </span>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              ${totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
            <span>Overall account ledger activity</span>
            <span className="font-semibold text-[#2FC191]">Verified Ledger</span>
          </div>
        </div>

        {/* Two Stacked Secondary Cards */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
          {/* Row 1: Total Transactions */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Transactions
            </span>
            <div className="my-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pagination?.total || transactions.length}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Lifetime ledger entries
            </p>
          </div>

          {/* Row 2: Status Overview */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Page Success Rate
            </span>
            <div className="my-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{transactions.length > 0 ? Math.round((completedCount / transactions.length) * 100) : 100}%</span>
              <span className="text-xs font-bold text-[#2FC191]">SUCCESS</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {completedCount} of {transactions.length} entries successful
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container (Clean Flat Border & Divide-y) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Transaction History
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {pagination?.total || transactions.length} total
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
                <div className="flex items-center gap-3">
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
        ) : transactions.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3 font-bold text-lg">
              $
            </div>
            <h3 className="text-base font-bold text-slate-900">No Transactions Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Your wallet deposits, withdrawals, and payment activities will be recorded here.
            </p>
            <div className="mt-5">
              <Link
                href="/deposit"
                className="inline-flex items-center gap-1.5 bg-[#053697] hover:bg-[#053697]/90 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <span>Add Funds</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Transaction Type</th>
                    <th className="py-3.5 px-6">Date & Time</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {transactions.map((tx, idx) => {
                    const formattedDate = new Date(tx.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                    const formattedTime = new Date(tx.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );

                    const isDeposit =
                      tx.transactionType?.toLowerCase().includes("deposit") ||
                      tx.transactionType?.toLowerCase().includes("add");
                    const isWithdraw =
                      tx.transactionType?.toLowerCase().includes("withdraw") ||
                      tx.transactionType?.toLowerCase().includes("payout");

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Type */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                isDeposit
                                  ? "bg-emerald-50 border-emerald-100 text-[#2FC191]"
                                  : isWithdraw
                                  ? "bg-amber-50 border-amber-100 text-amber-600"
                                  : "bg-blue-50 border-blue-100 text-[#053697]"
                              }`}
                            >
                              {isDeposit ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : isWithdraw ? (
                                <ArrowUpRightIcon className="w-4 h-4" />
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <span className="font-bold text-slate-900 capitalize">
                              {tx.transactionType || "Transaction"}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900">
                            {formattedDate}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formattedTime}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-6">
                          <span
                            className={`font-bold text-sm ${
                              isDeposit
                                ? "text-emerald-600"
                                : "text-slate-900"
                            }`}
                          >
                            {isDeposit ? "+" : ""}${Number(tx.amount).toFixed(2)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 capitalize">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {tx.status || "Completed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Stacked List) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {transactions.map((tx, idx) => {
                const formattedDate = new Date(tx.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                );

                const isDeposit =
                  tx.transactionType?.toLowerCase().includes("deposit") ||
                  tx.transactionType?.toLowerCase().includes("add");

                return (
                  <div key={idx} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 capitalize">
                          {tx.transactionType || "Transaction"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formattedDate}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            isDeposit ? "text-emerald-600" : "text-slate-900"
                          }`}
                        >
                          {isDeposit ? "+" : ""}${Number(tx.amount).toFixed(2)}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 capitalize">
                          ● {tx.status || "Completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPage > 1 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {(page - 1) * (pagination.limit || 10) + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(page * (pagination.limit || 10), pagination.total)}
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-700">
                <span>{page}</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-400">{pagination.totalPage}</span>
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPage, p + 1))}
                disabled={page >= pagination.totalPage}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
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

export default TransactionLogPage;
