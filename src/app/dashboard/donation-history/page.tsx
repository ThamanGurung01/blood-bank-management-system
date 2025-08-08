"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  Award,
  Heart,
  Droplet,
  Search,
  AlertCircle,
  CheckCircle,
  User,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDonor } from "@/actions/donorActions";
import { getBloodDonations } from "@/actions/bloodDonationActions";
import { getDonorDonationRequests } from "@/actions/donationScheduleActions";
import type {
  DonationType,
  IBLood_Donation,
} from "@/models/blood_donation.models";

interface DonationRecord extends Omit<IBLood_Donation, "blood_bank"> {
  blood_bank: {
    blood_bank: string;
  };
  donation_type: DonationType;
}

interface DonorData {
  next_eligible_donation_date: Date;
  last_donation_date: Date;
  total_donations: number;
  donated_volume: number;
}

interface DonationRequest {
  _id: string;
  blood_bank: {
    blood_bank: string;
    location: string;
  };
  requested_date: Date;
  scheduled_time_slot: string;
  status: string;
  createdAt: Date;
}

export default function DonationHistoryPage() {
  const { data: session } = useSession();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<DonationRecord[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"history" | "requests" | "stats">(
    "history"
  );
  const [donorData, setDonorData] = useState<DonorData>({} as DonorData);

  const DonationTypes: DonationType[] = [
    "whole_blood",
    "rbc",
    "platelets",
    "plasma",
    "cryoprecipitate",
  ];

  const DonationTypeLabels: Record<DonationType, string> = {
    whole_blood: "Whole Blood",
    rbc: "Red Blood Cells",
    platelets: "Platelets",
    plasma: "Plasma",
    cryoprecipitate: "Cryoprecipitate",
  };

  const fetchDonationHistory = async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const [donationsResponse, donorResponse, requestsResponse] =
        await Promise.all([
          getBloodDonations(session.user.id),
          getDonor(session.user.id),
          getDonorDonationRequests(session.user.id),
        ]);

      if (donorResponse.success && donorResponse.data) {
        setDonorData({
          next_eligible_donation_date: donorResponse.data.next_eligible_donation_date
            ? new Date(donorResponse.data.next_eligible_donation_date)
            : new Date(),
          last_donation_date: donorResponse.data.last_donation_date
            ? new Date(donorResponse.data.last_donation_date)
            : new Date(),
          total_donations: donorResponse.data.total_donations ?? 0,
          donated_volume: donorResponse.data.donated_volume ?? 0,
        });
      } else {
        setDonorData({
          next_eligible_donation_date: new Date(),
          last_donation_date: new Date(),
          total_donations: 0,
          donated_volume: 0,
        });
      }
      if (donationsResponse.success) {
        setDonations(donationsResponse.data);
        applyFilters(donationsResponse.data, searchTerm, typeFilter);
      }
      if (requestsResponse.success) {
        setRequests(requestsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching donation history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchDonationHistory();
    }
  }, [session]);

  const applyFilters = (
    data: DonationRecord[],
    search: string,
    type: string
  ) => {
    let filtered = [...data];

    if (type !== "all") {
      filtered = filtered.filter((donation) => donation.donation_type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (donation) =>
          donation.blood_bank.blood_bank.toLowerCase().includes(searchLower) ||
          donation.donation_type.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDonations(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(donations, value, typeFilter);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    applyFilters(donations, searchTerm, value);
  };

  const totalDonations = donations.length;
  const totalUnits = donations.reduce(
    (sum, donation) => sum + donation.blood_units,
    0
  );
  const lastDonation =
    donations.length > 0 ? new Date(donations[0].collected_date) : null;

  const isEligibleNow = donorData.next_eligible_donation_date
    ? new Date() >= new Date(donorData.next_eligible_donation_date)
    : false;

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

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">
                Total Donations
              </h2>
              <Droplet className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-gray-900">
                {totalDonations}
              </p>
              <Badge className="ml-2 bg-green-100 text-green-800">
                Lifetime
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">
                Blood Volume
              </h2>
              <Droplet className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
              <span className="ml-2 text-sm text-gray-500">units</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">
                Lives Impacted
              </h2>
              <Heart className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-gray-900">
                {totalUnits * 3}
              </p>
              <span className="ml-2 text-sm text-gray-500">people</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Potential lives saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Donor Level</h2>
              <Award className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-gray-900">
                {totalDonations >= 50
                  ? "Platinum"
                  : totalDonations >= 25
                  ? "Gold"
                  : totalDonations >= 10
                  ? "Silver"
                  : "Bronze"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
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
                className={`rounded-lg px-4 py-2 ${
                  isEligibleNow
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
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
                    {!isEligibleNow &&
                      donorData.next_eligible_donation_date && (
                        <p>
                          {new Date(
                            donorData.next_eligible_donation_date
                          ).toLocaleDateString("en-US", {
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
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>Ready for your first donation!</span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Donation History</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by location or type..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {DonationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {DonationTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Donations Table */}
          <Card>
            <CardContent className="p-0">
              {filteredDonations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                          Units
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredDonations.map((donation, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                donation.collected_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(
                                donation.collected_date
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <div
                                className={`mr-2 h-2 w-2 rounded-full ${
                                  donation.donation_type === "whole_blood"
                                    ? "bg-red-500"
                                    : donation.donation_type === "platelets"
                                    ? "bg-yellow-500"
                                    : donation.donation_type === "plasma"
                                    ? "bg-blue-500"
                                    : "bg-purple-500"
                                }`}
                              ></div>
                              <div className="text-sm text-gray-900">
                                {DonationTypeLabels[donation.donation_type]}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {donation.blood_bank.blood_bank}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {donation.blood_units}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Droplet className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="mb-1 text-lg font-medium text-gray-900">
                    No donations found
                  </h3>
                  <p className="mb-6 text-gray-500">
                    {searchTerm || typeFilter !== "all"
                      ? "No donations match your search criteria."
                      : "You haven't made any blood donations yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donation Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.slice(0, 10).map((request) => (
                    <div key={request._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {request.blood_bank.blood_bank}
                        </h3>
                        <Badge
                          className={
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          Date:{" "}
                          {new Date(
                            request.requested_date
                          ).toLocaleDateString()}
                        </div>
                        <div>Time: {request.scheduled_time_slot}</div>
                        <div>Location: {request.blood_bank.location}</div>
                        <div>
                          Requested:{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No donation requests found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Donation Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Whole Blood",
                      color: "bg-red-500",
                      count: donations.filter(
                        (d) => d.donation_type === "whole_blood"
                      ).length,
                    },
                    {
                      type: "Platelets",
                      color: "bg-yellow-500",
                      count: donations.filter(
                        (d) => d.donation_type === "platelets"
                      ).length,
                    },
                    {
                      type: "Plasma",
                      color: "bg-blue-500",
                      count: donations.filter(
                        (d) => d.donation_type === "plasma"
                      ).length,
                    },
                    {
                      type: "RBC",
                      color: "bg-purple-500",
                      count: donations.filter((d) => d.donation_type === "rbc")
                        .length,
                    },
                    {
                      type: "Cryoprecipitate",
                      color: "bg-green-500",
                      count: donations.filter(
                        (d) => d.donation_type === "cryoprecipitate"
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
                            width: `${
                              totalDonations > 0
                                ? (item.count / totalDonations) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-center justify-center">
                  <div className="flex h-full w-full items-end justify-around">
                    {[
                      {
                        year: "2023",
                        count: donations.filter(
                          (d) =>
                            new Date(d.collected_date).getFullYear() === 2023
                        ).length,
                      },
                      {
                        year: "2024 Q1",
                        count: donations.filter((d) => {
                          const date = new Date(d.collected_date)
                            .toISOString()
                            .split("T")[0];
                          return date >= "2024-01-01" && date <= "2024-03-31";
                        }).length,
                      },
                      {
                        year: "2024 Q2",
                        count: donations.filter((d) => {
                          const date = new Date(d.collected_date)
                            .toISOString()
                            .split("T")[0];
                          return date >= "2024-04-01" && date <= "2024-06-30";
                        }).length,
                      },
                      {
                        year: "2024 Q3",
                        count: donations.filter((d) => {
                          const date = new Date(d.collected_date)
                            .toISOString()
                            .split("T")[0];
                          return date >= "2024-07-01" && date <= "2024-09-30";
                        }).length,
                      },
                      {
                        year: "2024 Q4",
                        count: donations.filter((d) => {
                          const date = new Date(d.collected_date)
                            .toISOString()
                            .split("T")[0];
                          return date >= "2024-10-01" && date <= "2024-12-31";
                        }).length,
                      },
                      {
                        year: "2025",
                        count: donations.filter(
                          (d) =>
                            new Date(d.collected_date).getFullYear() === 2025
                        ).length,
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-12 rounded-t-md bg-red-500"
                          style={{
                            height: `${Math.max(
                              totalDonations > 0
                                ? (item.count / totalDonations) * 200
                                : 4,
                              item.count > 0 ? 20 : 4
                            )}px`,
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Impact Information */}
      <Card className="mt-8 bg-red-50 border-red-200">
        <CardContent className="p-6">
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
                    Someone needs blood. Your donations help save lives every
                    day.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-800">43,000+</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Pints of donated blood are used each day. You&apos;re part
                    of this lifesaving effort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
