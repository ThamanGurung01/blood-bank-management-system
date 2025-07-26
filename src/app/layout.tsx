"use client";
import "@/styles/globals.css";
import Head from "../components/head";
import AuthProvider from "./context/AuthProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Head />
      </head>
      <body className="bg-gray-100">
        <AuthProvider> {children}</AuthProvider>
      </body>
    </html>
  );
}
