"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, BarChart3 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور مطابقت ندارد",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
    } catch (error) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-2xl mb-4">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">مدیر یار</h1>
          <p className="text-blue-200 mt-2">ایجاد حساب کاربری</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">ثبت‌نام</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
              <input type="text" {...register("name")} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-right" placeholder="نام و نام خانوادگی" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <input type="email" {...register("email")} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-right" placeholder="example@email.com" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} {...register("password")} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-right pr-12" placeholder="حداقل ۶ کاراکتر" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تکرار رمز عبور</label>
              <input type="password" {...register("confirmPassword")} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-right" placeholder="رمز عبور را دوباره وارد کنید" />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium text-lg">
              {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <UserPlus size={20} />}
              <span>{isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}</span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">وارد شوید</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
