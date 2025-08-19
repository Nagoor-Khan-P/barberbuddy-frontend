// components/LayoutContent.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Toaster } from "react-hot-toast";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where back button should be hidden
  const hideOnRoutes = ["/", "/home", "/login", "/register", "/barber/home"];

  return (
    <>
      <Header />
      {!hideOnRoutes.includes(pathname) && <BackButton />}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {children}
    </>
  );
}
