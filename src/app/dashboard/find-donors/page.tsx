"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search, Filter, User, Droplet, X, Phone, MapPin } from "lucide-react";
import { getAllDonor, getRecommendedDonors } from "@/actions/donorActions";
import type { IDonor } from "@/models/donor.models";
import { log } from "console";
import Image from "next/image";

interface Donor extends Omit<IDonor, "user"> {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [availability, setAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [showRecommended, setShowRecommended] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("A+");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBloodType =
      bloodType === "" || donor.blood_group === bloodType;
    const matchesAvailability =
      availability === "" ||
      (availability === "available" && donor.status) ||
      (availability === "unavailable" && !donor.status);
    return matchesSearch && matchesBloodType && matchesAvailability;
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const fetchRequests = async () => {
    try {
      if (showRecommended) {
        const BloodRequests = await getRecommendedDonors(selectedBloodGroup);
        const data = BloodRequests?.data;
        const updatedData: Donor[] = (data || []).map((item: any) => ({
          donorId: item.donorId ?? item._id ?? "",
          blood_group: item.blood_group,
          age: item.age,
          location: item.location,
          status: item.status,
          last_donation_date: item.last_donation_date,
          contact: item.contact,
          user: {
            name: item.user?.name ?? "",
            email: item.user?.email ?? "",
            role: item.user?.role ?? "",
          },
          ...item,
        }));
        setDonors(updatedData || []);
      } else if (!showRecommended) {
        const BloodRequests = await getAllDonor();
        const data = BloodRequests?.data;
        const updatedData = (data || []).map((item: Donor) => ({
          ...item,
          updatedStatus: item.status,
        }));
        setDonors(updatedData || []);
      }
    } catch (err) {
      console.error("Error fetching blood requests:", err);
    }
  };

  const handleBloodGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBloodGroup(e.target.value);
  };

  const handleRowClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  useEffect(() => {
    if (showRecommended && selectedBloodGroup) {
      fetchRequests();
    } else if (!showRecommended) {
      fetchRequests();
    }
  }, [showRecommended, selectedBloodGroup]);

  return (
    <div className="bg-gray-50 p-10 min-h-screen initialPage">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Find Donor</h1>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => {
              const newState = !showRecommended;
              setShowRecommended(newState);
              if (!newState) {
                setSelectedBloodGroup("A+");
              }
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {showRecommended ? "Show All Donors" : "Show Recommended Donors"}
          </button>
          {showRecommended && (
            <select
              value={selectedBloodGroup}
              onChange={handleBloodGroupChange}
              className="border p-2 rounded"
              disabled={!showRecommended}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search donors by name..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <button
              className="ml-2 px-4 py-2 bg-gray-200 rounded-lg flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-1" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                >
                  <option value="">All Blood Types</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Donors List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Eligible Donation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleRowClick(donor)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {/* <User className="text-gray-500" size={20} />
                           */}
                          <Image
                            src={
                              donor?.profileImage?.url ||"/defaultProfile.png"||
                              "/placeholder.svg?height=40&width=40" 
                            }
                            alt={`Donor ${donor.donorId}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donor.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {donor.donorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Droplet size={18} className="mr-2 text-red-500" />
                        <span className="font-medium">{donor.blood_group}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          donor.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donor.status ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor?.next_eligible_donation_date
                        ? new Date(donor.next_eligible_donation_date)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor.contact}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No donors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && selectedDonor && (
          <div className="fixed inset-0 bg-gray-300/65 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Image
                        src={
                          selectedDonor?.profileImage?.url||"/defaultProfile.png" ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={`Donor ${selectedDonor.donorId}`}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedDonor.user.name}
                      </h2>
                      <p className="text-blue-100">
                        Donor ID: {selectedDonor.donorId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-gray-50 text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Information */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Droplet className="mr-2 text-red-500" size={20} />
                      Blood Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Group:</span>
                        <span className="font-medium text-red-600">
                          {selectedDonor.blood_group}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            selectedDonor.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedDonor.status ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Next Eligible Donation:
                        </span>
                        <span className="font-medium text-gray-800">
                          {selectedDonor?.next_eligible_donation_date
                            ? new Date(
                                selectedDonor?.next_eligible_donation_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="mr-2 text-blue-500" size={20} />
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium text-gray-800">
                          {selectedDonor.age || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium text-gray-800 capitalize">
                          {selectedDonor.user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Phone className="mr-2 text-green-500" size={20} />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-800">
                          {selectedDonor?.contact || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-800">
                          {selectedDonor?.user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="mr-2 text-purple-500" size={20} />
                      Location
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            Longitude:{" "}
                            {selectedDonor?.location.longitude || "N/A"}
                          </span>
                          <span className="font-medium text-gray-800">
                            Latitude:{" "}
                            {selectedDonor?.location.latitude || "N/A"}
                          </span>

                          <span className="font-medium text-gray-800">
                            Address : {selectedDonor?.address || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => {
                      if (selectedDonor?.user?.email) {
                        window.open(
                          `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            selectedDonor.user.email
                          )}`,
                          "_blank"
                        );
                      }
                    }}
                  >
                    Contact Donor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
