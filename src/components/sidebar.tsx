"use client";
import React from 'react'
import { usePathname } from 'next/navigation';
const Sidebar = () => {
  const pathname=usePathname();
  return (
    <div className={`${[pathname==="/"?"":"hidden"]}`}>Sidebar</div>
  )
}

export default Sidebar