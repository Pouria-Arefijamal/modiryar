"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import api from "@/lib/api";
import { 
  BarChart3, TrendingUp, Target, DollarSign, Users, 
  Briefcase, FolderKanban, CheckCircle, Clock, AlertCircle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

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

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    // Load demo data
    setProjects([
      { id: "1", name: "پروژه مشهد", manager: "علی", progress: 75, budget: 500, income: 320, expense: 180, province: "مشهد", domain: "فناوری", tasks_count: 10, status: "active" },
      { id: "2", name: "پروژه تهران", manager: "سارا", progress: 60, budget: 420, income: 250, expense: 170, province: "تهران", domain: "شبکه", tasks_count: 8, status: "active" },
      { id: "3", name: "پروژه اصفهان", manager: "دانیال", progress: 80, budget: 380, income: 300, expense: 200, province: "اصفهان", domain: "اتوماسیون", tasks_count: 9, status: "active" },
      { id: "4", name: "پروژه شیراز", manager: "مریم", progress: 45, budget: 650, income: 200, expense: 150, province: "شیراز", domain: "امنیت", tasks_count: 12, status: "active" },
      { id: "5", name: "پروژه تبریز", manager: "رضا", progress: 100, budget: 300, income: 300, expense: 280, province: "تبریز", domain: "داده", tasks_count: 6, status: "completed" },
    ]);
    setLoading(false);
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const activeProjects = projects.filter(p => p.status === "active");
  const completedProjects = projects.filter(p => p.status === "completed");
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalIncome = projects.reduce((s, p) => s + p.income, 0);
  const totalExpense = projects.reduce((s, p) => s + p.expense, 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;
  const totalTasks = projects.reduce((s, p) => s + p.tasks_count, 0);

  const stats = [
    { label: "کل پروژه‌ها", value: projects.length, icon: FolderKanban, color: "bg-blue-500", bgColor: "bg-blue-50" },
    { label: "فعال", value: activeProjects.length, icon: Clock, color: "bg-green-500", bgColor: "bg-green-50" },
    { label: "تکمیل شده", value: completedProjects.length, icon: CheckCircle, color: "bg-purple-500", bgColor: "bg-purple-50" },
    { label: "میانگین پیشرفت", value: `${avgProgress}%`, icon: TrendingUp, color: "bg-orange-500", bgColor: "bg-orange-50" },
    { label: "کل اقدامات", value: totalTasks, icon: Briefcase, color: "bg-teal-500", bgColor: "bg-teal-50" },
    { label: "مجموع اعتبار", value: totalBudget.toLocaleString(), icon: DollarSign, color: "bg-indigo-500", bgColor: "bg-indigo-50" },
    { label: "کل درآمد", value: totalIncome.toLocaleString(), icon: TrendingUp, color: "bg-emerald-500", bgColor: "bg-emerald-50" },
    { label: "کل هزینه", value: totalExpense.toLocaleString(), icon: BarChart3, color: "bg-red-500", bgColor: "bg-red-50" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">سلام {user.name}!</h1>
              <p className="text-blue-100 mt-1">به پنل مدیریت پروژه خوش آمدید</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-blue-100">آخرین ورود</p>
              <p className="text-white font-medium">امروز - {new Date().toLocaleTimeString("fa-IR")}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace("bg-", "text-")}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">نمودار درآمد و هزینه</span>
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>درآمد</span>
                  <span className="text-green-600 font-medium">{totalIncome.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${totalBudget > 0 ? (totalIncome / totalBudget) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>هزینه</span>
                  <span className="text-red-600 font-medium">{totalExpense.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-sm">
              <span className="text-gray-600">سود خالص</span>
              <span className={`font-bold ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}>
                {(totalIncome - totalExpense).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Project Progress */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">پیشرفت پروژه‌ها</h3>
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate max-w-[120px]">{p.name}</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${p.progress === 100 ? "bg-green-500" : p.progress >= 50 ? "bg-blue-500" : "bg-yellow-500"}`}
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">پروژه‌های اخیر</h3>
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/projects/detail?id=${p.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${p.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.manager} | {p.province}</p>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-gray-400" />
                </Link>
              ))}
            </div>
            <Link href="/projects" className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-700">
              مشاهده همه پروژه‌ها
              <ChevronLeft size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}