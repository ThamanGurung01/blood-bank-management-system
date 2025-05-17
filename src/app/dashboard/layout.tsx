// "use client";
// import Navbar from '@/components/navbar';
// import { usePathname } from 'next/navigation';
// import React from 'react'
// import "@/styles/dashboard.css"
// import Sidebar from "@/components/sidebar";
// const layout = ({
//     children,
//   }: Readonly<{
//     children: React.ReactNode;
//   }>) => {
//     const pathname=usePathname();
//     const dashboardPath=["/dashboard"];
//   return (
//     <div>
//       <Navbar/>
//       <div className={`flex`}>
//       <Sidebar/>
//       <main>
//       {children}
//       </main>
//       </div>
//     </div>
//   )
// }

// export default layout
"use client";

import type React from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar />
        <main className="p-6 pt-24">{children}</main>
      </div>
    </div>
  );
}
