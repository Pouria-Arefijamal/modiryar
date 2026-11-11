import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "مدیر یار | سامانه مدیریت پروژه",
  description: "سامانه جامع مدیریت پروژه‌ها",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="font-[Vazirmatn]">
        <AuthProvider>
          <Toaster position="top-left" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
