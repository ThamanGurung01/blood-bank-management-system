import React from 'react'
import Sidebar from '@/components/sidebar'
const dashboardLayout = ({children}: Readonly<{children: React.ReactNode;}>) => {
  return (
    <div className='flex flex-col'>
      <Sidebar/>
      <div>
      {children}
      </div>
    </div>
  )
}

export default dashboardLayout