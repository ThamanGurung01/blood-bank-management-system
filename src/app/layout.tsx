"use client"
import AuthProvider from "./context/AuthProvider";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";
import Head from "../components/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname=usePathname();
  const dashboardPath=["/"];
  return (
    <html lang="en">
      <head>
        <Head/>
      </head>
      <body className="overflow-hidden">
        <Navbar/>
      <div className={`${dashboardPath.includes(pathname)?"flex":""} `}>
      <AuthProvider>
      <Sidebar/>
      <main>
      {children}
      </main>
      </AuthProvider>
      </div>
      </body>
    </html>
  );
}
