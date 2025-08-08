"use client"
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Droplet, Users, Calendar, AlertTriangle, Activity, Clock, TrendingUp } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDashboardStats } from '@/actions/dashboardActions';

// Color palette for charts
const CHART_COLORS: Record<string, string> = {
  'A+': '#ef4444',
  'A-': '#f97316',
  'B+': '#eab308',
  'B-': '#22c55e',
  'AB+': '#3b82f6',
  'AB-': '#8b5cf6',
  'O+': '#ec4899',
  'O-': '#14b8a6'
};

interface DashboardStats {
  totalBloodUnits: number;
  totalDonations: number;
  pendingRequests: number;
  upcomingRequests: number;
  bloodStockByType: Array<{
    bloodType: string;
    units: number;
  }>;
  donationTrends: Array<{
    date: string;
    count: number;
  }>;
  recentDonations: Array<{
    id: string;
    donorName: string;
    bloodType: string;
    units: number;
    date: Date | string;
  }>;
}

const DashboardPage = () => {
  const { data: session,status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalBloodUnits: 0,
    totalDonations: 0,
    pendingRequests: 0,
    upcomingRequests: 0,
    bloodStockByType: [],
    donationTrends: [],
    recentDonations: []
  });

  // Add default values for blood types that might be missing
  const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const bloodStockWithAllTypes = allBloodTypes.map(bloodType => {
    const existing = stats.bloodStockByType.find(item => item.bloodType === bloodType);
    return existing || { bloodType, units: 0 };
  });

  // Transform recent donations to ensure proper date handling
  const transformedRecentDonations = stats.recentDonations.map(donation => ({
    ...donation,
    date: new Date(donation.date)
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('An error occurred while loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

  if (status === "authenticated") {
    fetchDashboardData();
  } else if (status === "unauthenticated") {
    router.push("/");
  }
  }, [session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // const recentDonations = [
  //   { id: 1, donor: 'John Smith', bloodType: 'O+', time: '2 hours ago' },
  //   { id: 2, donor: 'Sarah Johnson', bloodType: 'A-', time: '4 hours ago' },
  //   { id: 3, donor: 'Mike Davis', bloodType: 'B+', time: '6 hours ago' },
  //   { id: 4, donor: 'Emily Brown', bloodType: 'AB-', time: '8 hours ago' },
  //   { id: 5, donor: 'David Wilson', bloodType: 'O-', time: '12 hours ago' }
  // ];

  // const upcomingEvents = [
  //   { id: 1, event: 'Community Blood Drive', date: '2024-06-10', location: 'City Hospital', time: '9:00 AM' },
  //   { id: 2, event: 'School Donation Camp', date: '2024-06-15', location: 'Lincoln High School', time: '10:00 AM' },
  //   { id: 3, event: 'Corporate Drive', date: '2024-06-20', location: 'Tech Corp Office', time: '2:00 PM' }
  // ];

  // const criticalShortages = [
  //   { bloodType: 'O-', units: 8, threshold: 20 },
  //   { bloodType: 'AB-', units: 5, threshold: 15 },
  //   { bloodType: 'B-', units: 12, threshold: 25 }
  // ];






//   return (
// <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto space-y-6">

//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <Droplet className="text-red-500" size={32} />
//             Blood Bank Overview
//           </h1>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Blood Units</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">212</p>
//                 <p className="text-sm text-green-600 mt-1">+5% from last week</p>
//               </div>
//               <div className="p-3 bg-red-100 rounded-full">
//                 <Droplet className="text-red-600" size={24} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Blood Donations</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
//                 <p className="text-sm text-blue-600 mt-1">+7 this week</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <Droplet className="text-blue-600" size={24} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Pending Requests</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
//                 <p className="text-sm text-orange-600 mt-1">3 urgent</p>
//               </div>
//               <div className="p-3 bg-orange-100 rounded-full">
//                 <Clock className="text-orange-600" size={24} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
//                 <p className="text-sm text-purple-600 mt-1">Next: June 10</p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-full">
//                 <Calendar className="text-purple-600" size={24} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Blood Stock Chart */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Stock by Type</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={bloodStockWithAllTypes}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                 <XAxis dataKey="bloodType" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#fff', 
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Bar dataKey="units" fill="#ef4444" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Donation Trends */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center gap-2 mb-4">
//               <TrendingUp className="text-green-600" size={20} />
//               <h3 className="text-lg font-semibold text-gray-900">Donation Trends (Last 7 Days)</h3>
//             </div>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={stats.donationTrends}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                   <XAxis 
//                     dataKey="date" 
//                     stroke="#6b7280"
//                     tickFormatter={(value: string | Date) => {
//                       const date = typeof value === 'string' ? new Date(value) : value;
//                       return date.toLocaleDateString('en-US', { 
//                         weekday: 'long', 
//                         year: 'numeric', 
//                         month: 'long', 
//                         day: 'numeric' 
//                       });
//                     }}
//                   />
//                   <YAxis stroke="#6b7280" />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: '#fff', 
//                       border: '1px solid #e5e7eb',
//                       borderRadius: '8px'
//                     }}
//                     labelFormatter={(value) => new Date(value).toLocaleDateString()}
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="count" 
//                     stroke="#3b82f6" 
//                     strokeWidth={3}
//                     dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
//                     activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Recent Donations */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
//             <div className="space-y-4">
//               {transformedRecentDonations.map((donation: any) => (
//                 <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//                       <Droplet className="text-red-600" size={16} />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm">{donation.donor}</p>
//                       <p className="text-xs text-gray-600">{donation.bloodType} • {donation.time}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Upcoming Events */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="flex items-center gap-2 mb-4">
//             <Calendar className="text-purple-600" size={20} />
//             <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
//           </div>
//           <div className="space-y-4">
//             {upcomingEvents.map((event) => (
//               <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                 <div className="flex justify-between items-start mb-2">
//                   <h4 className="font-medium text-gray-900">{event.event}</h4>
//                   <span className="text-sm text-gray-500">{event.time}</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-1">{event.location}</p>
//                 <p className="text-sm font-medium text-blue-600">
//                   {new Date(event.date).toLocaleDateString('en-US', { 
//                     weekday: 'long', 
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric' 
//                   })}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
//             View All Events
//           </button>
//         </div>
//       </div>
//     </div>
//   );

return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Blood Bank Dashboard</h1>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <Droplet size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Blood Units</p>
            <p className="text-2xl font-bold">{stats.totalBloodUnits}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Donations</p>
            <p className="text-2xl font-bold">{stats.totalDonations}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending Requests</p>
            <p className="text-2xl font-bold">{stats.pendingRequests}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Upcoming Requests</p>
            <p className="text-2xl font-bold">{stats.upcomingRequests}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Blood Stock by Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Droplet className="mr-2 text-red-500" size={20} />
          Blood Stock by Type
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bloodStockWithAllTypes}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bloodType" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="units" fill="#ef4444" name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donation Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="mr-2 text-blue-500" size={20} />
          Donation Trends (Last 7 Days)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.donationTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Donations"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Recent Donations */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Donations</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transformedRecentDonations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.donorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{
                      backgroundColor: `${CHART_COLORS[donation.bloodType] || '#999'}20`,
                      color: CHART_COLORS[donation.bloodType] || '#333'
                    }}
                  >
                    {donation.bloodType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.units} units</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(donation.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {transformedRecentDonations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No recent donations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};






export default DashboardPage;
