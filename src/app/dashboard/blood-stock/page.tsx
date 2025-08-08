"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Droplet,
  Info,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function BloodTypeSelector() {
  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = (bloodType: string) => {
    setSelectedType(bloodType);
    router.push(
      `/dashboard/blood-stock/stock?bloodType=${encodeURIComponent(bloodType)}`
    );
  };

  // Blood type compatibility data
  const compatibility = {
    "A+": {
      canDonateTo: ["A+", "AB+"],
      canReceiveFrom: ["A+", "A-", "O+", "O-"],
    },
    "A-": {
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
      canReceiveFrom: ["A-", "O-"],
    },
    "B+": {
      canDonateTo: ["B+", "AB+"],
      canReceiveFrom: ["B+", "B-", "O+", "O-"],
    },
    "B-": {
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
      canReceiveFrom: ["B-", "O-"],
    },
    "AB+": {
      canDonateTo: ["AB+"],
      canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    "AB-": {
      canDonateTo: ["AB+", "AB-"],
      canReceiveFrom: ["A-", "B-", "AB-", "O-"],
    },
    "O+": {
      canDonateTo: ["A+", "B+", "AB+", "O+"],
      canReceiveFrom: ["O+", "O-"],
    },
    "O-": {
      canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      canReceiveFrom: ["O-"],
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Blood Stock Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Select a blood type to view detailed inventory
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Droplet className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center gap-2 text-gray-700">
          <Info className="h-5 w-5 text-blue-500" />
          <span className="font-medium">
            Select a blood type to view detailed stock information
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {bloodTypes.map((type) => (
            <div
              key={type}
              onClick={() => handleClick(type)}
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              className={`relative flex flex-col items-center justify-center rounded-xl p-6 transition-all duration-300 ${
                selectedType === type
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-800 shadow hover:bg-red-50 hover:shadow-md"
              }`}
            >
              <div
                className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                  selectedType === type ? "bg-red-500" : "bg-red-100"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    selectedType === type ? "text-white" : "text-red-600"
                  }`}
                >
                  {type}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  selectedType === type ? "text-white" : "text-gray-600"
                }`}
              >
                Blood Type
              </span>

              {/* Rarity indicator */}
              <div className="mt-3 flex items-center gap-1">
                {type.includes("-") ? (
                  <>
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        selectedType === type ? "text-white" : "text-amber-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        selectedType === type ? "text-white" : "text-amber-500"
                      }`}
                    >
                      Rare Type
                    </span>
                  </>
                ) : (
                  <>
                    <Info
                      className={`h-4 w-4 ${
                        selectedType === type ? "text-white" : "text-blue-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        selectedType === type ? "text-white" : "text-blue-500"
                      }`}
                    >
                      Common Type
                    </span>
                  </>
                )}
              </div>

              {/* Compatibility tooltip */}
              {hoveredType === type && (
                <div className="absolute -bottom-2 left-1/2 z-10 w-48 -translate-x-1/2 translate-y-full rounded-md bg-gray-800 p-3 text-xs text-white shadow-lg">
                  <div className="mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="font-medium text-green-400">
                      Can donate to:
                    </span>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {compatibility[
                      type as keyof typeof compatibility
                    ].canDonateTo.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-green-900 px-2 py-0.5 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mb-1 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-blue-400" />
                    <span className="font-medium text-blue-400">
                      Can receive from:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {compatibility[
                      type as keyof typeof compatibility
                    ].canReceiveFrom.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-blue-900 px-2 py-0.5 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-red-50 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Blood Type Compatibility Chart
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">Blood Type</th>
                <th className="px-6 py-3">Can Donate To</th>
                <th className="px-6 py-3">Can Receive From</th>
                <th className="px-6 py-3">Rarity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bloodTypes.map((type) => (
                <tr key={type} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <span className="text-sm font-bold text-red-600">
                          {type}
                        </span>
                      </div>
                      <span className="ml-3 font-medium">{type}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {compatibility[
                        type as keyof typeof compatibility
                      ].canDonateTo.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {compatibility[
                        type as keyof typeof compatibility
                      ].canReceiveFrom.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {type.includes("-") ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        Rare (7-15%)
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        Common (30-40%)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
