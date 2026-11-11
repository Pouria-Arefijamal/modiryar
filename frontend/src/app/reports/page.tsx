"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from "lucide-react";

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const incomeData = [
    { month: "فروردین", income: 8500, expense: 6200 },
    { month: "اردیبهشت", income: 12000, expense: 8500 },
    { month: "خرداد", income: 9500, expense: 7100 },
    { month: "تیر", income: 15000, expense: 10500 },
  ];

  const totalIncome = incomeData.reduce((s, m) => s + m.income, 0);
  const totalExpense = incomeData.reduce((s, m) => s + m.expense, 0);
  const maxVal = Math.max(...incomeData.map(m => Math.max(m.income, m.expense)));

  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">📈 گزارشات</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 text-center"><TrendingUp className="h-10 w-10 mx-auto text-green-500 mb-2" /><p className="text-sm text-gray-500">کل درآمد</p><p className="text-3xl font-bold text-green-600">{totalIncome.toLocaleString()}</p></div>
          <div className="bg-white rounded-lg shadow p-6 text-center"><TrendingDown className="h-10 w-10 mx-auto text-red-500 mb-2" /><p className="text-sm text-gray-500">کل هزینه</p><p className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString()}</p></div>
          <div className="bg-white rounded-lg shadow p-6 text-center"><DollarSign className="h-10 w-10 mx-auto text-blue-500 mb-2" /><p className="text-sm text-gray-500">سود خالص</p><p className="text-3xl font-bold text-blue-600">{(totalIncome - totalExpense).toLocaleString()}</p></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">نمودار درآمد و هزینه ماهانه</h3>
          <div className="space-y-4">
            {incomeData.map(m => (
              <div key={m.month}>
                <div className="flex justify-between text-sm mb-1"><span>{m.month}</span><span className="text-xs text-gray-500">درآمد: {m.income} | هزینه: {m.expense}</span></div>
                <div className="flex gap-1 h-6">
                  <div className="bg-green-500 h-6 rounded" style={{ width: `${(m.income / maxVal) * 50}%` }}></div>
                  <div className="bg-red-500 h-6 rounded" style={{ width: `${(m.expense / maxVal) * 50}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded"></span> درآمد</span><span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded"></span> هزینه</span></div>
        </div>
      </div>
    </Layout>
  );
}
