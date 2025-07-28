"use client"
import BloodStockPage from '@/components/BloodStockPage'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BloodStockPage />
      </Suspense>
    </div>
  )
}

export default Page