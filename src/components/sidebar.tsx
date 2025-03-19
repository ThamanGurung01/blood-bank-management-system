
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import {House,Droplet,Syringe,Package,Calendar } from "lucide-react";
import "@/styles/sidebar.css"
import { useRouter } from 'next/navigation';

const Sidebar = () => {
const [selectedSidebarOption,setSelectedSidebarOption]=useState<string>();
  const {data:session}=useSession();
const router=useRouter();
const handleSidebarSelect=(option:string)=>{
 if(!option) return console.log("error no option passed for handle side bar");
  if(option==="overview"){
    setSelectedSidebarOption(option);
    router.push(`/dashboard`);
   }else{
    setSelectedSidebarOption(option);
    router.push(`/dashboard/${option}`);
   }
 
}


  useEffect(()=>{
    if(session?.user.role==="blood_bank"){
      setSelectedSidebarOption("overview");
    }
  },[session])




  return (
    <div className={`h-screen flex flex-col border-r-2 border-gray-300 text-2xl pt-2 px-2`}>
      {/* blood_bank */}
     {
      session?.user.role==="blood_bank"&&(
        <>
         <div className={`sidebarOptionContainer ${selectedSidebarOption==="overview" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("overview")} >
        <div>
        <House className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Overview
        </div>
      </div>
      
      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-stock" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-stock")}>
        <div>
        <Droplet className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Stock
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-donation" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-donation")}>
        <div>
        <Syringe className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Donation
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-supply" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-supply")}>
        <div>
        <Package className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Supply
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="event" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("event")}>
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