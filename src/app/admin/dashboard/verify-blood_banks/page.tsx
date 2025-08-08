"use client";
import React, { useEffect, useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Building2, Phone, Mail, User, Shield, Download } from 'lucide-react';
import { IBlood_Bank } from '@/models/blood_bank.models';
import { changeBloodBankVerification, getAllBloodBanks } from '@/actions/bloodBankActions';
import { appendFlAttachment } from '@/app/dashboard/blood-request/[id]/page';

interface BloodBank extends Omit<IBlood_Bank, 'user'> {
  user: {
    name: string;
    email: string;
    role: string;
  };
  createdAt?: string;
}

const Page = () => {
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('unverified');
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const filteredBanks = bloodBanks.filter(bank => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'verified') return bank.verified;
    if (filterStatus === 'unverified') return !bank.verified;
    return true;
  });

  const handleVerifyBank = async() => {
    if (selectedBank) {
      setBloodBanks(banks => banks.map(bank => 
        bank._id === selectedBank._id 
          ? { ...bank, verified: true }
          : bank
      ));
      setSelectedBank({ ...selectedBank, verified: true });
      if(!selectedBank.verified){
      await changeBloodBankVerification(String(selectedBank._id), true);
      }
    }
  };

  const handleUnverifyBank = async() => {
    if (selectedBank) {
      setBloodBanks(banks => banks.map(bank => 
        bank._id === selectedBank._id 
          ? { ...bank, verified: false }
          : bank
      ));
      setSelectedBank({ ...selectedBank, verified: false });
      if(selectedBank.verified){
      await changeBloodBankVerification(String(selectedBank._id), false);
      }
    }
  };

  const unverifiedCount = bloodBanks.filter(bank => !bank.verified).length;
  const verifiedCount = bloodBanks.filter(bank => bank.verified).length;
 
    const fetchRequests = async () => {
      try {
        const BloodBankData = await getAllBloodBanks();
        const data = BloodBankData?.data;
        setBloodBanks(data || []);
      } catch (err) {
        console.error("Error fetching blood requests:", err);
      }
    };
  
  
    useEffect(() => {
      fetchRequests();
    }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-xl">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blood Bank License Verification</h1>
                <p className="text-gray-600 mt-1">Review and verify blood bank license documents</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Unverified</p>
                <p className="text-2xl font-bold text-red-600">{unverifiedCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Blood Banks</h2>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'verified' | 'unverified')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="unverified">Unverified ({unverifiedCount})</option>
                  <option value="verified">Verified ({verifiedCount})</option>
                  <option value="all">All ({bloodBanks.length})</option>
                </select>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredBanks.map((bank,index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedBank?._id === bank._id ? 'bg-red-50 border-r-4 border-red-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{bank.blood_bank}</h3>
                        <p className="text-sm text-gray-600 mt-1">{bank.user.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Registered: {bank.createdAt ? new Date(bank.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        bank.verified 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-red-700 bg-red-100'
                      }`}>
                        {bank.verified ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Unverified</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedBank ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-8 h-8 text-red-600" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedBank.blood_bank}</h3>
                        <p className="text-gray-600">ID: {String(selectedBank._id)}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                      selectedBank.verified 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {selectedBank.verified ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">Unverified</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">          
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="text-gray-900">{selectedBank.contact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-900">{selectedBank.user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Manager</p>
                          <p className="text-gray-900">{selectedBank.user.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-red-600" />
                    License Document
                  </h4>

                  {selectedBank?.document?.url ? (
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                         Blood Bank Document
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a href={selectedBank.document?.url ? appendFlAttachment(selectedBank.document.url) : '#'}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>): (<p>No file available</p>)}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h4>
                  
                  <div className="flex items-center space-x-4">
                    {!selectedBank.verified ? (
                      <button
                        onClick={handleVerifyBank}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Verify Blood Bank</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleUnverifyBank}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Mark as Unverified</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {selectedBank.verified 
                        ? "This blood bank has been verified and can operate legally."
                        : "This blood bank is pending verification. Please review the license document before verifying."
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Blood Bank</h3>
                <p className="text-gray-600">
                  Choose a blood bank from the list to review their license document and verification status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDocumentViewer && selectedBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {/* <h3 className="text-lg font-semibold text-gray-900">{selectedBank.licenseDocument.name}</h3> */}
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">License Document Viewer</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {/* {selectedBank.licenseDocument.name} ({selectedBank.licenseDocument.size}) */} Doc
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {/* Uploaded: {new Date(selectedBank.licenseDocument.uploadDate).toLocaleDateString()} */} 2020
                  </p>
                  <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Download to View Full Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;