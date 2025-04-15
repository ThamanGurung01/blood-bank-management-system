"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Head from 'next/head';
const page = () => {
  const [bloodStock, setBloodStock] = useState([
    { type: 'Whole Blood', units: 42, threshold: 30 },
    { type: 'RBC', units: 127, threshold: 100 },
    { type: 'Platelets', units: 36, threshold: 25 },
    { type: 'Plasma', units: 93, threshold: 80 },
    { type: 'Cryoprecipitate', units: 18, threshold: 15 }
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
  };

  useEffect(() => {
    fetchBloodStock();
    const interval = setInterval(fetchBloodStock, 300000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 initialPage">
      <Head>
        <title>Blood Stock Overview</title>
        <meta name="description" content="Current blood stock availability" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Blood Stock Overview</h1>
        
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

        <div className="mt-8 text-right">
          <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </main>
    </div>
  )
}

export default page