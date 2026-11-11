"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Plus, Mail, Phone, Briefcase, Search, Users, X } from "lucide-react";
import toast from "react-hot-toast";

interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  project_name: string;
}

export default function ParticipantsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "دانیال جی پارک", role: "مشارکت‌کننده", email: "danial@modiryar.ir", phone: "۰۹۱۲۳۴۵۶۷۸۹", project_name: "پروژه مشهد" },
    { id: "2", name: "مارک روخاس", role: "مشارکت‌کننده", email: "mark@modiryar.ir", phone: "۰۹۱۲۳۴۵۶۷۸۹", project_name: "پروژه تهران" },
    { id: "3", name: "شخص ۱", role: "مجری", email: "person1@modiryar.ir", phone: "۰۹۱۲۳۴۵۶۷۸۹", project_name: "پروژه اصفهان" },
    { id: "4", name: "اسکار", role: "مدیر", email: "oscar@modiryar.ir", phone: "۰۹۱۲۳۴۵۶۷۸۹", project_name: "پروژه مشهد" },
  ]);

  const [newParticipant, setNewParticipant] = useState({ name: "", role: "مشارکت‌کننده", email: "", phone: "", project_name: "" });

  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [user, isLoading, router]);

  const handleAdd = () => {
    if (!newParticipant.name || !newParticipant.email) { toast.error("نام و ایمیل الزامی است"); return; }
    setParticipants([{ ...newParticipant, id: String(Date.now()) }, ...participants]);
    setNewParticipant({ name: "", role: "مشارکت‌کننده", email: "", phone: "", project_name: "" });
    setShowAdd(false);
    toast.success("مشارکت‌کننده اضافه شد");
  };

  const handleDelete = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
    toast.success("حذف شد");
  };

  const filtered = participants.filter(p => p.name.includes(search) || p.email.includes(search) || p.project_name.includes(search));

  if (isLoading || !user) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">👥 مشارکت‌کنندگان</h1><p className="text-gray-700 mt-1">مدیریت افراد پروژه</p></div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={20} /><span>افزودن</span></button>
        </div>

        <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg text-right" /></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{p.name.charAt(0)}</div>
                  <div><h3 className="font-semibold">{p.name}</h3><span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{p.role}</span></div>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail size={14} /><span dir="ltr">{p.email}</span></div>
                {p.phone && <div className="flex items-center gap-2"><Phone size={14} /><span>{p.phone}</span></div>}
                <div className="flex items-center gap-2"><Briefcase size={14} /><span>{p.project_name}</span></div>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-4 border-b flex justify-between"><h3 className="font-semibold">افزودن مشارکت‌کننده</h3><button onClick={() => setShowAdd(false)}>✕</button></div>
              <div className="p-4 space-y-3">
                <input type="text" placeholder="نام *" value={newParticipant.name} onChange={e => setNewParticipant(p => ({...p, name: e.target.value}))} className="w-full px-3 py-2 border rounded-md text-right" />
                <select value={newParticipant.role} onChange={e => setNewParticipant(p => ({...p, role: e.target.value}))} className="w-full px-3 py-2 border rounded-md"><option>مشارکت‌کننده</option><option>مجری</option><option>مدیر</option></select>
                <input type="email" placeholder="ایمیل *" value={newParticipant.email} onChange={e => setNewParticipant(p => ({...p, email: e.target.value}))} className="w-full px-3 py-2 border rounded-md text-left" dir="ltr" />
                <input type="text" placeholder="تلفن" value={newParticipant.phone} onChange={e => setNewParticipant(p => ({...p, phone: e.target.value}))} className="w-full px-3 py-2 border rounded-md text-right" />
                <input type="text" placeholder="پروژه" value={newParticipant.project_name} onChange={e => setNewParticipant(p => ({...p, project_name: e.target.value}))} className="w-full px-3 py-2 border rounded-md text-right" />
              </div>
              <div className="p-4 border-t flex gap-2"><button onClick={handleAdd} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">افزودن</button><button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg">انصراف</button></div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
