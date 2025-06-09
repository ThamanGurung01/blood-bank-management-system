"use client";

import type React from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { checkBloodBankVerification } from "@/actions/bloodBankActions";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const {data:session}=useSession();
    const [verified, setVerified] = useState(false);
    const checkBloodBank=async()=>{
        if(session?.user?.role==="blood_bank"){
          const checkVerification=await checkBloodBankVerification(session?.user?.id);  
          if(checkVerification)setVerified(true);
        }else{
            setVerified(false);
        }
    }
useEffect(() => {
  checkBloodBank();
}, [session]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {verified ? (
        <>
        <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar />
        <main className="p-6 pt-24">{children}</main>
      </div>
        </>
        ):(
          <div className="flex items-center justify-center h-screen w-full">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600">Your blood bank is not verified yet. Please contact the admin for verification.</p>
              <p>Contact: 9845781264</p>
              <p className="mb-10 ">Address: Bharatpur-11,Baseni</p>
              <Link href={"/profile"} className="text-blue-500">Check your profile</Link>
            </div>
          </div>
        )}
    </div>
  );
}
