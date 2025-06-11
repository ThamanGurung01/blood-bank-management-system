"use client"
import React, { useEffect, useState } from 'react'
import { getAdminMetrics } from '@/actions/getAdminMetrics';
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation';
import { Building } from 'lucide-react';
import { getLatestBloodBank } from '@/actions/bloodBankActions';
import { IBlood_Bank } from '@/models/blood_bank.models';
import { getTodayNewDonors } from '@/actions/donorActions';
const page = () => {
  interface MetricsType {
    title: string;
    value: string;
    description: string;
    icon: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
  interface Blood_Bank extends IBlood_Bank {
    createdAt: Date;
  }

  const [metrics, setMetrics] = useState<MetricsType[]>([]);
  const [verifiedBloodBank, setVerifiedBloodBank] = useState<Blood_Bank>({} as Blood_Bank);
  const [unverifiedBloodBank, setUnverifiedBloodBank] = useState<Blood_Bank>({} as Blood_Bank);
  const [newDonor, setNewDonor] = useState<{
    count: number;
    createdAt: Date;
  }>();
  const router = useRouter();
  const fetchMetrics = async () => {
    const metricsData = await getAdminMetrics();
    if (metricsData.success) setMetrics(metricsData.data ?? []);

    const newVerifiedBloodBankData = await getLatestBloodBank("verified");
    setVerifiedBloodBank((newVerifiedBloodBankData.data ?? {}) as Blood_Bank);
    const newUnverifiedBloodBankData = await getLatestBloodBank("unverified");
    setUnverifiedBloodBank(newUnverifiedBloodBankData.data ?? {});
    const newDonors = await getTodayNewDonors();
    console.log(newDonors.data);
    setNewDonor(newDonors.data);
  }
  useEffect(() => {
    fetchMetrics();
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Overview
          </h1>
          <p className="text-gray-600">
            Monitor and manage your blood donation system
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{metric.icon}</div>
                <div className={`${metric.textColor} text-sm font-medium px-2 py-1 rounded-full bg-white/50`}>
                  Active
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {metric.title}
                </h3>
                <div className={`text-3xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </div>
                <p className="text-sm text-gray-600">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => router.push("dashboard/list-donors")}
              className="flex-1 flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-left">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <div className="font-medium text-gray-900">Manage Donors</div>
                <div className="text-sm text-gray-600">View and edit donor profiles</div>
              </div>
            </button>

            <button
              onClick={() => router.push("dashboard/list-blood_banks")}
              className="flex-1 flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200 text-left">
              <div className="text-2xl mr-3"><Building /></div>
              <div>
                <div className="font-medium text-gray-900">Manage Blood Banks</div>
                <div className="text-sm text-gray-600">View and edit donor profiles</div>
              </div>
            </button>

            <button
              onClick={() => router.push("dashboard/verify-blood_banks")}
              className="flex-1 flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200 text-left">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="font-medium text-gray-900">Verify Blood Banks</div>
                <div className="text-sm text-gray-600">Review pending applications</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {verifiedBloodBank.createdAt && (
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    New blood bank registered
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="text-sm text-gray-500">
                      {verifiedBloodBank.blood_bank} - {formatDistanceToNow(new Date(verifiedBloodBank?.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {newDonor && newDonor.createdAt && (<div className="flex items-center p-3 rounded-lg bg-gray-50">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {newDonor?.count} new donor{newDonor?.count>1?"s":""} registered
                </div>
                <div className="text-xs text-gray-600">{formatDistanceToNow(new Date(newDonor?.createdAt), { addSuffix: true })}</div>
              </div>
            </div>)}

            {unverifiedBloodBank.createdAt && (
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Blood bank verification pending
                  </div>
                  <div className="text-xs text-gray-600">{unverifiedBloodBank.blood_bank} - {formatDistanceToNow(new Date(unverifiedBloodBank?.createdAt), { addSuffix: true })}</div>
                </div>
              </div>
            )
            }
            {!verifiedBloodBank?.createdAt && !unverifiedBloodBank?.createdAt && !newDonor?.createdAt && (
              <div className="text-sm text-gray-500 text-center py-6">
                No recent activities to show.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page