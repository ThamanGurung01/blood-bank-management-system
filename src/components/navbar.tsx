"use client"
import React from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
const Navbar = () => {
  return (
    <div className="bg-white fixed left-0 top-0 w-full z-24">
        <div className='w-full flex justify-between px-10 py-6 border-b-2 border-gray-300'>
        <h1 className='text-3xl font-bold'>Blood Bank Management</h1>
        <div>
        <Link href={"/profile"}><img src="/defaultProfile.png" className='rounded-full w-10 h-10 border-2' alt="Profile" /></Link>
        </div>
        </div>
    </div>
  )
}

export default Navbar