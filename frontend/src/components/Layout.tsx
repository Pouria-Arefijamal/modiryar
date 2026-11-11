"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, FolderKanban, Users, BarChart3, 
  LogOut, Menu, X, Plus, Target, TrendingUp, DollarSign 
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { label: "پروژه‌ها", href: "/projects", icon: FolderKanban },
  { label: "مشارکت‌کنندگان", href: "/participants", icon: Users },
  { label: "گزارشات", href: "/reports", icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 z-30 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link href="/projects" className="text-xl font-bold flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-400" />
            <span>مدیر یار</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={24} /></button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <Icon size={20} /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-red-400 hover:text-red-300"><LogOut size={20} /></button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pr-64">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-6">
            <span className="font-bold text-gray-900">مدیر یار</span>
            <button onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
