"use client"
import React from 'react'
import { MoveLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getBloodStock } from '@/actions/bloodDonationActions';
import { useSearchParams,useRouter } from 'next/navigation';
type BloodProduct = {
  type: string;
  units: number;
  threshold: number;
};
const page = () => {
  const params=useSearchParams();
  const router=useRouter();
const bloodType=params.get("bloodType");
  const [bloodStock, setBloodStock] = useState<BloodProduct[]>([
    { type: 'Whole Blood', units: 0, threshold: 30 },
    { type: 'RBC', units: 0, threshold: 100 },
    { type: 'Platelets', units: 0, threshold: 25 },
    { type: 'Plasma', units: 0, threshold: 80 },
    { type: 'Cryoprecipitate', units: 0, threshold: 15 }
  ]);

  const getStatus = (units:any, threshold:any) => {
    if (units <= threshold * 0.5) return 'Critical';
    if (units <= threshold * 0.75) return 'Low';
    return 'Normal';
  };

  const getStatusColor = (status:any) => {
    switch (status) {
      case 'Critical': return 'bg-red-600';
      case 'Low': return 'bg-yellow-500';
      case 'Normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const fetchBloodStock = async () => {
   if(bloodType){
    const bloodStockData= await getBloodStock(bloodType);
   if(!bloodStockData?.success) return setBloodStock([
    { type: 'Whole Blood', units: 0, threshold: 30 },
    { type: 'RBC', units: 0, threshold: 100 },
    { type: 'Platelets', units: 0, threshold: 25 },
    { type: 'Plasma', units: 0, threshold: 80 },
    { type: 'Cryoprecipitate', units: 0, threshold: 15 }]);
   if (Array.isArray(bloodStockData?.message)) {
     setBloodStock(bloodStockData.message);
   } else {
     setBloodStock([]);
   }
   }else{
    router.push("/dashboard/blood-stock");
   }
  };

  useEffect(() => {
    fetchBloodStock();
    const interval = setInterval(fetchBloodStock, 300000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-gray-100 initialPage">
      <Head>
        <title>Blood Stock Overview</title>
        <meta name="description" content="Current blood stock availability" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container px-4 py-8 ml-60 mt-44">
 <div className='flex mb-4'>
 <button onClick={()=>router.push("/dashboard/blood-stock")} className='flex justify-between border-2 border-gray-600 w-32 rounded-2xl px-5 py-2 cursor-pointer font-bold text-xl hover:text-white hover:bg-black transition-all duration-500'><MoveLeft className='mt-1'/>Back</button>
 <h1 className="text-3xl font-bold text-center ml-64"> Blood Stock: {bloodType}</h1>
 </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-200 font-semibold">
            <div className="col-span-4 p-4">Blood Product</div>
            <div className="col-span-3 p-4 text-center">Available Units</div>
            <div className="col-span-3 p-4 text-center">Status</div>
            <div className="col-span-2 p-4 text-center">Threshold</div>
          </div>
          
          {bloodStock.map((item, index) => {
            const status = getStatus(item.units, item.threshold);
            const statusColor = getStatusColor(status);
            
            return (
              <div 
                key={index} 
                className={`grid grid-cols-12 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b`}
              >
                <div className="col-span-4 p-4 font-medium">{item.type}</div>
                <div className="col-span-3 p-4 text-center font-bold text-xl">{item.units}</div>
                <div className="col-span-3 p-4 flex justify-center items-center">
                  <span className={`${statusColor} text-white text-sm font-medium px-3 py-1 rounded-full`}>
                    {status}
                  </span>
                </div>
                <div className="col-span-2 p-4 text-center text-gray-600">{item.threshold}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Status Legend</h2>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Normal: Above 75% of threshold</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span>Low: 50-75% of threshold</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
              <span>Critical: Below 50% of threshold</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default page