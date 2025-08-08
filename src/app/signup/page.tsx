"use client"
import React from 'react'
import Form from '@/components/form';
import { Suspense } from 'react';
import Loading from '../Loading';
const Signup = () => {
  return (
    <div>
     <Suspense fallback={<Loading/>}>
        <Form type={"signup"}/>
      </Suspense>
    </div>
  )
}

export default Signup