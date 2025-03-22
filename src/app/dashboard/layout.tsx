"use client";
import Navbar from '@/components/navbar';
import { usePathname } from 'next/navigation';
import React from 'react'
import "@/styles/dashboard.css"
import Sidebar from "@/components/sidebar";
const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const pathname=usePathname();
    const dashboardPath=["/dashboard"];
  return (
    <div>
      <Navbar/>
      <div className={`flex`}>
      <Sidebar/>
      <main>
      {children}
      </main>
      </div>
    </div>
  )
}

export default layout