
// import React, { useEffect, useState } from 'react'
// import { useSession,signOut } from 'next-auth/react';
// import {Heart,House,Droplet,Syringe,Package,Calendar,LogOut, History, Users,BarChart2 } from "lucide-react";
// import "@/styles/sidebar.css"
// import { useRouter } from 'next/navigation';

// const Sidebar = () => {
// const [selectedSidebarOption,setSelectedSidebarOption]=useState<string>();
//   const {data:session}=useSession();
// const router=useRouter();
// const handleSidebarSelect=(option:string,role:string)=>{
//   if(!option&&!role) return console.log("error no option and role passed for handle side bar");
//  if(role==="blood_bank"){
//   if(option==="overview"){
//     setSelectedSidebarOption(option);
//     router.push(`/dashboard`);
//    }else{
//     setSelectedSidebarOption(option);
//     router.push(`/dashboard/${option}`);
//    }
//  }else if(role==="donor"){
//   if(option==="overview"){
//     setSelectedSidebarOption(option);
//     router.push(`/dashboard`);
//    }else{
//     setSelectedSidebarOption(option);
//     router.push(`/dashboard/${option}`);
//    }
//  }
 
// }

// const handleSignOut = () => {
//     signOut({ callbackUrl: "/" });
// };
//   useEffect(()=>{
//     if (!session?.user?.role) return;
//     if(session?.user.role==="blood_bank"&&!selectedSidebarOption){
//       setSelectedSidebarOption("overview");
//       router.push("/dashboard");
//     }else if(session?.user.role==="donor"&&!selectedSidebarOption){
//       setSelectedSidebarOption("find-donors");
//       router.push("/dashboard/find-donors");
//     }
//   },[session])




//   return (
//     <div className={`h-screen flex flex-col border-r-2 border-gray-300 text-2xl pt-24 px-2 fixed z-0`}>
//       {/* blood_bank */}
//      {
//       session?.user.role==="blood_bank"&&(
//         <>
//          <div className={`sidebarOptionContainer ${selectedSidebarOption==="overview" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("overview","blood_bank")} >
//         <div>
//         <House className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Overview
//         </div>
//       </div>
      
//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-stock" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-stock","blood_bank")}>
//         <div>
//         <Heart className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Blood Stock
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-donation" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-donation","blood_bank")}>
//         <div>
//         <Syringe className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Blood Donation
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood_bank-request" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood_bank-request","blood_bank")}>
//         <div>
//         <Droplet className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Blood Requests
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-supply" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-supply","blood_bank")}>
//         <div>
//         <Package className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Blood Supply
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="event" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("event","blood_bank")}>
//         <div>
//         <Calendar className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Event
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer notSelected`} onClick={handleSignOut}>
//         <div>
//         <LogOut className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         SignOut
//         </div>
//       </div>

//         </>
//       )
//      }

// {/* Donor */}
// {
//       session?.user.role==="donor"&&(
//         <>
// <div className={`sidebarOptionContainer ${selectedSidebarOption==="find-donors" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("find-donors","donor")}>
//         <div>
//         <Users className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Find Donors
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="blood-request" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("blood-request","donor")}>
//         <div>
//         <Droplet className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Blood Request
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="donation-schedule" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("donation-schedule","donor")} >
//         <div>
//         <Calendar className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Donation Schedule
//         </div>
//       </div>
      
