"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MoveLeft, AlertCircle, Droplet, Activity, TrendingDown, TrendingUp, RefreshCw } from "lucide-react"
import { getBloodStock } from "@/actions/bloodDonationActions"

type BloodProduct = {
  type: string
  units: number
  threshold: number
}

export default function BloodStockPage() {
  const params = useSearchParams()
  const router = useRouter()
  const bloodType = params.get("bloodType")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [bloodStock, setBloodStock] = useState<BloodProduct[]>([
    { type: "Whole Blood", units: 0, threshold: 30 },
    { type: "RBC", units: 0, threshold: 100 },
    { type: "Platelets", units: 0, threshold: 25 },
    { type: "Plasma", units: 0, threshold: 80 },
    { type: "Cryoprecipitate", units: 0, threshold: 15 },
  ])

  const getStatus = (units: number, threshold: number) => {
    if (units <= threshold * 0.5) return "Critical"
    if (units <= threshold * 0.75) return "Low"
    return "Normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-600"
      case "Low":
        return "bg-yellow-500"
      case "Normal":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-100"
      case "Low":
        return "bg-yellow-100"
      case "Normal":
        return "bg-green-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-red-800"
      case "Low":
        return "text-yellow-800"
      case "Normal":
        return "text-green-800"
      default:
        return "text-gray-800"
    }
  }

  const fetchBloodStock = async () => {
    setIsRefreshing(true)
    if (bloodType) {
      try {
        const bloodStockData = await getBloodStock(bloodType)
        if (!bloodStockData?.success)
          return setBloodStock([
            { type: "Whole Blood", units: 0, threshold: 30 },
            { type: "RBC", units: 0, threshold: 100 },
            { type: "Platelets", units: 0, threshold: 25 },
            { type: "Plasma", units: 0, threshold: 80 },
            { type: "Cryoprecipitate", units: 0, threshold: 15 },
          ])
        if (Array.isArray(bloodStockData?.message)) {
          setBloodStock(bloodStockData.message)
        } else {
          setBloodStock([])
        }
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching blood stock:", error)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    } else {
      router.push("/dashboard/blood-stock")
    }
  }

  useEffect(() => {
    fetchBloodStock()
    const interval = setInterval(fetchBloodStock, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [bloodType])

  // Calculate overall status
  const overallStatus = bloodStock.reduce((worst, item) => {
    const status = getStatus(item.units, item.threshold)
    if (status === "Critical") return "Critical"
    if (status === "Low" && worst !== "Critical") return "Low"
    return worst
  }, "Normal")

  // Calculate total units and threshold
  const totalUnits = bloodStock.reduce((sum, item) => sum + item.units, 0)
  const totalThreshold = bloodStock.reduce((sum, item) => sum + item.threshold, 0)
  const stockPercentage = Math.round((totalUnits / totalThreshold) * 100)

  // Blood type compatibility data
  const compatibility: Record<string, { canDonateTo: string[]; canReceiveFrom: string[] }> = {
    "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
    "A-": { canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
    "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
    "B-": { canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
    "AB+": { canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    "AB-": { canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"] },
    "O+": { canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
    "O-": { canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"] },
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading blood stock information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/blood-stock")}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <MoveLeft className="h-4 w-4" />
            Back to Blood Types
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Blood Type: <span className="text-red-600">{bloodType}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBloodStock}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Stock"}
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Overall Status</h2>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBgColor(
                overallStatus,
              )} ${getStatusTextColor(overallStatus)}`}
            >
              {overallStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusBgColor(overallStatus)}`}
            >
              <Activity className={`h-6 w-6 ${getStatusTextColor(overallStatus)}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stockPercentage}%</p>
              <p className="text-sm text-gray-500">of threshold</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full ${getStatusColor(overallStatus)}`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()} on {lastUpdated.toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-sm font-medium text-gray-500">Can Donate To</h2>
          <div className="flex flex-wrap gap-2">
            {bloodType &&
              compatibility[bloodType]?.canDonateTo.map((type) => (
                <div key={type} className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-green-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <Droplet className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{type}</p>
                    <p className="text-xs">Blood Type</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>
              {bloodType && compatibility[bloodType]?.canDonateTo.length === 1
                ? "Limited donation compatibility"
                : bloodType && compatibility[bloodType]?.canDonateTo.length > 4
                  ? "Universal donor"
                  : "Standard donation compatibility"}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-sm font-medium text-gray-500">Can Receive From</h2>
          <div className="flex flex-wrap gap-2">
            {bloodType &&
              compatibility[bloodType]?.canReceiveFrom.map((type) => (
                <div key={type} className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-blue-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <Droplet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{type}</p>
                    <p className="text-xs">Blood Type</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <TrendingDown className="h-4 w-4 text-blue-600" />
            <span>
              {bloodType && compatibility[bloodType]?.canReceiveFrom.length === 1
                ? "Can only receive same type"
                : bloodType && compatibility[bloodType]?.canReceiveFrom.length > 4
                  ? "Universal recipient"
                  : "Standard receiving compatibility"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-md">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">Component Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Blood Product
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Available Units
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Threshold
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bloodStock.map((item, index) => {
                const status = getStatus(item.units, item.threshold)
                const percentage = Math.round((item.units / item.threshold) * 100)

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${getStatusBgColor(
                            status,
                          )}`}
                        >
                          <Droplet className={`h-4 w-4 ${getStatusTextColor(status)}`} />
                        </div>
                        <span className="ml-3 font-medium text-gray-900">{item.type}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <span className="text-xl font-bold text-gray-900">{item.units}</span>
                      <span className="ml-1 text-sm text-gray-500">units</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-gray-500">{item.threshold}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBgColor(
                          status,
                        )} ${getStatusTextColor(status)}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full ${getStatusColor(status)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Legend */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Status Legend</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <div className="h-5 w-5 rounded-full bg-green-500"></div>
            </div>
            <div>
              <p className="font-medium text-green-800">Normal</p>
              <p className="text-sm text-green-600">Above 75% of threshold</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
            </div>
            <div>
              <p className="font-medium text-yellow-800">Low</p>
              <p className="text-sm text-yellow-600">Between 50-75% of threshold</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <div className="h-5 w-5 rounded-full bg-red-600"></div>
            </div>
            <div>
              <p className="font-medium text-red-800">Critical</p>
              <p className="text-sm text-red-600">Below 50% of threshold</p>
            </div>
          </div>
        </div>

        {overallStatus === "Critical" && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Critical Stock Alert</h3>
              <p className="mt-1 text-sm text-red-700">
                Some components of {bloodType} blood type are critically low. Consider organizing a donation drive or
                requesting transfers from other blood banks.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                  Request Transfer
                </button>
                <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                  Schedule Donation Drive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
