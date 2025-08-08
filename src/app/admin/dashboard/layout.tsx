"use client";

import type React from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const handleHamburger=()=>{
    setShowMobileMenu(!showMobileMenu);
    }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar showMobileMenu={showMobileMenu}/>
      <div className="flex-1 md:ml-64">
        <Navbar showMobileMenu={showMobileMenu} handleHamburger={handleHamburger}/>
        <main className="p-6 pt-24">{children}</main>
      </div>
    </div>
  );
}
