"use client"
import Form from "@/components/form";
import { Suspense } from 'react';
import Loading from "./Loading";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <Form type={"login"} />
      </Suspense>
    </div>
  );
};

export default Page;
