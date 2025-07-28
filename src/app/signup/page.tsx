"use client"
import React from 'react'
import Form from '@/components/form';
import { Suspense } from 'react';
const Signup = () => {
  return (
    <div>
     <Suspense fallback={<div>Loading...</div>}>
        <Form type={"signup"}/>
      </Suspense>
    </div>
  )
}

export default Signup