//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="donation-history" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("donation-history","donor")}>
//         <div>
//         <History className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Donation History
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer ${selectedSidebarOption==="leaderboard" ? "selected" : "notSelected"}`} onClick={()=>handleSidebarSelect("leaderboard","donor")}>
//         <div>
//         <BarChart2 className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         Leaderboard
//         </div>
//       </div>

//       <div className={`sidebarOptionContainer notSelected`} onClick={handleSignOut}>
//         <div>
//         <LogOut className='sidebarIcons'/>
//         </div>
//         <div className='sidebar'>
//         SignOut
//         </div>
//       </div>

//         </>
//       )
//      }

//     </div>
//   )
// }

// export default Sidebar

"use client"

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Heart, Home, Droplet, Syringe, Package, Calendar, LogOut, History, Users, BarChart2, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Sidebar = () => {
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>()
  const { data: session } = useSession()
  const router = useRouter()

  const handleSidebarSelect = (option: string, role: string) => {
    if (!option && !role) return console.log("error no option and role passed for handle side bar")
    if (role === "blood_bank") {
      if (option === "overview") {
        setSelectedSidebarOption(option)
        router.push(`/dashboard`)
      } else {
        setSelectedSidebarOption(option)
        router.push(`/dashboard/${option}`)
      }
    } else if (role === "donor") {
      if (option === "overview") {
        setSelectedSidebarOption(option)
        router.push(`/dashboard`)
      } else {
        setSelectedSidebarOption(option)
        router.push(`/dashboard/${option}`)
      }
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  useEffect(() => {
    if (!session?.user?.role) return
    if (session?.user.role === "blood_bank" && !selectedSidebarOption) {
      setSelectedSidebarOption("overview")
      router.push("/dashboard")
    } else if (session?.user.role === "donor" && !selectedSidebarOption) {
      setSelectedSidebarOption("find-donors")
      router.push("/dashboard/find-donors")
    }
  }, [session, selectedSidebarOption, router])

  return (
    <div className="fixed z-10 flex h-screen w-64 flex-col border-r border-gray-200 bg-white pt-20 shadow-sm transition-all">
      <div className="mb-6 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Droplet className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {session?.user.role === "blood_bank" ? "Blood Bank" : "Donor Portal"}
            </h2>
            <p className="text-xs text-gray-500">{session?.user.name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {/* Blood Bank Navigation */}
        {session?.user.role === "blood_bank" && (
          <>
            <SidebarItem
              icon={<Home size={20} />}
              label="Overview"
              isSelected={selectedSidebarOption === "overview"}
              onClick={() => handleSidebarSelect("overview", "blood_bank")}
            />
            <SidebarItem
              icon={<Heart size={20} />}
              label="Blood Stock"
              isSelected={selectedSidebarOption === "blood-stock"}
              onClick={() => handleSidebarSelect("blood-stock", "blood_bank")}
            />
            <SidebarItem
              icon={<Syringe size={20} />}
              label="Blood Donation"
              isSelected={selectedSidebarOption === "blood-donation"}
              onClick={() => handleSidebarSelect("blood-donation", "blood_bank")}
            />
            <SidebarItem
              icon={<Droplet size={20} />}
              label="Blood Requests"
              isSelected={selectedSidebarOption === "blood_bank-request"}
              onClick={() => handleSidebarSelect("blood_bank-request", "blood_bank")}
            />
            <SidebarItem
              icon={<Package size={20} />}
              label="Donation Schedule"
              isSelected={selectedSidebarOption === "blood_bank-donation_schedule"}
              onClick={() => handleSidebarSelect("blood_bank-donation_schedule", "blood_bank")}
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Event"
              isSelected={selectedSidebarOption === "event"}
              onClick={() => handleSidebarSelect("event", "blood_bank")}
            />
          </>
        )}

        {/* Donor Navigation */}
        {session?.user.role === "donor" && (
          <>
            <SidebarItem
              icon={<Users size={20} />}
              label="Find Donors"
              isSelected={selectedSidebarOption === "find-donors"}
              onClick={() => handleSidebarSelect("find-donors", "donor")}
            />
            <SidebarItem
              icon={<Droplet size={20} />}
              label="Blood Request"
              isSelected={selectedSidebarOption === "blood-request"}
              onClick={() => handleSidebarSelect("blood-request", "donor")}
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Donation Schedule"
              isSelected={selectedSidebarOption === "donation-schedule"}
              onClick={() => handleSidebarSelect("donation-schedule", "donor")}
            />
            <SidebarItem
              icon={<History size={20} />}
              label="Donation History"
              isSelected={selectedSidebarOption === "donation-history"}
              onClick={() => handleSidebarSelect("donation-history", "donor")}
            />
            <SidebarItem
              icon={<BarChart2 size={20} />}
              label="Leaderboard"
              isSelected={selectedSidebarOption === "leaderboard"}
              onClick={() => handleSidebarSelect("leaderboard", "donor")}
            />
          </>
        )}
      </div>

      {/* Bottom section with stats and sign out */}
      <div className="mt-auto border-t border-gray-200 p-3">
        {/* <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Blood Availability</span>
            <span className="text-xs font-medium text-green-600">85%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Updated 2h ago</span>
            <span className="flex items-center">
              <Activity size={12} className="mr-1" />
              Active
            </span>
          </div>
        </div> */}

        <SidebarItem
          icon={<LogOut size={20} />}
          label="Sign Out"
          onClick={handleSignOut}
          className="text-gray-700 hover:bg-red-50 hover:text-red-600"
        />
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isSelected?: boolean
  onClick: () => void
  className?: string
}

const SidebarItem = ({ icon, label, isSelected, onClick, className }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
        isSelected
          ? "bg-red-50 text-red-600"
          : className || "text-gray-700 hover:bg-gray-100"
      } ${className || ""}`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center ${
          isSelected ? "text-red-600" : "text-gray-500 group-hover:text-gray-700"
        }`}
      >
        {icon}
      </div>
      <span>{label}</span>
      {isSelected && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-red-600"></div>
      )}
    </button>
  )
}

export default Sidebar
