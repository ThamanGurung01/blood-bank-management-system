"use client"
import Form from '@/components/form'
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });
const Page = () => {
  return (
    <div>
      <Form type={"Login"}/>
      <Map/>
    </div>
  )
}

export default Page