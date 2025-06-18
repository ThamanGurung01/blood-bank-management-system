"use client"
import { useEffect, useState } from "react";
import { Search, Filter, User, Droplet, SquarePen, Edit, Trash2 } from "lucide-react";
import { IBlood_Bank } from "@/models/blood_bank.models";
import { deleteBloodBank, getAllBloodBanks } from "@/actions/bloodBankActions";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
interface BloodBank extends Omit<IBlood_Bank, 'user'> {
  user: {
    name: string;
    email: string;
    role: string;
  };
  createdAt?: string;
}
const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [verification, setVerification] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [bloodBanks, setBloodBank] = useState<BloodBank[]>([]);
  const [selectedBloodBank, setSelectedBloodBank] = useState<BloodBank>({} as BloodBank);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBloodBankId, setSelectedBloodBankId] = useState<string>('');
  const filteredBloodBanks = bloodBanks.filter(bloodBank => {
    const matchesSearch = bloodBank.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerification =
      verification === "" ||
      (verification === "verified" && bloodBank.verified) ||
      (verification === "unverified" && !bloodBank.verified);

    return matchesSearch && matchesVerification;
  });

  const fetchRequests = async () => {
    try {
      const BloodBankData = await getAllBloodBanks();
      const data = BloodBankData?.data;
      setBloodBank(data || []);
    } catch (err) {
      console.error("Error fetching blood requests:", err);
    }
  };
  const handleDelete = async (bloodBankId: string) => {
    setIsDeleteModalOpen(false);
    if (!bloodBankId) return;
    const response = await deleteBloodBank(bloodBankId);
    if (response?.success) {
      setBloodBank((prevBloodBank) =>
        prevBloodBank.filter((bloodBank) => bloodBank._id !== bloodBankId)
      );
    } else {
      console.error(response.message);
    }
    setSelectedBloodBankId('');
  }

  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="bg-gray-50 p-10 min-h-screen initialPage">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Blood Banks</h1>
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
              {/* <div className="flex-1">
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
              </div> */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Verifications</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={verification}
                  onChange={(e) => setVerification(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Bank Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBloodBanks.length > 0 ? (
                filteredBloodBanks.map((bloodBank, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="text-gray-500" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{bloodBank.user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bloodBank.blood_bank ? bloodBank.blood_bank : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bloodBank.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bloodBank.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bloodBank.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bloodBank?.createdAt ? new Date(bloodBank.createdAt).toISOString().split("T")[0] : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBloodBank(bloodBank)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                          setIsDeleteModalOpen(true)
                          setSelectedBloodBankId(bloodBank._id?.toString?.() ?? '');
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
          {/* {selectedBloodBank &&
            <DonorUpdateModal
              donor={selectedDonor ? selectedDonor : {} as Donor}
              isOpen={Boolean(selectedDonor)}
              onClose={() => setSelectedDonor(null)}
              onUpdate={handleUpdate}
            />

          } */}
        </div>
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedBloodBankId(''); }}
          onConfirm={() => handleDelete(selectedBloodBankId)}
          itemName="Event"
        />
      </div>
    </div>
  );
}

export default page