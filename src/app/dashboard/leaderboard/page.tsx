'use client';
import { useEffect, useState } from 'react';
import { Trophy, Medal, ArrowUp, ArrowDown, Heart, Search, Filter, ChevronDown, Calendar, Droplet } from 'lucide-react';
import { getDonorRank } from '@/actions/donorActions';
import { IDonor } from '@/models/donor.models';
interface Donor extends Omit<IDonor, 'user'> {
  rank: number;
  user: {
    name: string;
  };
}

const page = () => {
  const [donors, setDonors] = useState<Donor[]>([
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
    try {
      const response = await getDonorRank();

      if (response.success) {
        setDonors(response.data);
        console.log(response.data);
      } else {
        console.log(response.message || "Failed to fetch donor ranks");
      }
    } catch (err) {
      console.error("An unexpected error occurred");
    }
  }
   useEffect(() => {
    fetchRank();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 initialPage">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Blood Donor Leaderboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Recognizing our top contributors who save lives through blood donation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        <div className="bg-white rounded-lg shadow">
          <div className={donors.length > 0 ? "px-6 py-8 border-b border-gray-200" : "hidden"}>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Top Donors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {donors.filter((donor) => donor.score > 0).slice(0, 3).map((donor) => (
                <div
                  key={donor.donorId}
                  className={`flex flex-col items-center p-6 rounded-lg ${donor.rank === 1 ? 'bg-yellow-50 ring-2 ring-yellow-200' : donor.rank === 2 ? 'bg-gray-50 ring-1 ring-gray-200' : 'bg-amber-50 ring-1 ring-amber-200'}`}
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img src={donor.profileImage ?? "/defaultProfile.png"} alt={donor.user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center ${donor.rank === 1 ? 'bg-yellow-500' : donor.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'} text-white`}>
                      {donor.rank}
                    </div>
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{donor.user.name}</h3>
                  <div className="mt-1 flex items-center">
                    <Droplet className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-gray-600">{donor.blood_group}</span>
                  </div>
                  <div className="mt-4 flex items-center text-lg font-semibold">
                    <span>{donor.score} pts</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-600">{donor.total_donations} donations</span>
                  </div>
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
                {donors.filter((donor) => donor.score > 0).map((donor) => (
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
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img src={donor.profileImage ??"/defaultProfile.png"} alt={donor.user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{donor.user.name}</div>
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
                      <div className="text-sm text-gray-900">{donor.total_donations??0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {new Date(donor.last_donation_date ?? new Date()).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donor.score??0} pts</div>
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
