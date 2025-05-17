'use client';
import { useState } from 'react';
import { Trophy, Medal, ArrowUp, ArrowDown, Heart, Search, Filter, ChevronDown, Calendar, Droplet } from 'lucide-react';
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

const page = () => {
  const [timeFilter, setTimeFilter] = useState<string>('allTime');
  const [searchQuery, setSearchQuery] = useState<string>('');


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
    }
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
  }
  return (
    <div className="min-h-screen bg-gray-50 initialPage">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Blood Donor Leaderboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Recognizing our top contributors who save lives through blood donation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow">
          {/* Top 3 Donors */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Top Donors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {donors.slice(0, 3).map((donor) => (
                <div
                  key={donor.donorId}
                  className={`flex flex-col items-center p-6 rounded-lg ${donor.rank === 1 ? 'bg-yellow-50 ring-2 ring-yellow-200' : donor.rank === 2 ? 'bg-gray-50 ring-1 ring-gray-200' : 'bg-amber-50 ring-1 ring-amber-200'}`}
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center ${donor.rank === 1 ? 'bg-yellow-500' : donor.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'} text-white`}>
                      {donor.rank}
                    </div>
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{donor.name}</h3>
                  <div className="mt-1 flex items-center">
                    <Droplet className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-gray-600">{donor.blood_group}</span>
                  </div>
                  <div className="mt-4 flex items-center text-lg font-semibold">
                    <span>{donor.score} pts</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-600">{donor.totalDonations} donations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr
                    key={donor.donorId}
                    className={'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {getRankMedal(donor.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                        <Droplet className="w-4 h-4 mr-1" />
                        {donor.blood_group}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donor.totalDonations}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {donor.last_donation_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donor.score} pts</div>
                    </td>
                  </tr>
                ))}
                {donors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No donors found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  )
}

export default page