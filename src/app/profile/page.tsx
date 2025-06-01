"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Clock,
  Edit,
  Award,
  Heart,
  AlertCircle,
  ChevronRight,
  Building,
} from "lucide-react";
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { getDonor } from "@/actions/donorActions";
import { IDonor } from "@/models/donor.models";
import { IBlood_Bank } from "@/models/blood_bank.models";
import { getBloodBank } from "@/actions/bloodBankActions";


const BloodData = {
  name: "NRCS Blood Bank",
  email: "info@nrcsbloodbank.org",
  contact: "9876543210",
  role: "blood_bank",
  location: {
    latitude: 27.7172,
    longitude: 85.324,
  },
  profile_picture: "/defaultProfile.png",
  inventory: [
    { blood_group: "A+", units: 15, status: "adequate" },
    { blood_group: "A-", units: 5, status: "low" },
    { blood_group: "B+", units: 20, status: "adequate" },
    { blood_group: "B-", units: 3, status: "critical" },
    { blood_group: "O+", units: 25, status: "adequate" },
    { blood_group: "O-", units: 8, status: "low" },
    { blood_group: "AB+", units: 10, status: "adequate" },
    { blood_group: "AB-", units: 2, status: "critical" },
  ],
  recentDonations: [
    {
      id: 1,
      date: "2024-05-15",
      donor: "Sarah Johnson",
      blood_group: "O+",
      units: 1,
    },
    {
      id: 2,
      date: "2024-05-14",
      donor: "Michael Chen",
      blood_group: "A+",
      units: 1,
    },
    {
      id: 3,
      date: "2024-05-14",
      donor: "Emily Rodriguez",
      blood_group: "B-",
      units: 1,
    },
  ],
  upcomingDrives: [
    {
      id: 1,
      date: "2024-06-01",
      location: "City Center Mall",
      time: "10:00 AM - 4:00 PM",
    },
    {
      id: 2,
      date: "2024-06-15",
      location: "University Campus",
      time: "9:00 AM - 3:00 PM",
    },
  ],
};
interface Donation {
  id: number;
  date: string;
  location: string;
  units: number;
  status: string;
}
interface Donor extends Omit<IDonor, "user"> {
  user: {
    name: string;
    email: string;
  }
  donations: Donation[];
}
interface BloodBank extends Omit<IBlood_Bank, "user"> {
  user: {
    name: string;
    email: string;
  };
  inventory: Array<{
    blood_group: string;
    units: number;
    status: string;
  }>;
  recentDonations?: Array<{
    id: number;
    date: string;
    donor: string;
    blood_group: string;
    units: number;
  }>;
  upcomingDrives?: Array<{
    id: number;
    date: string;
    location: string;
    time: string;
  }>;
}
export default function ProfilePage() {
  const [viewMode, setViewMode] = useState<"donor" | "blood_bank">("donor");
  const [donorData, setDonorData] = useState<Donor>({} as Donor);
  const [bloodBankData, setBloodBankData] = useState<BloodBank>({} as BloodBank);
  const { data: session } = useSession();

  const fetchDonorData = async () => {
    if (session?.user?.id) {
      const response = await getDonor(session.user.id);
      setDonorData(response.data);
    }
  }
  const fetchBloodBankData = async () => {
    if (session?.user?.id) {
      const response = await getBloodBank(session.user.id);
      setBloodBankData(response.data);
    }
  }

  useEffect(() => {
    if (session?.user?.role === "blood_bank") {
      setDonorData({} as Donor);
      setViewMode("blood_bank");
      fetchBloodBankData();
    } else {
      setBloodBankData({} as BloodBank);
      setViewMode("donor");
      fetchDonorData();
    }
  }, [session, viewMode]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-red-600">
        <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              Blood Bank Management System
            </h1>
            <div className="flex space-x-4">
              <button className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => { redirect("/dashboard") }}
              >
                Dashboard
              </button>
              <button className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => { signOut({ callbackUrl: "/" }) }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <div className="rounded-md bg-white p-2 shadow-md">
            <button
              onClick={() => setViewMode("donor")}
              className={`mr-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${viewMode === "donor"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            >
              Donor View
            </button>
            <button
              onClick={() => setViewMode("blood_bank")}
              className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${viewMode === "blood_bank"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            >
              Blood Bank View
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-1">
            <div className="px-6 py-5">
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32">
                  <Image
                    src={"/defaultProfile.png"}
                    alt="Profile"
                    fill
                    className="rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 rounded-full bg-red-600 p-2 text-white shadow-lg hover:bg-red-700">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-2xl font-bold">{""}</h2>
                <div className="mt-1 flex items-center">
                  {viewMode === "donor" ? (
                    <span className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      <Droplet className="mr-1 h-3 w-3" />{" "}
                      {donorData.blood_group}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      <Building className="mr-1 h-3 w-3" /> Blood Bank
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{donorData.user?.name ?? bloodBankData.user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{donorData.user?.email ?? bloodBankData.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{donorData.contact ?? bloodBankData.contact}</p>
                  </div>
                </div>

                {viewMode === "blood_bank" && (
                  <div className="flex items-center">
                    <Building className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Bank</p>
                      <p className="font-medium">{bloodBankData.blood_bank}</p>
                    </div>
                  </div>)}
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {donorData.location?.latitude.toFixed(4) ?? bloodBankData.location?.latitude.toFixed(4)},{" "}
                      {donorData.location?.longitude.toFixed(4) ?? bloodBankData.location?.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                {viewMode === "donor" && (
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">
                        {donorData.age} years
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center px-6 py-4">
              <button className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {viewMode === "donor" ? (
              donorData.donorId ? (
                <DonorContent data={donorData} />
              ) : (
                <div>Loading donor data...</div>
              )
            ) : bloodBankData.blood_bank ? (
              <BloodBankContent data={bloodBankData} />
            ) : (
              <div>Loading blood bank data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonorContent({ data }: { data: Donor }) {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="w-full">
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${activeTab === "overview"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("donations")}
          className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${activeTab === "donations"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Donation History
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${activeTab === "appointments"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Appointments
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Donor Overview
              </h3>
              <p className="text-sm text-gray-500">
                Your blood donation journey and impact
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <Droplet className="mx-auto h-8 w-8 text-red-600" />
                  <p className="mt-2 text-2xl font-bold text-red-600">
                    {data.total_donations}
                  </p>
                  <p className="text-sm text-gray-600">Total Donations</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <Heart className="mx-auto h-8 w-8 text-red-600" />
                  <p className="mt-2 text-2xl font-bold text-red-600">
                    {data ? 0 : "data.stats.livesSaved"}
                  </p>
                  <p className="text-sm text-gray-600">Lives Saved</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-red-600" />
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {new Date(data.last_donation_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Last Donation</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <Clock className="mx-auto h-8 w-8 text-red-600" />
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {new Date(data.next_eligible_donation_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Next Eligible</p>
                </div>
              </div>

              {/* <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium">
                  Upcoming Appointment
                </h3>
                {data.appointments.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-red-100 p-2">
                          <Calendar className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {data.appointments[0].location}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              data.appointments[0].date
                            ).toLocaleDateString()}{" "}
                            at {data.appointments[0].time}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
                        Scheduled
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-gray-500">No upcoming appointments</p>
                    <button className="mt-2 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Schedule Donation
                    </button>
                  </div>
                )}
              </div> */}

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium">
                  Donation Eligibility
                </h3>
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="px-6 py-4">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          You are eligible to donate!
                        </h4>
                        <p className="text-sm text-gray-500">
                          Based on your last donation date, you can donate
                          again. Schedule your next donation to save lives.
                        </p>
                        <button className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          Schedule Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "donations" && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Donation History
              </h3>
              <p className="text-sm text-gray-500">
                Record of your blood donations
              </p>
            </div>
            <div className="px-6 py-4">
              {data.donations.length > 0 ? (
                <div className="space-y-4">
                  {data.donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-red-100 p-2">
                          <Droplet className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{donation.location}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.date).toLocaleDateString()} •{" "}
                            {donation.units} unit
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <Droplet className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No donations yet</h3>
                  <p className="mt-1 text-gray-500">
                    Start your donation journey today
                  </p>
                  <button className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Schedule First Donation
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center px-6 py-4 border-t border-gray-200">
              <button className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Download Donation Certificate
              </button>
            </div>
          </div>
        )}

        {/* {activeTab === "appointments" && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Appointments
              </h3>
              <p className="text-sm text-gray-500">
                Manage your upcoming blood donation appointments
              </p>
            </div>
            <div className="px-6 py-4">
              {data.appointments.length > 0 ? (
                <div className="space-y-4">
                  {data.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-red-100 p-2">
                          <Calendar className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.location}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString()} at{" "}
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
                          {appointment.status}
                        </span>
                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">
                    No appointments scheduled
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Schedule your next donation
                  </p>
                  <button className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Schedule Now
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Cancel Appointment
              </button>
              <button className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Schedule New Appointment
              </button>
            </div>
          </div>
        )} */}


      </div>
    </div>
  );
}

function BloodBankContent({ data }: { data: BloodBank }) {
  const [activeTab, setActiveTab] = useState("inventory");
  return (
    <div className="w-full">
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${activeTab === "inventory"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Blood Inventory
        </button>
        <button
          onClick={() => setActiveTab("donations")}
          className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${activeTab === "donations"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Recent Donations
        </button>
        <button
          onClick={() => setActiveTab("drives")}
          className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${activeTab === "drives"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Blood Drives
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "inventory" && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Blood Inventory
              </h3>
              <p className="text-sm text-gray-500">
                Current blood stock levels
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {data.inventory.map((item) => (
                  <div
                    key={item.blood_group}
                    className={`rounded-lg p-4 text-center ${item.status === "critical"
                        ? "bg-red-100"
                        : item.status === "low"
                          ? "bg-yellow-50"
                          : "bg-green-50"
                      }`}
                  >
                    <Droplet
                      className={`mx-auto h-8 w-8 ${item.status === "critical"
                          ? "text-red-600"
                          : item.status === "low"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                    />
                    <p className="mt-2 text-2xl font-bold">
                      {item.blood_group}
                    </p>
                    <p className="text-lg font-medium">{item.units} units</p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${item.status === "critical"
                          ? "bg-red-600"
                          : item.status === "low"
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center px-6 py-4 border-t border-gray-200">
              <button className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Update Inventory
              </button>
            </div>
          </div>
        )}
        {activeTab === "donations" && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Recent Donations
              </h3>
              <p className="text-sm text-gray-500">
                Latest blood donations received
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {data.recentDonations?.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className={`mr-4 rounded-full bg-red-100 p-2`}>
                        <Droplet className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.donor}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.date).toLocaleDateString()} •{" "}
                          {donation.blood_group} • {donation.units} unit
                        </p>
                      </div>
                    </div>
                    <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Export Records
              </button>
              <button className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Record New Donation
              </button>
            </div>
          </div>
        )}

        {activeTab === "drives" && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Blood Drives
              </h3>
              <p className="text-sm text-gray-500">
                Upcoming blood donation events
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {data.upcomingDrives?.map((drive) => (
                  <div
                    key={drive.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-red-100 p-2">
                          <Calendar className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{drive.location}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(drive.date).toLocaleDateString()} •{" "}
                            {drive.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-lg font-medium">Organize a Blood Drive</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Host a blood donation event at your organization or community
                </p>
                <button className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Schedule a Drive
                </button>
              </div>
            </div>
            <div className="flex items-center px-6 py-4 border-t border-gray-200">
              <button className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                View All Blood Drives
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
