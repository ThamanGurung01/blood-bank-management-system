"use client"
import { useState,useEffect } from 'react';
import { Search, Filter, Calendar, User, Droplet, Clock, Check, X, AlertCircle } from 'lucide-react';
import { changeBloodRequestStatus, getBloodRequest } from '@/actions/bloodRequestActions';

interface BloodRequest {
bloodRequestId:string;
requestor:{
  user:{
    name:string;
  };
};
hospitalName:string;
blood_group:string;
blood_quantity:number;
blood_component:string;
createdAt:string;
requestDate:string;
priorityLevel:string;
status:string;
updatedStatus:string;
notes:string;
}

const page = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesSearch =
      request.requestor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.blood_group?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // interface Request {
  //   bloodRequestId: number;
  //   requestorName: string;
  //   requestorId: string;
  //   hospitalName: string;
  //   bloodType: string;
  //   quantity: number;
  //   units: string;
  //   urgency: string;
  //   requestDate: string;
  //   requiredDate: string;
  //   status: string;
  //   notes: string;
  // }

  const handleStatusChange = (requestId: string, newStatus: string): void => {
    const updatedRequests = requests.map((req: BloodRequest) =>
      req.bloodRequestId === requestId ? { ...req, updatedStatus: newStatus } : req
    )
    const updateSelectedRequest = updatedRequests.find((req: BloodRequest) => req.bloodRequestId === requestId);
      setSelectedRequest(updateSelectedRequest ?? null);

  };

  const handleRequestClick = (request: BloodRequest): void => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-gray-200 text-gray-800';
      case 'Approved': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-black text-white';
      case 'Rejected': return 'bg-gray-700 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Approved': return <Check className="w-4 h-4" />;
      case 'Completed': return <Check className="w-4 h-4" />;
      case 'Rejected': return <X className="w-4 h-4" />;
      default: return null;
    }
  };
      const fetchRequests = async () => {
      try {
        const BloodRequests = await getBloodRequest();
        const data=BloodRequests?.data;
const updatedData = (data || []).map((item: BloodRequest) => ({
  ...item,
  updatedStatus: item.status
}));
        // const data = mockRequests;
        setRequests(updatedData || []);
        console.log("Blood Requests: ", data);
      } catch (err) {
        console.error("Error fetching blood requests:", err);
      }
    };
  const updateStatusBloodRequest = async (requestId: string, status: string) => {
    try {
     const response=await changeBloodRequestStatus(requestId,status);
     console.log("Update Status Response: ",response);
     await fetchRequests();
     setShowModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-white initialPage">
      <div className="pt-6 pb-4 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Blood Bank Request Management</h1>
          <p className="text-sm text-gray-500">Current Date: May 6, 2025</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search requests..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-500 w-5 h-5" />
              <select
                className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Requestor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Required By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request,index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer hover:bg-gray-50 ${request.priorityLevel === "Urgent" ? 'bg-red-400 hover:bg-red-300' : ''}`}
                      onClick={() => handleRequestClick(request)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.requestor?.user.name}</div>
                            <div className={`text-sm  ${request.priorityLevel === "Urgent" ? 'text-black' : 'text-gray-500'}`}>ID: {request.bloodRequestId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.hospitalName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          <Droplet className="w-4 h-4 mr-1" />
                          {request.blood_group}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 text-center">{request.blood_quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1" />
                          {request.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1" />
                          {request.requestDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No requests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Previous</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-black text-white">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Next</button>
            </div>
          </div>
        </div>
      </main>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Request Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Requestor</p>
                  <p className="font-medium">{selectedRequest.requestor?.user?.name}</p>
                  <p className="text-sm text-gray-500">ID: {selectedRequest.bloodRequestId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hospital</p>
                  <p className="font-medium">{selectedRequest.hospitalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 mt-1">
                    <Droplet className="w-4 h-4 mr-1" />
                    {selectedRequest.blood_group}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{selectedRequest.blood_quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Urgency</p>
                  <p className={`font-medium ${selectedRequest.priorityLevel === 'Urgent' ? 'text-gray-900 font-bold' : selectedRequest.priorityLevel === 'Normal' ? 'text-gray-700' : 'text-gray-500'}`}>
                    {selectedRequest.priorityLevel}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.updatedStatus)} mt-1`}>
                    {getStatusIcon(selectedRequest.updatedStatus)}
                    <span className="ml-1">{selectedRequest.updatedStatus}</span>
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium">{selectedRequest.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Required By</p>
                  <p className="font-medium">{selectedRequest.requestDate}</p>
                </div>
              </div>

              <div className={!selectedRequest.notes ? 'hidden' : "mb-6"}>
                <p className="text-sm text-gray-500 mb-1">Request Notes</p>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedRequest.notes}</p>
              </div>

              <div className={selectedRequest.status === 'Rejected' ? 'hidden' : "border-t border-gray-200 pt-4"}>
                <p className="text-sm font-medium text-gray-700 mb-2">Update Status</p>
                <div className={selectedRequest.status === 'Rejected' ? 'hidden' : 'flex flex-wrap gap-2'}>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium ${selectedRequest.updatedStatus === 'Pending' ? 'bg-gray-200 text-gray-800 border-2 border-gray-400' : 'bg-gray-100 text-gray-800'}`}
                    onClick={() => handleStatusChange(selectedRequest.bloodRequestId, 'Pending')}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Pending
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium ${selectedRequest.updatedStatus === 'Approved' ? 'bg-gray-100 text-gray-800 border-2 border-gray-400' : 'bg-gray-100 text-gray-800'}`}
                    onClick={() => handleStatusChange(selectedRequest.bloodRequestId, 'Approved')}
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Approved
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium ${selectedRequest.updatedStatus === 'Completed' ? 'bg-black text-white border-2 border-gray-400' : 'bg-gray-100 text-gray-800'}`}
                    onClick={() => handleStatusChange(selectedRequest.bloodRequestId, 'Completed')}
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Completed
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium ${selectedRequest.updatedStatus === 'Rejected' ? 'bg-gray-700 text-white border-2 border-gray-400' : 'bg-gray-100 text-gray-800'}`}
                    onClick={() => handleStatusChange(selectedRequest.bloodRequestId, 'Rejected')}
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Rejected
                  </button>
                </div>
              </div>
            </div>

            <div className={selectedRequest.status === 'Rejected' ? 'hidden' : "px-6 py-3 border-t border-gray-200 flex justify-end"}>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={()=>updateStatusBloodRequest(selectedRequest.bloodRequestId,selectedRequest.updatedStatus)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default page