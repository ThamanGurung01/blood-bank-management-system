// 'use client';
// import { useState } from 'react';
// import { Trophy, Medal, ArrowUp, ArrowDown, Heart, Search, Filter, ChevronDown, Calendar, Droplet } from 'lucide-react';
// interface Donor {
//   donorId: string;
//   name: string;
//   blood_group: string;
//   totalDonations: number;
//   last_donation_date: string;
//   score: number;
//   rank: number;
//   profileImage: string;
// }

// const page = () => {
//   const [timeFilter, setTimeFilter] = useState<string>('allTime');
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   const [donors, setDonors] = useState<Donor[]>([
//     {
//       donorId: "1",
//       name: "Jennifer Thompson",
//       blood_group: "O+",
//       totalDonations: 28,
//       last_donation_date: "2025-05-01",
//       score: 890,
//       rank: 1,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "2",
//       name: "Robert Chen",
//       blood_group: "A-",
//       totalDonations: 23,
//       last_donation_date: "2025-04-15",
//       score: 760,
//       rank: 2,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "3",
//       name: "Maria Rodriguez",
//       blood_group: "B+",
//       totalDonations: 21,
//       last_donation_date: "2025-04-30",
//       score: 710,
//       rank: 3,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "4",
//       name: "David Park",
//       blood_group: "AB+",
//       totalDonations: 19,
//       last_donation_date: "2025-05-05",
//       score: 670,
//       rank: 4,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "5",
//       name: "Sarah Johnson",
//       blood_group: "O-",
//       totalDonations: 17,
//       last_donation_date: "2025-04-20",
//       score: 630,
//       rank: 5,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "6",
//       name: "James Williams",
//       blood_group: "A+",
//       totalDonations: 16,
//       last_donation_date: "2025-03-25",
//       score: 590,
//       rank: 6,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "7",
//       name: "Emma Garcia",
//       blood_group: "AB-",
//       totalDonations: 14,
//       last_donation_date: "2025-04-10",
//       score: 550,
//       rank: 7,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "8",
//       name: "Michael Brown",
//       blood_group: "B-",
//       totalDonations: 12,
//       last_donation_date: "2025-05-02",
//       score: 490,
//       rank: 8,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "9",
//       name: "Olivia Davis",
//       blood_group: "O+",
//       totalDonations: 10,
//       last_donation_date: "2025-03-15",
//       score: 450,
//       rank: 9,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "10",
//       name: "William Martinez",
//       blood_group: "A-",
//       totalDonations: 8,
//       last_donation_date: "2025-04-22",
//       score: 400,
//       rank: 10,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "11",
//       name: "Sophia Lee",
//       blood_group: "AB+",
//       totalDonations: 7,
//       last_donation_date: "2025-05-03",
//       score: 370,
//       rank: 11,
//       profileImage: "/defaultProfile.png",
//     },
//     {
//       donorId: "12",
//       name: "Benjamin Taylor",
//       blood_group: "B+",
//       totalDonations: 6,
//       last_donation_date: "2025-04-18",
//       score: 340,
//       rank: 12,
//       profileImage: "/defaultProfile.png",
//     }
//   ]);
//   const getRankMedal = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="w-6 h-6 text-yellow-500" />;
//       case 2:
//         return <Medal className="w-6 h-6 text-gray-400" />;
//       case 3:
//         return <Medal className="w-6 h-6 text-amber-700" />;
//       default:
//         return <span className="text-lg font-bold">{rank}</span>;
//     }
//   };
//   const fetchRank = async () => {
//   }
//   return (
//     <div className="min-h-screen bg-gray-50 initialPage">
//       {/* Page Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-2xl font-bold text-gray-900">Blood Donor Leaderboard</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Recognizing our top contributors who save lives through blood donation
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

//         {/* Leaderboard */}
//         <div className="bg-white rounded-lg shadow">
//           {/* Top 3 Donors */}
//           <div className="px-6 py-8 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900 mb-6">Top Donors</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {donors.slice(0, 3).map((donor) => (
//                 <div
//                   key={donor.donorId}
//                   className={`flex flex-col items-center p-6 rounded-lg ${donor.rank === 1 ? 'bg-yellow-50 ring-2 ring-yellow-200' : donor.rank === 2 ? 'bg-gray-50 ring-1 ring-gray-200' : 'bg-amber-50 ring-1 ring-amber-200'}`}
//                 >
//                   <div className="relative">
//                     <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//                       <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
//                     </div>
//                     <div className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center ${donor.rank === 1 ? 'bg-yellow-500' : donor.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'} text-white`}>
//                       {donor.rank}
//                     </div>
//                   </div>
//                   <h3 className="mt-4 font-medium text-gray-900">{donor.name}</h3>
//                   <div className="mt-1 flex items-center">
//                     <Droplet className="w-4 h-4 text-red-500 mr-1" />
//                     <span className="text-sm text-gray-600">{donor.blood_group}</span>
//                   </div>
//                   <div className="mt-4 flex items-center text-lg font-semibold">
//                     <span>{donor.score} pts</span>
//                   </div>
//                   <div className="mt-2 flex items-center text-sm">
//                     <span className="text-gray-600">{donor.totalDonations} donations</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
//                     Rank
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Donor
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Blood Type
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Donations
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Last Donation
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Score
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {donors.map((donor) => (
//                   <tr
//                     key={donor.donorId}
//                     className={'hover:bg-gray-50'}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center justify-center">
//                         {getRankMedal(donor.rank)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
//                           <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{donor.name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
//                         <Droplet className="w-4 h-4 mr-1" />
//                         {donor.blood_group}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{donor.totalDonations}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-sm text-gray-900">
//                         <Calendar className="w-4 h-4 mr-1 text-gray-500" />
//                         {donor.last_donation_date}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{donor.score} pts</div>
//                     </td>
//                   </tr>
//                 ))}
//                 {donors.length === 0 && (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
//                       No donors found matching your search criteria.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>

//   )
// }

// export default page

"use client";
import { useState } from "react";
import {
  Trophy,
  Medal,
  Heart,
  Search,
  Filter,
  Calendar,
  Droplet,
  Award,
  Users,
  Gift,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

interface Donor {
  donorId: string;
  name: string;
  blood_group: string;
  totalDonations: number;
  last_donation_date: string;
  score: number;
  rank: number;
  profileImage: string;
}

const Page = () => {
  const [timeFilter, setTimeFilter] = useState<string>("allTime");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [donors, setDonors] = useState<Donor[]>([
    {
      donorId: "1",
      name: "Jennifer Thompson",
      blood_group: "O+",
      totalDonations: 28,
      last_donation_date: "2025-05-01",
      score: 890,
      rank: 1,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "2",
      name: "Robert Chen",
      blood_group: "A-",
      totalDonations: 23,
      last_donation_date: "2025-04-15",
      score: 760,
      rank: 2,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "3",
      name: "Maria Rodriguez",
      blood_group: "B+",
      totalDonations: 21,
      last_donation_date: "2025-04-30",
      score: 710,
      rank: 3,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "4",
      name: "David Park",
      blood_group: "AB+",
      totalDonations: 19,
      last_donation_date: "2025-05-05",
      score: 670,
      rank: 4,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "5",
      name: "Sarah Johnson",
      blood_group: "O-",
      totalDonations: 17,
      last_donation_date: "2025-04-20",
      score: 630,
      rank: 5,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "6",
      name: "James Williams",
      blood_group: "A+",
      totalDonations: 16,
      last_donation_date: "2025-03-25",
      score: 590,
      rank: 6,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "7",
      name: "Emma Garcia",
      blood_group: "AB-",
      totalDonations: 14,
      last_donation_date: "2025-04-10",
      score: 550,
      rank: 7,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "8",
      name: "Michael Brown",
      blood_group: "B-",
      totalDonations: 12,
      last_donation_date: "2025-05-02",
      score: 490,
      rank: 8,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "9",
      name: "Olivia Davis",
      blood_group: "O+",
      totalDonations: 10,
      last_donation_date: "2025-03-15",
      score: 450,
      rank: 9,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "10",
      name: "William Martinez",
      blood_group: "A-",
      totalDonations: 8,
      last_donation_date: "2025-04-22",
      score: 400,
      rank: 10,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "11",
      name: "Sophia Lee",
      blood_group: "AB+",
      totalDonations: 7,
      last_donation_date: "2025-05-03",
      score: 370,
      rank: 11,
      profileImage: "/defaultProfile.png",
    },
    {
      donorId: "12",
      name: "Benjamin Taylor",
      blood_group: "B+",
      totalDonations: 6,
      last_donation_date: "2025-04-18",
      score: 340,
      rank: 12,
      profileImage: "/defaultProfile.png",
    },
  ]);

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold">{rank}</span>;
    }
  };

  const fetchRank = async () => {
    // Function kept as is
  };

  // Calculate total donations
  const totalDonations = donors.reduce(
    (sum, donor) => sum + donor.totalDonations,
    0
  );

  // Get total unique donors
  const totalDonors = donors.length;

  // Get most common blood type
  const bloodTypeCounts = donors.reduce((acc, donor) => {
    acc[donor.blood_group] = (acc[donor.blood_group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonBloodType = Object.entries(bloodTypeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  // Get top 3 donors
  const topDonors = donors.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Heart className="mr-3 h-8 w-8 text-white" />
                Blood Donor Leaderboard
              </h1>
              <p className="mt-2 text-red-100">
                Recognizing our heroes who save lives through blood donation
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transform transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Total Donations
              </h3>
              <div className="p-2 bg-red-50 rounded-full">
                <Gift className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalDonations}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Lives impacted through generosity
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transform transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Total Donors
              </h3>
              <div className="p-2 bg-red-50 rounded-full">
                <Users className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalDonors}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Heroes in our community
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transform transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Top Blood Type
              </h3>
              <div className="p-2 bg-red-50 rounded-full">
                <Droplet className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {mostCommonBloodType}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Most common among donors
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Top 3 Donors Podium */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
            <Award className="mr-2 h-5 w-5 text-red-600" />
            Top Donors
          </h2>

          <div className="relative h-[470px] flex items-end justify-center">
            {/* Second Place - Left */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-[180px] w-[120px] flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white ring-4 ring-gray-300 shadow-md flex items-center justify-center">
                  <Image
                    width={80}
                    height={80}
                    src={topDonors[1]?.profileImage || "/placeholder.svg"}
                    alt={topDonors[1]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center bg-gray-400 text-white shadow-md">
                  2
                </div>
              </div>
              <p className="font-bold text-gray-900 text-center">
                {topDonors[1]?.name}
              </p>
              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                <Droplet className="w-3 h-3 mr-1" />
                <span>{topDonors[1]?.blood_group}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {topDonors[1]?.score} pts
              </p>

              {/* Podium */}
              <div className="mt-4 w-[120px] h-[180px] bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-t-lg shadow-lg flex items-center justify-center">
                <span className="text-5xl font-bold text-white">2</span>
              </div>
            </div>

            {/* First Place - Center */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-[60px] w-[120px] flex flex-col items-center z-10">
              <div className="relative mb-2">
                <Trophy className="w-12 h-12 text-yellow-500 mb-2" />
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-yellow-400 shadow-lg flex items-center justify-center">
                  <Image
                    width={80}
                    height={80}
                    src={topDonors[0]?.profileImage || "/placeholder.svg"}
                    alt={topDonors[0]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center bg-yellow-500 text-white shadow-md">
                  1
                </div>
              </div>
              <p className="font-bold text-gray-900 text-center">
                {topDonors[0]?.name}
              </p>
              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                <Droplet className="w-3 h-3 mr-1" />
                <span>{topDonors[0]?.blood_group}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {topDonors[0]?.score} pts
              </p>

              {/* Podium */}
              <div className="mt-4 w-[120px] h-[240px] bg-gradient-to-b from-red-400 to-red-500 rounded-t-lg shadow-lg flex items-center justify-center">
                <span className="text-5xl font-bold text-white">1</span>
              </div>
            </div>

            {/* Third Place - Right */}
            <div className="absolute bottom-0 left-1/2 transform translate-x-[60px] w-[120px] flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white ring-4 ring-amber-600 shadow-md flex items-center justify-center">
                  <Image
                    width={80}
                    height={80}
                    src={topDonors[2]?.profileImage || "/placeholder.svg"}
                    alt={topDonors[2]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center bg-amber-700 text-white shadow-md">
                  3
                </div>
              </div>
              <p className="font-bold text-gray-900 text-center">
                {topDonors[2]?.name}
              </p>
              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                <Droplet className="w-3 h-3 mr-1" />
                <span>{topDonors[2]?.blood_group}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {topDonors[2]?.score} pts
              </p>

              {/* Podium */}
              <div className="mt-4 w-[120px] h-[140px] bg-gradient-to-b from-green-400 to-green-500 rounded-t-lg shadow-lg flex items-center justify-center">
                <span className="text-5xl font-bold text-white">3</span>
              </div>
            </div>

            {/* Podium Base */}
            <div className="absolute bottom-0 w-full h-4 bg-gray-800 rounded-sm"></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative rounded-md shadow-sm max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm"
              placeholder="Search donors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeFilter === "allTime"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setTimeFilter("allTime")}
            >
              All Time
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeFilter === "thisMonth"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setTimeFilter("thisMonth")}
            >
              This Month
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeFilter === "thisYear"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setTimeFilter("thisYear")}
            >
              This Year
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              More Filters
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Donor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Blood Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Donations
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Donation
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr
                    key={donor.donorId}
                    className="hover:bg-red-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {getRankMedal(donor.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-red-100">
                          <img
                            src={donor.profileImage || "/placeholder.svg"}
                            alt={donor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donor.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {donor.donorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                        <Droplet className="w-4 h-4 mr-1" />
                        {donor.blood_group}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Gift className="w-4 h-4 mr-1 text-red-500" />
                        {donor.totalDonations}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {donor.last_donation_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        {donor.score} pts
                      </div>
                    </td>
                  </tr>
                ))}
                {donors.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No donors found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-8 rounded-xl bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-12 w-12 rounded-full bg-red-100 items-center justify-center">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="w-full">
              <h3 className="text-lg font-bold text-gray-900">Your Impact</h3>
              <p className="mt-2 text-sm text-gray-600">
                Every donation can save up to three lives. Our donors have
                collectively helped thousands of patients in need.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Lives Saved
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {totalDonations * 3}
                  </p>
                  <p className="text-xs text-gray-500">Based on donations</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Next Drive
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    June 15, 2025
                  </p>
                  <p className="text-xs text-gray-500">
                    Central Community Center
                  </p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-1">
                      <Droplet className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Urgent Need
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-red-600">
                    O- and AB- blood types
                  </p>
                  <p className="text-xs text-gray-500">Critical shortage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
