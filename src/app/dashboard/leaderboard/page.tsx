"use client";
import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  ArrowUp,
  ArrowDown,
  Heart,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Droplet,
} from "lucide-react";
import { getDonorRank } from "@/actions/donorActions";
import { IDonor } from "@/models/donor.models";
import Page from "../page";
interface Donor extends Omit<IDonor, "user"> {
  rank: number;
  user: {
    name: string;
  };
}

const Page = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
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
  };
  useEffect(() => {
    fetchRank();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 initialPage">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Blood Donor Leaderboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Recognizing our top contributors who save lives through blood
            donation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div
            className={
              donors.length > 0
                ? "px-6 py-8 border-b border-gray-200"
                : "hidden"
            }
          >
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Top Donors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {donors
                .filter((donor) => donor.score > 0)
                .slice(0, 3)
                .map((donor) => (
                  <div
                    key={donor.donorId}
                    className={`flex flex-col items-center p-6 rounded-lg ${
                      donor.rank === 1
                        ? "bg-yellow-50 ring-2 ring-yellow-200"
                        : donor.rank === 2
                        ? "bg-gray-50 ring-1 ring-gray-200"
                        : "bg-amber-50 ring-1 ring-amber-200"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          src={donor.profileImage ?? "/defaultProfile.png"}
                          alt={donor.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center ${
                          donor.rank === 1
                            ? "bg-yellow-500"
                            : donor.rank === 2
                            ? "bg-gray-400"
                            : "bg-amber-700"
                        } text-white`}
                      >
                        {donor.rank}
                      </div>
                    </div>
                    <h3 className="mt-4 font-medium text-gray-900">
                      {donor.user.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <Droplet className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {donor.blood_group}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center text-lg font-semibold">
                      <span>{donor.score} pts</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-gray-600">
                        {donor.total_donations} donations
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Donor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Blood Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Donations
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Donation
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors
                  .filter((donor) => donor.score > 0)
                  .map((donor) => (
                    <tr key={donor.donorId} className={"hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {getRankMedal(donor.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <img
                              src={donor.profileImage ?? "/defaultProfile.png"}
                              alt={donor.user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {donor.user.name}
                            </div>
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
                        <div className="text-sm text-gray-900">
                          {donor.total_donations ?? 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          {new Date(
                            donor.last_donation_date ?? new Date()
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {donor.score ?? 0} pts
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
      </div>
    </div>
  );
};

export default Page;
