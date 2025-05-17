
import React, { useEffect, useState } from 'react'
import { useSession,signOut } from 'next-auth/react';
import {Heart,House,Droplet,Syringe,Package,Calendar,LogOut, History, Users,BarChart2 } from "lucide-react";
import "@/styles/sidebar.css"
import { useRouter } from 'next/navigation';

const Sidebar = () => {
const [selectedSidebarOption,setSelectedSidebarOption]=useState<string>();
  const {data:session}=useSession();
const router=useRouter();
const handleSidebarSelect=(option:string,role:string)=>{
  if(!option&&!role) return console.log("error no option and role passed for handle side bar");
 if(role==="blood_bank"){
  if(option==="overview"){
    setSelectedSidebarOption(option);
    router.push(`/dashboard`);
   }else{
    setSelectedSidebarOption(option);
    router.push(`/dashboard/${option}`);
   }
 }else if(role==="donor"){
  if(option==="overview"){
    setSelectedSidebarOption(option);
    router.push(`/dashboard`);
   }else{
    setSelectedSidebarOption(option);
    router.push(`/dashboard/${option}`);
   }
 }
 
}

const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
};
  useEffect(()=>{
    if (!session?.user?.role) return;
    if(session?.user.role==="blood_bank"&&!selectedSidebarOption){
      setSelectedSidebarOption("overview");
      router.push("/dashboard");
    }else if(session?.user.role==="donor"&&!selectedSidebarOption){
      setSelectedSidebarOption("find-donors");
      router.push("/dashboard/find-donors");
    }
  },[session])




  return (
    <div className={`h-screen flex flex-col border-r-2 border-gray-300 text-2xl pt-24 px-2 fixed z-0`}>
      {/* blood_bank */}
     {
      session?.user.role==="blood_bank"&&(
        <>
         <div className={`sidebarOptionContainer ${selectedSidebarOption==="overview" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("overview","blood_bank")} >
        <div>
        <House className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Overview
        </div>
      </div>
      
      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-stock" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-stock","blood_bank")}>
        <div>
        <Heart className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Stock
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-donation" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-donation","blood_bank")}>
        <div>
        <Syringe className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Donation
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood_bank-request" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood_bank-request","blood_bank")}>
        <div>
        <Droplet className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Requests
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-supply" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-supply","blood_bank")}>
        <div>
        <Package className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Supply
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="event" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("event","blood_bank")}>
        <div>
        <Calendar className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Event
        </div>
      </div>

      <div className={`sidebarOptionContainer notSelected`} onClick={handleSignOut}>
        <div>
        <LogOut className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        SignOut
        </div>
      </div>

        </>
      )
     }

{/* Donor */}
{
      session?.user.role==="donor"&&(
        <>
<div className={`sidebarOptionContainer ${selectedSidebarOption==="find-donors" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("find-donors","donor")}>
        <div>
        <Users className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Find Donors
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-request" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-request","donor")}>
        <div>
        <Droplet className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Blood Request
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="donation-schedule" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("donation-schedule","donor")} >
        <div>
        <Calendar className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Donation Schedule
        </div>
      </div>
      
      <div className={`sidebarOptionContainer ${selectedSidebarOption==="donation-history" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("donation-history","donor")}>
        <div>
        <History className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Donation History
        </div>
      </div>

      <div className={`sidebarOptionContainer ${selectedSidebarOption==="leaderboard" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("leaderboard","donor")}>
        <div>
        <BarChart2 className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        Leaderboard
        </div>
      </div>

      <div className={`sidebarOptionContainer notSelected`} onClick={handleSignOut}>
        <div>
        <LogOut className='sidebarIcons'/>
        </div>
        <div className='sidebar'>
        SignOut
        </div>
      </div>

        </>
      )
     }

    </div>
  )
}

export default Sidebar