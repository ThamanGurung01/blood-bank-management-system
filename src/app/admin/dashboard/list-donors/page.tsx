"use client"
import { useEffect, useState } from "react";
import { Search, Filter, User, Droplet, Trash2, Edit } from "lucide-react";
import { deleteDonor, getAllDonor, updateDonor } from "@/actions/donorActions";
import { IDonor } from "@/models/donor.models";
import DonorUpdateModal from "@/components/DonorDetailsModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
export interface Donor extends Omit<IDonor, 'user' | '_id'> {
  _id: string;
  user: {
    name: string;
    email: string;
    role: "donor" | "blood_bank";
  };
}
const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [availability, setAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState<string>('');
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = bloodType === "" || donor.blood_group === bloodType;
    const matchesAvailability =
      availability === "" ||
      (availability === "available" && donor.status) ||
      (availability === "unavailable" && !donor.status);

    return matchesSearch && matchesBloodType && matchesAvailability;
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const handleUpdate = async (donorId: string, updatedData: Partial<Donor>) => {
    const res = await updateDonor(donorId, updatedData);
    if (res.success) {
      setDonors((prev) =>
        prev.map((donor) =>
          donor._id === donorId ? { ...donor, ...res.data } : donor
        )
      );
    } else {
      console.error(res.message);
    }
  };
  const fetchRequests = async () => {
    try {
      const donorData = await getAllDonor();
      const data = donorData?.data;
      setDonors(data || []);
    } catch (err) {
      console.error("Error fetching blood requests:", err);
    }
    setSelectedDonor(null);
  };

  const handleDelete = async (donorId: string) => {
      setIsDeleteModalOpen(false);
        if (!donorId) return;
        const response = await deleteDonor(donorId);
        if (response?.success) {
          setDonors((prevDonors) =>
            prevDonors.filter((donor) => donor._id !== donorId)
          );
        } else {
          console.error(response.message);
        }
    setSelectedDonorId('');
  }

  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="bg-gray-50 p-10 min-h-screen initialPage">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Donors</h1>
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
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                >
                  <option value="">All Blood Types</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Donation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="text-gray-500" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{donor.user.name}</div>
                          <div className="text-sm text-gray-500">ID: {donor.donorId}</div>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${donor.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {donor.status ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor?.last_donation_date ? new Date(donor.last_donation_date).toISOString().split("T")[0] : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDonor(donor)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => {
                        setIsDeleteModalOpen(true)
                        setSelectedDonorId(donor._id);
                      }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No donors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {selectedDonor &&
            <DonorUpdateModal
              donor={selectedDonor ? selectedDonor : {} as Donor}
              isOpen={Boolean(selectedDonor)}
              onClose={() => setSelectedDonor(null)}
              onUpdate={handleUpdate}
            />

          }
        </div>
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedDonorId(''); }}
          onConfirm={() => handleDelete(selectedDonorId)}
          itemName="Event"
        />
      </div>
    </div>
  );
}

export default Page