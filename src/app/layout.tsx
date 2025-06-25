"use client"
import "@/styles/globals.css";
import Head from "../components/head";
import AuthProvider from "./context/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <Head/>
      </head>
      <body className="bg-gray-100">
      <AuthProvider> {children}</AuthProvider>
      <ToastContainer />
      </body>
    </html>
  );
}
