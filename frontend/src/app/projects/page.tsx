"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Plus, MapPin, Briefcase, Eye, Search, BarChart3, TrendingUp, Target, DollarSign } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  manager: string;
  progress: number;
  budget: number;
  income: number;
  expense: number;
  province: string;
  domain: string;
  tasks_count: number;
  status: string;
}

export default function ProjectsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [projects] = useState<Project[]>([
    { id: "1", name: "پروژه توسعه نرم‌افزار مشهد", manager: "اسکار", progress: 75, budget: 500, income: 320, expense: 180, province: "مشهد", domain: "فناوری اطلاعات", tasks_count: 10, status: "active" },
    { id: "2", name: "پروژه زیرساخت شبکه تهران", manager: "مارک", progress: 60, budget: 420, income: 250, expense: 170, province: "تهران", domain: "شبکه", tasks_count: 8, status: "active" },
    { id: "3", name: "پروژه اتوماسیون اصفهان", manager: "دانیال", progress: 80, budget: 380, income: 300, expense: 200, province: "اصفهان", domain: "اتوماسیون", tasks_count: 9, status: "active" },
    { id: "4", name: "پروژه امنیت سایبری شیراز", manager: "دانیال جی", progress: 45, budget: 650, income: 200, expense: 150, province: "شیراز", domain: "امنیت", tasks_count: 12, status: "active" },
    { id: "5", name: "پروژه تحلیل داده تبریز", manager: "اسکار", progress: 100, budget: 300, income: 300, expense: 280, province: "تبریز", domain: "داده", tasks_count: 6, status: "completed" },
  ]);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  const filtered = projects.filter(p => p.name.includes(search) || p.province.includes(search) || p.domain.includes(search));

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalIncome = projects.reduce((s, p) => s + p.income, 0);
  const totalExpense = projects.reduce((s, p) => s + p.expense, 0);
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length);

  if (isLoading || !user) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">📊 پروژه‌ها</h1><p className="text-gray-700 mt-1">مدیریت و پیگیری پروژه‌ها</p></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={20} /><span>پروژه جدید</span></button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "کل", value: projects.length, icon: BarChart3, color: "bg-blue-500" },
            { label: "پیشرفت", value: `${avgProgress}%`, icon: TrendingUp, color: "bg-green-500" },
            { label: "اعتبار", value: totalBudget.toLocaleString(), icon: DollarSign, color: "bg-purple-500" },
            { label: "فعال", value: projects.filter(p => p.status === "active").length, icon: Target, color: "bg-orange-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <div className={`${s.color} p-3 rounded-lg`}><s.icon className="h-5 w-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg text-right" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs text-gray-500">نام پروژه</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500">مدیر</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500">استان</th>
                <th className="px-4 py-3 text-center text-xs text-gray-500">پیشرفت</th>
                <th className="px-4 py-3 text-center text-xs text-gray-500">اعتبار</th>
                <th className="px-4 py-3 text-center text-xs text-gray-500">اقدامات</th>
                <th className="px-4 py-3 text-center text-xs text-gray-500">مشاهده</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-sm">{p.manager}</td>
                  <td className="px-4 py-3 text-sm flex items-center gap-1"><MapPin size={14} />{p.province}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2 justify-center"><div className="w-20 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${p.progress === 100 ? "bg-green-500" : "bg-blue-500"}`} style={{width:`${p.progress}%`}} /></div><span className="text-sm">{p.progress}%</span></div></td>
                  <td className="px-4 py-3 text-sm text-center">{p.budget}</td>
                  <td className="px-4 py-3 text-sm text-center">{p.tasks_count}</td>
                  <td className="px-4 py-3 text-center"><Link href={`/projects/detail?id=${p.id}`} className="text-blue-600 hover:text-blue-800"><Eye size={16} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
