import type { Metadata } from "next";
import AuthProvider from "./context/AuthProvider";
import "./styles/globals.css";
import Sidebar from "@/components/sidebar";
export const metadata: Metadata = {
  title: "Blood Bank Management System",
  description: "Blood Bank Management System is a web application that helps manage blood bank operations , manage donor and donation history .",
  icons:"/blood.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Sidebar/>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
