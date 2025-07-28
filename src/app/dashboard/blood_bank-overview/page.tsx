"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Droplet, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const {data:_session,status}=useSession();
  const router=useRouter();

  const bloodStockData = [
    { bloodType: 'A+', units: 45, color: '#ef4444' },
    { bloodType: 'A-', units: 23, color: '#f97316' },
    { bloodType: 'B+', units: 38, color: '#eab308' },
    { bloodType: 'B-', units: 15, color: '#22c55e' },
    { bloodType: 'AB+', units: 12, color: '#3b82f6' },
    { bloodType: 'AB-', units: 8, color: '#8b5cf6' },
    { bloodType: 'O+', units: 52, color: '#ec4899' },
    { bloodType: 'O-', units: 19, color: '#14b8a6' }
  ];

  const donationTrends = [
    { date: '2024-05-01', donations: 12 },
    { date: '2024-05-02', donations: 19 },
    { date: '2024-05-03', donations: 8 },
    { date: '2024-05-04', donations: 15 },
    { date: '2024-05-05', donations: 22 },
    { date: '2024-05-06', donations: 18 },
    { date: '2024-05-07', donations: 25 },
  ];

  const recentDonations = [
    { id: 1, donor: 'John Smith', bloodType: 'O+', time: '2 hours ago' },
    { id: 2, donor: 'Sarah Johnson', bloodType: 'A-', time: '4 hours ago' },
    { id: 3, donor: 'Mike Davis', bloodType: 'B+', time: '6 hours ago' },
    { id: 4, donor: 'Emily Brown', bloodType: 'AB-', time: '8 hours ago' },
    { id: 5, donor: 'David Wilson', bloodType: 'O-', time: '12 hours ago' }
  ];

  const upcomingEvents = [
    { id: 1, event: 'Community Blood Drive', date: '2024-06-10', location: 'City Hospital', time: '9:00 AM' },
    { id: 2, event: 'School Donation Camp', date: '2024-06-15', location: 'Lincoln High School', time: '10:00 AM' },
    { id: 3, event: 'Corporate Drive', date: '2024-06-20', location: 'Tech Corp Office', time: '2:00 PM' }
  ];

  const criticalShortages = [
    { bloodType: 'O-', units: 8, threshold: 20 },
    { bloodType: 'AB-', units: 5, threshold: 15 },
    { bloodType: 'B-', units: 12, threshold: 25 }
  ];



  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; 
  }
  return (
<div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Droplet className="text-red-500" size={32} />
            Blood Bank Overview
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blood Units</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">212</p>
                <p className="text-sm text-green-600 mt-1">+5% from last week</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Droplet className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blood Donations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
                <p className="text-sm text-blue-600 mt-1">+7 this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Droplet className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                <p className="text-sm text-orange-600 mt-1">3 urgent</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                <p className="text-sm text-purple-600 mt-1">Next: June 10</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Blood Stock Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Stock by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodStockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="bloodType" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="units" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donation Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Donation Trends (Last 7 Days)</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="donations" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Droplet className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{donation.donor}</p>
                      <p className="text-xs text-gray-600">{donation.bloodType} • {donation.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-purple-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{event.event}</h4>
                  <span className="text-sm text-gray-500">{event.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                <p className="text-sm font-medium text-blue-600">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
