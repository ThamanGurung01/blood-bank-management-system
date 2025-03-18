"use client"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const {data:session,status}=useSession();
  const router=useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; 
  }
  return (
    <div>
      <h1>dashboardLayout</h1>
    </div>
  );
};

export default Page;
