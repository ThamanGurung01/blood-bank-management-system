"use client";
import React from 'react';
import { FileText, ArrowLeft, Download, Printer, Clock, CheckCircle } from 'lucide-react';
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}
  
  const page=({ params }: Props)=> {
    const { id } = use(params);
  console.log(id);
  const data = {
    bloodRequestId: "REQ-2025050501",
    status: "Approved" as "Approved" | "Pending" | "Processing" | "Rejected", // or "Pending", "Processing", "Rejected"
    patientName: "John Doe",
    contactNumber: "123-456-7890",
    hospitalName: "City General Hospital",
    hospitalAddress: "123 Medical Center Dr, Healthcare City, HC 12345",
    blood_group: "O+",
    blood_quantity: 2,
    blood_component: "whole_blood",
    requestDate: "2025-05-10",
    priorityLevel: "Urgent",
    notes: "Patient is scheduled for surgery on 2025-05-12. Requires fresh units.",
    bloodBankName: "Central Blood Bank",
    documentUrl: "#",
    submittedDate: "2025-05-05",
    lastUpdated: "2025-05-06",
  };

  const formats = {
    whole_blood: "Whole Blood",
    rbc: "Red Blood Cells (RBC)",
    platelets: "Platelets",
    plasma: "Plasma",
    cryoprecipitate: "Cryoprecipitate"
  };

  const formatBloodComponent = (component: keyof typeof formats) => {
    return formats[component] || component;
  };

  const getStatusBadge = (status: "Pending" | "Processing" | "Approved" | "Rejected") => {
      const statusStyles = {
        Pending: "bg-yellow-100 text-yellow-800",
        Processing: "bg-blue-100 text-blue-800",
        Approved: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
      };
      
      return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
          {status}
        </span>
      );
    };
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 initialPage">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => window.history.back()} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2" size={20} />
          Back to Requisitions
        </button>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Download size={18} className="mr-2" />
            Download
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Printer size={18} className="mr-2" />
            Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Blood Requisition Details</h1>
            <p className="text-gray-600 mt-1">
              Request ID: <span className="font-medium">{data.bloodRequestId}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            {getStatusBadge(data.status)}
            <span className="text-sm text-gray-500 mt-2 flex items-center">
              <Clock size={14} className="mr-1" />
              Submitted: {data.submittedDate}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Patient Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-medium">{data.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{data.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital Name</p>
                  <p className="font-medium">{data.hospitalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital/Delivery Address</p>
                  <p className="font-medium">{data.hospitalAddress}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Blood Request Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">{data.blood_group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity (Units)</p>
                    <p className="font-medium">{data.blood_quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Component</p>
                  <p className="font-medium">{formatBloodComponent(data.blood_component as keyof typeof formats)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Required Date</p>
                    <p className="font-medium">{data.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority Level</p>
                    <p className="font-medium">{data.priorityLevel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Bank</p>
                  <p className="font-medium">{data.bloodBankName}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Additional Information</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notes</p>
                <p className="bg-gray-50 p-3 rounded">{data.notes || "No additional notes provided."}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Requisition Document</p>
                <a href={data.documentUrl} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FileText className="text-gray-400 mr-3" size={24} />
                  <div>
                    <p className="font-medium">Blood_Requisition_Document.pdf</p>
                    <p className="text-sm text-gray-500">Click to view or download</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Status Timeline</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Request Submitted</p>
                  <p className="text-sm text-gray-500">{data.submittedDate}, 10:30 AM</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Processing Started</p>
                  <p className="text-sm text-gray-500">{data.submittedDate}, 11:45 AM</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Request Approved</p>
                  <p className="text-sm text-gray-500">{data.lastUpdated}, 9:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <p className="text-sm text-gray-500">Last Updated: {data.lastUpdated}</p>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Contact Blood Bank
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              Track Status
            </button>
          </div>
        </div>
      </div>
    </div>

    );
  }
  export default page