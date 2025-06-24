"use client"
import Form from "@/components/form";
import { Suspense } from 'react';


const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Form type={"login"} />
      </Suspense>
    </div>
  );
};

export default Page;
