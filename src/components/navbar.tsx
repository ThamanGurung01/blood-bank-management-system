// "use client"
// import React from 'react'
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// const Navbar = () => {
//   return (
//     <div className="bg-white fixed left-0 top-0 w-full z-24">
//         <div className='w-full flex justify-between px-10 py-6 border-b-2 border-gray-300'>
//         <h1 className='text-3xl font-bold'>Blood Bank Management</h1>
//         <div>
//         <Link href={"/profile"}><img src="/blood.png" className='rounded-full w-10 h-10 border-2' alt="Profile" /></Link>
//         </div>
//         </div>
//     </div>
//   )
// }

// export default Navbar

"use client";

import { useState } from "react";
// import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, ChevronDown, Search, Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // const pathname = usePathname();

  // Get page title based on pathname
  // const getPageTitle = () => {
  //   if (pathname === "/dashboard") return "Dashboard Overview";

  //   const path = pathname.split("/").pop();
  //   if (!path) return "Dashboard";

  //   // Convert kebab-case to Title Case
  //   return path
  //     .split("-")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // };

  return (
    <div className="fixed left-0 top-0 z-20 w-full bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 md:px-6">
        <div className="flex items-center">
          <button
            className="mr-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center">
            <Image
              height={32}
              width={32}
              src="/blood.png"
              alt="Logo"
              className="mr-3 h-8 w-8"
            />
            <h1 className="hidden text-xl font-bold text-gray-800 md:block">
              BloodLink
            </h1>
          </div>
        </div>

        {/* <div className="mx-4 hidden flex-1 md:block">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div> */}

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-red-600 hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <NotificationItem
                    title="Low Blood Stock Alert"
                    message="O- blood type is running low. Current stock: 3 units."
                    time="2 hours ago"
                    isUnread
                  />
                  <NotificationItem
                    title="New Blood Request"
                    message="Memorial Hospital requested 2 units of A+ blood."
                    time="5 hours ago"
                  />
                  <NotificationItem
                    title="Donation Reminder"
                    message="You're eligible to donate blood again in 3 days."
                    time="1 day ago"
                  />
                </div>
                <div className="mt-2 border-t border-gray-100 pt-2 text-center">
                  <button className="text-sm text-red-600 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 border-l border-gray-300"></div>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
          >
            <div className="relative">
              <Image
                width={32}
                height={32}
                src={session?.user?.image || "/defaultProfile.png"}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-gray-200 object-cover"
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {session?.user?.role || "Guest"}
              </p>
            </div>
            <ChevronDown size={16} className="hidden text-gray-400 md:block" />
          </Link>
        </div>
      </div>

      {/* Page title bar */}
      {/* <div className="flex h-12 items-center border-b border-gray-200 bg-gray-50 px-4 md:px-6">
        <h2 className="text-lg font-medium text-gray-800">{getPageTitle()}</h2>
        <div className="ml-auto text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div> */}
    </div>
  );
};

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  isUnread?: boolean;
}

const NotificationItem = ({
  title,
  message,
  time,
  isUnread,
}: NotificationItemProps) => {
  return (
    <div
      className={`mb-2 rounded-lg p-2 ${
        isUnread ? "bg-red-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start">
        <div
          className={`mt-0.5 h-2 w-2 rounded-full ${
            isUnread ? "bg-red-500" : "bg-transparent"
          }`}
        ></div>
        <div className="ml-2 flex-1">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-600">{message}</p>
          <p className="mt-1 text-xs text-gray-400">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
