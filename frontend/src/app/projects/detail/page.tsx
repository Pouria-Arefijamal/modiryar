"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import { ArrowLeft, Plus, Trash2, Save, Target, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Task {
  id: string;
  name: string;
  responsible: string;
  progress: number;
  status: string;
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProjectDetailContent />
    </Suspense>
  );
}

function ProjectDetailContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id") as string;

  const [project] = useState({
    name: "پروژه توسعه نرم‌افزار مشهد",
    manager: "اسکار",
    budget: 500, income: 320, expense: 180,
    province: "مشهد", domain: "فناوری اطلاعات",
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "تحلیل نیازمندی‌ها", responsible: "دانیال", progress: 100, status: "done" },
    { id: "2", name: "طراحی معماری", responsible: "مارک", progress: 80, status: "in_progress" },
    { id: "3", name: "پیاده‌سازی", responsible: "شخص ۱", progress: 40, status: "in_progress" },
  ]);

  const [newTask, setNewTask] = useState({ name: "", responsible: "" });
  const [showAdd, setShowAdd] = useState(false);

  const totalProgress = Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length);

  const statusColors: Record<string, string> = { done: "bg-green-100 text-green-800", in_progress: "bg-blue-100 text-blue-800", pending: "bg-yellow-100 text-yellow-800" };
  const statusLabels: Record<string, string> = { done: "انجام شده", in_progress: "در حال انجام", pending: "در انتظار" };

  const handleAddTask = () => {
    if (!newTask.name) { toast.error("نام فعالیت الزامی است"); return; }
    setTasks([...tasks, { id: String(Date.now()), ...newTask, progress: 0, status: "pending" }]);
    setNewTask({ name: "", responsible: "" });
    setShowAdd(false);
    toast.success("فعالیت اضافه شد");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"><ArrowLeft size={20} />بازگشت</Link>

        <h1 className="text-2xl font-bold">{project.name}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "پیشرفت", value: `${totalProgress}%`, icon: Target, color: "bg-blue-100" },
            { label: "اعتبار", value: project.budget, icon: DollarSign, color: "bg-green-100" },
            { label: "درآمد", value: project.income, icon: TrendingUp, color: "bg-purple-100" },
            { label: "هزینه", value: project.expense, icon: BarChart3, color: "bg-red-100" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <div className={`${s.color} p-3 rounded-lg`}><s.icon className="h-5 w-5" /></div>
              <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between">
            <h3 className="font-semibold">فعالیت‌ها</h3>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"><Plus size={16} />افزودن</button>
          </div>
          {showAdd && (
            <div className="p-4 bg-gray-50 flex gap-3">
              <input type="text" placeholder="نام فعالیت" value={newTask.name} onChange={e => setNewTask(p => ({...p, name: e.target.value}))} className="flex-1 px-3 py-2 border rounded-md text-right" />
              <input type="text" placeholder="مسئول" value={newTask.responsible} onChange={e => setNewTask(p => ({...p, responsible: e.target.value}))} className="w-40 px-3 py-2 border rounded-md text-right" />
              <button onClick={handleAddTask} className="px-4 py-2 bg-green-600 text-white rounded-lg"><Save size={16} /></button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg">✕</button>
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-right text-xs text-gray-500">#</th><th className="px-4 py-3 text-right">فعالیت</th><th className="px-4 py-3 text-right">مسئول</th><th className="px-4 py-3 text-center">پیشرفت</th><th className="px-4 py-3 text-center">وضعیت</th><th className="px-4 py-3 text-center">حذف</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((t, i) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-sm">{t.responsible}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2 justify-center"><input type="range" min="0" max="100" value={t.progress} onChange={e => setTasks(tasks.map(x => x.id === t.id ? {...x, progress: Number(e.target.value)} : x))} className="w-20 accent-blue-600" /><span className="text-sm">{t.progress}%</span></div></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[t.status]}`}>{statusLabels[t.status]}</span></td>
                  <td className="px-4 py-3 text-center"><button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-red-500"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}