"use client"
import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle, XCircle, Loader2, Filter, ChevronDown, Search, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBloodRequest } from "@/actions/bloodRequestActions";
// import { getBloodRequests } from "@/actions/bloodRequestActions";

const page = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<{
    bloodRequestId: string;
    patientName: string;
    blood_group: string;
    blood_component: string;
    blood_quantity: number;
    createdAt: string;
    requestDate: string;
    status: string;
    hospitalName: string;
    priority: string;
  }[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<{
    bloodRequestId: string;
    patientName: string;
    blood_group: string;
    blood_component: string;
    blood_quantity: number;
    createdAt: string;
    requestDate: string;
    status: string;
    hospitalName: string;
    priority: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    component: "",
    dateRange: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const mockRequests = [
    {
      id: "BBR-123456",
      patientName: "John Doe",
      bloodGroup: "A+",
      component: "Whole Blood",
      quantity: 2,
      requestedDate: "2025-04-28",
      requiredDate: "2025-05-05",
      status: "pending",
      hospitalName: "City General Hospital",
      priority: "Normal"
    },
    {
      id: "BBR-123457",
      patientName: "Sarah Jones",
      bloodGroup: "O-",
      component: "Platelets",
      quantity: 1,
      requestedDate: "2025-04-25",
      requiredDate: "2025-04-30",
      status: "approved",
      hospitalName: "Memorial Medical Center",
      priority: "Urgent"
    },
    {
      id: "BBR-123458",
      patientName: "Robert Smith",
      bloodGroup: "B+",
      component: "Red Blood Cells",
      quantity: 3,
      requestedDate: "2025-04-20",
      requiredDate: "2025-04-27",
      status: "completed",
      hospitalName: "University Hospital",
      priority: "Normal"
    },
    {
      id: "BBR-123459",
      patientName: "Emma Wilson",
      bloodGroup: "AB+",
      component: "Plasma",
      quantity: 1,
      requestedDate: "2025-04-15",
      requiredDate: "2025-04-18",
      status: "rejected",
      hospitalName: "St. Mary's Medical Center",
      priority: "Urgent"
    },
    {
      id: "BBR-123460",
      patientName: "Michael Brown",
      bloodGroup: "A-",
      component: "Whole Blood",
      quantity: 2,
      requestedDate: "2025-04-10",
      requiredDate: "2025-04-15",
      status: "completed",
      hospitalName: "Regional Medical Center",
      priority: "Normal"
    }
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const BloodRequests = await getBloodRequest();
        const data=BloodRequests?.data;

        setRequests(data || []);
        applyFilters(data, activeTab, filters, searchTerm);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load blood requests. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching blood requests:", err);
      }
    };

    fetchRequests();
  }, [activeTab]);

  const applyFilters = (data: any, tab: any, currentFilters: any, search: any) => {
    let filtered = [...data];

    if (tab === "active") {
      filtered = filtered.filter(req => ["Pending", "Approved"].includes(req.status));
    } else if (tab === "completed") {
      filtered = filtered.filter(req => req.status === "Completed");
    } else if (tab === "rejected") {
      filtered = filtered.filter(req => req.status === "Rejected");
    }

    if (currentFilters.bloodGroup) {
      filtered = filtered.filter(req => req.bloodGroup === currentFilters.bloodGroup);
    }

    if (currentFilters.component) {
      filtered = filtered.filter(req => req.component === currentFilters.component);
    }

    if (currentFilters.dateRange === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filtered = filtered.filter(req => new Date(req.requestedDate) >= lastMonth);
    } else if (currentFilters.dateRange === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filtered = filtered.filter(req => new Date(req.requestedDate) >= lastWeek);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(req =>
        req.patientName.toLowerCase().includes(searchLower) ||
        req.bloodRequestId.toLowerCase().includes(searchLower) ||
        req.hospitalName.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    applyFilters(requests, tab, filters, searchTerm);
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(requests, activeTab, newFilters, searchTerm);
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(requests, activeTab, filters, value);
  };

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Loader2 size={12} className="mr-1 animate-spin" />
            Processing
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: any) => {
    if (priority === "Urgent") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Urgent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Normal
      </span>
    );
  };
  return (
    <div className="bg-gray-50 p-6 min-h-screen initialPage">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Blood Requests</h1>
          <Link href="blood-request/create">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
              <Plus size={20} className="mr-2" />
              New Request
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "active"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => handleTabChange("active")}
              >
                Active Requests
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "completed"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => handleTabChange("completed")}
              >
                Completed
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "rejected"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => handleTabChange("rejected")}
              >
                Rejected
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => handleTabChange("all")}
              >
                All Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name, reference ID or hospital..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="relative">
              <button
                className="px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={18} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-2" />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Requests</h3>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={filters.bloodGroup}
                      onChange={handleFilterChange}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">All Blood Groups</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Component
                    </label>
                    <select
                      name="component"
                      value={filters.component}
                      onChange={handleFilterChange}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">All Components</option>
                      <option value="Whole Blood">Whole Blood</option>
                      <option value="Red Blood Cells">Red Blood Cells</option>
                      <option value="Platelets">Platelets</option>
                      <option value="Plasma">Plasma</option>
                      <option value="Cryoprecipitate">Cryoprecipitate</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <select
                      name="dateRange"
                      value={filters.dateRange}
                      onChange={handleFilterChange}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="all">All Time</option>
                      <option value="month">Last Month</option>
                      <option value="week">Last Week</option>
                    </select>
                  </div>

                  <button
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none"
                    onClick={() => {
                      setFilters({
                        bloodGroup: "",
                        component: "",
                        dateRange: "all"
                      });
                      applyFilters(requests, activeTab, {
                        bloodGroup: "",
                        component: "",
                        dateRange: "all"
                      }, searchTerm);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Loading blood requests...</p>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No blood requests found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "active"
                  ? "You don't have any active blood requests."
                  : activeTab === "completed"
                    ? "You don't have any completed blood requests."
                    : activeTab === "rejected"
                      ? "You don't have any rejected blood requests."
                      : "No blood requests match your search criteria."}
              </p>
              <Link href="/blood-request/new">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
                  <Plus size={18} className="mr-2" />
                  Create New Request
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request,index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.bloodRequestId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.patientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.blood_group}</div>
                        <div className="text-sm text-gray-500">{request.blood_component} ({request.blood_quantity} units)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.hospitalName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div>Requested: {new Date(request.createdAt).toLocaleDateString()}</div>
                          <div>Required: {new Date(request.requestDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`blood-request/${request.bloodRequestId}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </Link>
                        {request.status === "pending" && (
                          <Link href={`blood-request/${request.bloodRequestId}/edit`} className="text-gray-600 hover:text-gray-900">
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page