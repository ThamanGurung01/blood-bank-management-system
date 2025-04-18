"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function BloodTypeSelector() {
  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [selectedType, setSelectedType] = useState(null);
const router=useRouter();
  const handleClick = (bloodType: any) => {
    setSelectedType(bloodType);
    console.log(`Selected blood type: ${bloodType}`);
    router.push(`/dashboard/blood-stock/stock?bloodType=${encodeURIComponent(bloodType)}`);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-16 initialPage">
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-24">
          {bloodTypes.map((type) => (
            <div
              key={type}
              onClick={() => handleClick(type)}
              className={`
                flex items-center justify-center
                w-52 h-52 rounded-full
                cursor-pointer transition-all duration-300
                text-4xl font-bold select-none
                ${selectedType === type 
                  ? 'bg-red-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'}
              `}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 p-6 bg-gray-100 rounded-md text-center">
        {selectedType ? (
          <p className="text-xl">Selected blood type: <span className="font-bold">{selectedType}</span></p>
        ) : (
          <p className="text-xl text-gray-500">Please select a blood type</p>
        )}
      </div>
    </div>
  );
}
