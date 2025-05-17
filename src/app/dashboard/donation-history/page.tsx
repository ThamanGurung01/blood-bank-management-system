"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Heart,
  Droplet,
  TrendingUp,
  Search,
  Download,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  User,
  BarChart2,
} from "lucide-react";

interface DonationRecord {
  id: string;
  date: string;
  time: string;
  bloodType: string;
  donationType: string;
  amount: number; // in units
  location: string;
  status: "successful" | "deferred" | "incomplete";
  notes?: string;
  staffName?: string;
}

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<DonationRecord[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list");

  // Mock data for demonstration
  const mockDonations: DonationRecord[] = [
    {
      id: "DON-2025-001",
      date: "2025-05-10",
      time: "09:30",
      bloodType: "A+",
      donationType: "Whole Blood",
      amount: 1,
      location: "Main Blood Center",
      status: "successful",
      staffName: "Dr. Sarah Johnson",
    },
    {
      id: "DON-2025-002",
      date: "2025-03-15",
      time: "14:45",
      bloodType: "A+",
      donationType: "Platelets",
      amount: 1,
      location: "Community Hospital",
      status: "successful",
      staffName: "Dr. Michael Chen",
    },
    {
      id: "DON-2024-012",
      date: "2024-12-20",
      time: "11:15",
      bloodType: "A+",
      donationType: "Plasma",
      amount: 1,
      location: "Mobile Blood Drive - University",
      status: "successful",
      staffName: "Dr. Emily Rodriguez",
    },
    {
      id: "DON-2024-008",
      date: "2024-10-05",
      time: "10:00",
      bloodType: "A+",
      donationType: "Whole Blood",
      amount: 1,
      location: "Main Blood Center",
      status: "successful",
      staffName: "Dr. James Wilson",
    },
    {
      id: "DON-2024-005",
      date: "2024-08-12",
      time: "15:30",
      bloodType: "A+",
      donationType: "Double Red Cells",
      amount: 2,
      location: "Regional Medical Center",
      status: "successful",
      staffName: "Dr. Lisa Thompson",
    },
    {
      id: "DON-2024-003",
      date: "2024-06-28",
      time: "13:00",
      bloodType: "A+",
      donationType: "Whole Blood",
      amount: 1,
      location: "Community Hospital",
      status: "deferred",
      notes: "Low hemoglobin levels",
      staffName: "Dr. Robert Garcia",
    },
    {
      id: "DON-2024-001",
      date: "2024-04-15",
      time: "09:45",
      bloodType: "A+",
      donationType: "Platelets",
      amount: 1,
      location: "Main Blood Center",
      status: "successful",
      staffName: "Dr. Sarah Johnson",
    },
    {
      id: "DON-2023-010",
      date: "2023-12-01",
      time: "11:30",
      bloodType: "A+",
      donationType: "Whole Blood",
      amount: 1,
      location: "Mobile Blood Drive - City Hall",
      status: "incomplete",
      notes: "Donor felt dizzy during donation",
      staffName: "Dr. David Brown",
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch donation history
    const fetchDonationHistory = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDonations(mockDonations);
        applyFilters(
          mockDonations,
          searchTerm,
          statusFilter,
          typeFilter,
          dateFilter
        );
      } catch (error) {
        console.error("Error fetching donation history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  const applyFilters = (
    data: DonationRecord[],
    search: string,
    status: string,
    type: string,
    date: string
  ) => {
    let filtered = [...data];

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((donation) => donation.status === status);
    }

    // Apply donation type filter
    if (type !== "all") {
      filtered = filtered.filter((donation) => donation.donationType === type);
    }

    // Apply date filter
    if (date !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      if (date === "3months") {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (date === "6months") {
        cutoffDate.setMonth(now.getMonth() - 6);
      } else if (date === "1year") {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }

      filtered = filtered.filter(
        (donation) => new Date(donation.date) >= cutoffDate
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (donation) =>
          donation.id.toLowerCase().includes(searchLower) ||
          donation.location.toLowerCase().includes(searchLower) ||
          donation.donationType.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDonations(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(donations, value, statusFilter, typeFilter, dateFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(donations, searchTerm, value, typeFilter, dateFilter);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    applyFilters(donations, searchTerm, statusFilter, value, dateFilter);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    applyFilters(donations, searchTerm, statusFilter, typeFilter, value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Successful
          </span>
        );
      case "deferred":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Deferred
          </span>
        );
      case "incomplete":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Incomplete
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate donation statistics
  const totalDonations = donations.filter(
    (d) => d.status === "successful"
  ).length;
  const totalUnits = donations
    .filter((d) => d.status === "successful")
    .reduce((sum, donation) => sum + donation.amount, 0);
  const livesImpacted = totalUnits * 3; // Estimate: each unit can help up to 3 people
  const lastDonation =
    donations.length > 0 ? new Date(donations[0].date) : null;
  const donationTypes = [...new Set(donations.map((d) => d.donationType))];

  // Calculate eligibility for next donation
  const calculateNextEligibleDate = () => {
    if (!lastDonation) return null;

    const nextEligibleDate = new Date(lastDonation);
    const lastDonationType = donations[0].donationType;

    // Add waiting period based on donation type
    switch (lastDonationType) {
      case "Whole Blood":
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 56); // 56 days
        break;
      case "Platelets":
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 7); // 7 days
        break;
      case "Plasma":
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 28); // 28 days
        break;
      case "Double Red Cells":
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 112); // 112 days
        break;
      default:
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 56); // Default to 56 days
    }

    return nextEligibleDate;
  };

  const nextEligibleDate = calculateNextEligibleDate();
  const isEligibleNow = nextEligibleDate
    ? new Date() >= nextEligibleDate
    : false;

  // Determine donor level based on number of donations
  const getDonorLevel = () => {
    if (totalDonations >= 50)
      return { level: "Platinum", color: "bg-gray-200" };
    if (totalDonations >= 25) return { level: "Gold", color: "bg-yellow-100" };
    if (totalDonations >= 10) return { level: "Silver", color: "bg-gray-100" };
    return { level: "Bronze", color: "bg-amber-100" };
  };

  const donorLevel = getDonorLevel();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your blood donation records and statistics
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Heart className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">
              Total Donations
            </h2>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Droplet className="h-4 w-4 text-red-600" />
            </span>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-900">{totalDonations}</p>
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Lifetime
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Successful donations</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Blood Volume</h2>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Droplet className="h-4 w-4 text-red-600" />
            </span>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
            <span className="ml-2 text-sm text-gray-500">units</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Approx. {totalUnits * 450}ml of blood
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">
              Lives Impacted
            </h2>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Heart className="h-4 w-4 text-red-600" />
            </span>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-900">{livesImpacted}</p>
            <span className="ml-2 text-sm text-gray-500">people</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Potential lives saved</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Donor Level</h2>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Award className="h-4 w-4 text-red-600" />
            </span>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-900">
              {donorLevel.level}
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-red-600"
              style={{
                width: `${Math.min(
                  (totalDonations /
                    (donorLevel.level === "Platinum"
                      ? 50
                      : donorLevel.level === "Gold"
                      ? 25
                      : donorLevel.level === "Silver"
                      ? 10
                      : 5)) *
                    100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {donorLevel.level === "Platinum"
              ? "Platinum Donor (50+ donations)"
              : donorLevel.level === "Gold"
              ? `${totalDonations}/50 to Platinum`
              : donorLevel.level === "Silver"
              ? `${totalDonations}/25 to Gold`
              : `${totalDonations}/10 to Silver`}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              Next Donation Eligibility
            </h2>
            <p className="text-sm text-gray-500">
              Based on your last donation type and date
            </p>
          </div>

          {lastDonation ? (
            <div
              className={`rounded-lg ${
                isEligibleNow
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              } px-4 py-2`}
            >
              <div className="flex items-center gap-2">
                {isEligibleNow ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium">
                    {isEligibleNow
                      ? "You are eligible to donate now!"
                      : "Next eligible donation date:"}
                  </p>
                  {!isEligibleNow && nextEligibleDate && (
                    <p>
                      {nextEligibleDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-blue-100 px-4 py-2 text-blue-800">
              <p className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span>No previous donations found</span>
              </p>
            </div>
          )}
        </div>

        {lastDonation && (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Last Donation
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <Calendar className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {lastDonation.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {donations[0].donationType}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Waiting Period
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {donations[0].donationType === "Whole Blood"
                      ? "56 days"
                      : donations[0].donationType === "Platelets"
                      ? "7 days"
                      : donations[0].donationType === "Plasma"
                      ? "28 days"
                      : "112 days"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Required waiting period
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Donation Location
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {donations[0].location}
                  </p>
                  <p className="text-sm text-gray-500">
                    Previous donation center
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "list"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Donation List
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "stats"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Statistics
          </button>
        </div>
      </div>

      {activeTab === "list" ? (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-grow max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, location, or type..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="deferred">Deferred</option>
                <option value="incomplete">Incomplete</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">All Types</option>
                {donationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">All Time</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>

              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-md">
            {filteredDonations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Donation ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredDonations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.id}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(donation.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.time}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${
                                donation.donationType === "Whole Blood"
                                  ? "bg-red-500"
                                  : donation.donationType === "Platelets"
                                  ? "bg-yellow-500"
                                  : donation.donationType === "Plasma"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                            ></div>
                            <div className="text-sm text-gray-900">
                              {donation.donationType}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.amount} unit(s)
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {donation.location}
                          </div>
                          {donation.staffName && (
                            <div className="text-sm text-gray-500">
                              Staff: {donation.staffName}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {getStatusBadge(donation.status)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Droplet className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                  No donations found
                </h3>
                <p className="mb-6 text-gray-500">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  typeFilter !== "all" ||
                  dateFilter !== "all"
                    ? "No donations match your search criteria."
                    : "You haven't made any blood donations yet."}
                </p>
                <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                  Schedule Your First Donation
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-medium text-gray-800">
              Donation Types
            </h2>
            <div className="space-y-4">
              {[
                {
                  type: "Whole Blood",
                  color: "bg-red-500",
                  count: donations.filter(
                    (d) => d.donationType === "Whole Blood"
                  ).length,
                },
                {
                  type: "Platelets",
                  color: "bg-yellow-500",
                  count: donations.filter((d) => d.donationType === "Platelets")
                    .length,
                },
                {
                  type: "Plasma",
                  color: "bg-blue-500",
                  count: donations.filter((d) => d.donationType === "Plasma")
                    .length,
                },
                {
                  type: "Double Red Cells",
                  color: "bg-purple-500",
                  count: donations.filter(
                    (d) => d.donationType === "Double Red Cells"
                  ).length,
                },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`mr-2 h-3 w-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${(item.count / totalDonations) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-medium text-gray-800">
              Donation Timeline
            </h2>
            <div className="flex h-64 items-center justify-center">
              <div className="flex h-full w-full items-end justify-around">
                {[
                  {
                    year: "2023",
                    count: donations.filter((d) => d.date.startsWith("2023"))
                      .length,
                  },
                  {
                    year: "2024 Q1",
                    count: donations.filter(
                      (d) => d.date >= "2024-01-01" && d.date <= "2024-03-31"
                    ).length,
                  },
                  {
                    year: "2024 Q2",
                    count: donations.filter(
                      (d) => d.date >= "2024-04-01" && d.date <= "2024-06-30"
                    ).length,
                  },
                  {
                    year: "2024 Q3",
                    count: donations.filter(
                      (d) => d.date >= "2024-07-01" && d.date <= "2024-09-30"
                    ).length,
                  },
                  {
                    year: "2024 Q4",
                    count: donations.filter(
                      (d) => d.date >= "2024-10-01" && d.date <= "2024-12-31"
                    ).length,
                  },
                  {
                    year: "2025",
                    count: donations.filter((d) => d.date.startsWith("2025"))
                      .length,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 rounded-t-md bg-red-500"
                      style={{
                        height: `${(item.count / 5) * 100}%`,
                        minHeight: item.count ? "20px" : "4px",
                      }}
                    ></div>
                    <div className="mt-2 text-xs font-medium text-gray-600">
                      {item.year}
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">
                Achievements & Milestones
              </h2>
              <button className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
                View All
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div
                className={`rounded-lg border ${
                  totalDonations >= 1
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                } p-4`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    First Donation
                  </h3>
                  {totalDonations >= 1 && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      totalDonations >= 1 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Award
                      className={`h-5 w-5 ${
                        totalDonations >= 1 ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        totalDonations >= 1 ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      Lifesaver
                    </p>
                    <p className="text-xs text-gray-500">
                      Complete your first donation
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg border ${
                  totalDonations >= 3
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                } p-4`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Regular Donor
                  </h3>
                  {totalDonations >= 3 && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      totalDonations >= 3 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <TrendingUp
                      className={`h-5 w-5 ${
                        totalDonations >= 3 ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        totalDonations >= 3 ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      Committed
                    </p>
                    <p className="text-xs text-gray-500">Donate 3 times</p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg border ${
                  totalDonations >= 5
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                } p-4`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Bronze Donor
                  </h3>
                  {totalDonations >= 5 && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      totalDonations >= 5 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Award
                      className={`h-5 w-5 ${
                        totalDonations >= 5 ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        totalDonations >= 5 ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      Bronze Status
                    </p>
                    <p className="text-xs text-gray-500">Reach 5 donations</p>
                  </div>
                </div>
                {totalDonations < 5 && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gray-400"
                      style={{
                        width: `${Math.min((totalDonations / 5) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div
                className={`rounded-lg border ${
                  totalDonations >= 10
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                } p-4`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Silver Donor
                  </h3>
                  {totalDonations >= 10 && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      totalDonations >= 10 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Award
                      className={`h-5 w-5 ${
                        totalDonations >= 10
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        totalDonations >= 10 ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      Silver Status
                    </p>
                    <p className="text-xs text-gray-500">Reach 10 donations</p>
                  </div>
                </div>
                {totalDonations < 10 && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gray-400"
                      style={{
                        width: `${Math.min((totalDonations / 10) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <BarChart2 className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Your Impact</h3>
            <p className="mt-1 text-sm text-gray-700">
              Every donation can save up to 3 lives. Your contributions have
              made a significant difference in your community. Thank you for
              being a blood donor!
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-gray-800">1 in 7</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Hospital patients need blood. Your donations help meet this
                  critical need.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-gray-800">
                    Every 2 seconds
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Someone in the Earth needs blood. Your donations help save
                  lives every day.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-gray-800">43,000+</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Pints of donated blood are used each day in the Earth
                  You&#39;re part of this lifesaving effort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
