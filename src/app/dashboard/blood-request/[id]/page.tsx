"use client";
import React, { useEffect, useState } from 'react';
import { FileText, ArrowLeft, Download, Printer, Clock, CheckCircle } from 'lucide-react';
import { use } from 'react';
import { getUserBloodRequest } from '@/actions/bloodRequestActions';
import { IBlood_Request } from '@/models/blood_request.models';

interface Props {
  params: Promise<{ id: string }>;
}
interface Blood_Request extends Omit<IBlood_Request, "blood_bank"> {
  blood_bank: {
    blood_bank: string;
    contact: string;
  };
  createdAt: Date;
}

const page = ({ params }: Props) => {
  const { id } = use(params);
  const [data, setData] = useState<Blood_Request>();
  const [showBloodbankDetails, setShowBloodbankDetails] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const mimeToExt: Record<string, string> = {
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };

  const Data = {
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

  const getStatusBadge = (status: "Pending" | "Approved" | "Successful" | "Unsuccessful" | "Rejected") => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-blue-100 text-blue-800",
      Successful: "bg-green-100 text-green-800",
      Unsuccessful: "bg-red-100 text-red-500",
      Rejected: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };
  function appendFlAttachment(url: string): string {
  return url.replace('/upload/', '/upload/fl_attachment:bloodDocumentFile/');
}
  const fetchBloodRequestDetails = async (id: string) => {
    const response = await getUserBloodRequest(id);
    setData(response.data);
    const document = response?.data?.document;
    if (!document) return;
    const fileUrl = document?.url;
    const mimeType = document?.fileType;
    const extension = mimeToExt[mimeType];
    setFileName(`bloodRequestFile.${extension}`);
    setDownloadUrl(appendFlAttachment(fileUrl));
    // console.log(extension ? `${fileUrl}.${extension}` : fileUrl);
    console.log(fileUrl)
    console.log(appendFlAttachment(fileUrl));
    console.log(mimeType);
    console.log(extension);
    console.log(`bloodRequestFile.${extension}`);
  }
  useEffect(() => {
    if (id) {
      fetchBloodRequestDetails(id);
    }
  }, [id]);
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 initialPage">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => window.history.back()} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2" size={20} />
          Back to Requisitions
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Blood Requisition Details</h1>
            <p className="text-gray-600 mt-1">
              Request ID: <span className="font-medium">{data?.bloodRequestId}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            {data?.status && ["Pending", "Approved", "Successful", "Unsuccessful", "Rejected"].includes(data.status)
              ? getStatusBadge(data.status as "Pending" | "Approved" | "Successful" | "Unsuccessful" | "Rejected")
              : getStatusBadge("Pending")}
            <span className="text-sm text-gray-500 mt-2 flex items-center">
              <Clock size={14} className="mr-1" />
              Submitted: {data?.createdAt ? new Date(data.createdAt).toLocaleString() : ""}
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
                  <p className="font-medium">{data?.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{data?.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital Name</p>
                  <p className="font-medium">{data?.hospitalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital/Delivery Address</p>
                  <p className="font-medium">{data?.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Blood Request Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">{data?.blood_group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity (Units)</p>
                    <p className="font-medium">{data?.blood_quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Component</p>
                  <p className="font-medium">{formatBloodComponent(data?.blood_component as keyof typeof formats)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Required Date</p>
                    <p className="font-medium">{data?.requestDate ? new Date(data.requestDate).toLocaleDateString() : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority Level</p>
                    <p className="font-medium">{data?.priorityLevel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Bank</p>
                  <p className="font-medium">{data?.blood_bank.blood_bank}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Additional Information</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notes</p>
                <p className="bg-gray-50 p-3 rounded">{data?.notes || "No additional notes provided."}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Blood Bank Note</h2>
                <p className="bg-gray-50 p-3 rounded">{data?.bloodBankNotes || "No notes from the blood bank."}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Requisition Document</p>
                {downloadUrl ? (
                  <a href={downloadUrl}
                    download={fileName}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText className="text-gray-400 mr-3" size={24} />
                  <div>
                    <p className="font-medium">Blood_Requisition_Document</p>
                    <p className="text-sm text-gray-500">Click to view or download</p>
                  </div>
                  </a>
                  ) : (<p>No file available</p>)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setShowBloodbankDetails(true)}>

              Contact Blood Bank
            </button>
          </div>
        </div>
        {showBloodbankDetails && (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h2 className="text-lg font-semibold mb-4">Blood Bank Contact Details</h2>
              <p className="text-sm text-gray-600">Blood Bank Name: {data?.blood_bank.blood_bank}</p>
              <p className="text-sm text-gray-600">Contact Number: {data?.blood_bank.contact || "Not available"}</p>
              <button onClick={() => setShowBloodbankDetails(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
}
export default page