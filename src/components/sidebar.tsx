"use client";
import React from 'react'
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {House,Droplet,Syringe,Package,Calendar } from "lucide-react";
import "@/styles/dashboard.css"


const Sidebar = () => {
  const pathname=usePathname();
  const dashboardPath=["/"];
  const {data:session}=useSession();
  return (
    <div className={`${dashboardPath.includes(pathname)?"":"hidden"} h-screen flex flex-col border-r-2 border-gray-300 text-2xl`}>
      {/* blood_bank */}
     {
      session?.user.role==="blood_bank"&&(
        <>
         <div className='sidebarOptionContainer'>
        <div>
        <House className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Dashboard
        </div>
      </div>
      
      <div className='sidebarOptionContainer'>
        <div>
        <Droplet className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Stock
        </div>
      </div>

      <div className='sidebarOptionContainer'>
        <div>
        <Syringe className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Donation
        </div>
      </div>

      <div className='sidebarOptionContainer'>
        <div>
        <Package className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Supply
        </div>
      </div>

      <div className='sidebarOptionContainer'>
        <div>
        <Calendar className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Event
        </div>
      </div>
        </>
      )
     }

{/* Donor */}
{
      session?.user.role==="donor"&&(
        <>
         <div className='sidebarOptionContainer'>
        <div>
        <House className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Dashboard Donor
        </div>
      </div>
      
      <div className='sidebarOptionContainer'>
        <div>
        <Droplet className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Stock
        </div>
      </div>

      <div className='sidebarOptionContainer'>
        <div>
        <Syringe className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Donation
        </div>
      </div>

      <div className='sidebarOptionContainer'>
        <div>
        <Package className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Supply
        </div>
      </div>

      <div className='sidebarOptionContainer'>
        <div>
        <Calendar className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Event
        </div>
      </div>
        </>
      )
     }

    </div>
  )
}

export default Sidebar