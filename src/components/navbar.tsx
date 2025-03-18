"use client"
import React from 'react'
import { usePathname } from 'next/navigation';
const Navbar = () => {
      const pathname=usePathname();
      const dashboardPath=["/"];
  return (
    <div className={`${[dashboardPath.includes(pathname)?"":"hidden"]}`}>
        <div className='w-full flex justify-between px-10 py-3 border-b-2 border-gray-300'>
        <h1 className='text-3xl font-bold'>Blood Bank Management</h1>
        <div>
        <img src="/blood.png" className='rounded-full w-10 h-10 border-2' alt="Profile" />
        </div>
        </div>
    </div>
  )
}

export default Navbar