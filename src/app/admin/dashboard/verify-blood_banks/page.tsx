'use client';

import { useState } from 'react';

interface PendingBloodBank {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  registrationNumber: string;
  licenseNumber: string;
  capacity: number;
  operatingHours: string;
  director: {
    name: string;
    qualification: string;
    experience: string;
  };
  facilities: string[];
  equipment: string[];
  certifications: string[];
  documents: {
    license: string;
    registration: string;
    inspection: string;
    insurance: string;
  };
  submittedDate: string;
  requestedBy: string;
  priority: 'high' | 'medium' | 'low';
  inspectionRequired: boolean;
  notes: string;
}

export default function page() {
  const [selectedBank, setSelectedBank] = useState<PendingBloodBank | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submitted');
  const [verificationNotes, setVerificationNotes] = useState('');

  const pendingBanks: PendingBloodBank[] = [
    {
      id: '1',
      name: 'Metro Health Blood Services',
      location: 'Central District, Metro City',
      address: '123 Healthcare Ave, Metro City, MC 12345',
      phone: '+1 (555) 789-0123',
      email: 'admin@metrohealthblood.com',
      website: 'www.metrohealthblood.com',
      registrationNumber: 'MHB-2024-001',
      licenseNumber: 'BL-MC-789456',
      capacity: 400,
      operatingHours: '24/7',
      director: {
        name: 'Dr. Sarah Mitchell',
        qualification: 'MD, Hematology',
        experience: '12 years'
      },
      facilities: ['Blood Collection', 'Processing Lab', 'Storage Facility', 'Testing Lab'],
      equipment: ['Centrifuge', 'Blood Bank Refrigerators', 'Platelet Agitators', 'Cell Washers'],
      certifications: ['ISO 15189', 'AABB Accredited', 'FDA Registered'],
      documents: {
        license: 'license_001.pdf',
        registration: 'registration_001.pdf',
        inspection: 'inspection_001.pdf',
        insurance: 'insurance_001.pdf'
      },
      submittedDate: '2024-05-28',
      requestedBy: 'Dr. Sarah Mitchell',
      priority: 'high',
      inspectionRequired: true,
      notes: 'New facility with state-of-the-art equipment. Requires site inspection.'
    },
    {
      id: '2',
      name: 'Community Care Blood Bank',
      location: 'Riverside, Metro City',
      address: '456 Community Blvd, Metro City, MC 12346',
      phone: '+1 (555) 890-1234',
      email: 'info@communitycareblood.org',
      registrationNumber: 'CCB-2024-002',
      licenseNumber: 'BL-MC-456789',
      capacity: 250,
      operatingHours: '8:00 AM - 6:00 PM',
      director: {
        name: 'Dr. Michael Rodriguez',
        qualification: 'MD, Transfusion Medicine',
        experience: '8 years'
      },
      facilities: ['Blood Collection', 'Basic Processing', 'Storage'],
      equipment: ['Basic Centrifuge', 'Standard Refrigerators', 'Testing Equipment'],
      certifications: ['State Licensed', 'Basic Certification'],
      documents: {
        license: 'license_002.pdf',
        registration: 'registration_002.pdf',
        inspection: 'inspection_002.pdf',
        insurance: 'insurance_002.pdf'
      },
      submittedDate: '2024-05-25',
      requestedBy: 'Dr. Michael Rodriguez',
      priority: 'medium',
      inspectionRequired: false,
      notes: 'Expanding existing clinic services to include blood banking.'
    },
    {
      id: '3',
      name: 'Regional Emergency Blood Center',
      location: 'Industrial Zone, Metro City',
      address: '789 Emergency Way, Metro City, MC 12347',
      phone: '+1 (555) 901-2345',
      email: 'contact@regionalemergency.net',
      registrationNumber: 'REB-2024-003',
      licenseNumber: 'BL-MC-123789',
      capacity: 600,
      operatingHours: '24/7',
      director: {
        name: 'Dr. Jennifer Park',
        qualification: 'MD, Emergency Medicine',
        experience: '15 years'
      },
      facilities: ['Blood Collection', 'Processing Lab', 'Storage Facility', 'Testing Lab', 'Mobile Units'],
      equipment: ['Advanced Centrifuge', 'Automated Testing Systems', 'Mobile Collection Units'],
      certifications: ['ISO 15189', 'AABB Accredited', 'FDA Registered', 'Emergency Response Certified'],
      documents: {
        license: 'license_003.pdf',
        registration: 'registration_003.pdf',
        inspection: 'inspection_003.pdf',
        insurance: 'insurance_003.pdf'
      },
      submittedDate: '2024-05-30',
      requestedBy: 'Dr. Jennifer Park',
      priority: 'high',
      inspectionRequired: true,
      notes: 'Specialized in emergency blood supply. Critical for regional disaster response.'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAndSortedBanks = pendingBanks
    .filter(bank => {
      const matchesSearch = 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.director.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || bank.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'submitted':
          return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });

  const handleApprove = (bankId: string) => {
    console.log('Approving bank:', bankId, 'Notes:', verificationNotes);
    setVerificationNotes('');
    setSelectedBank(null);
  };

  const handleReject = (bankId: string) => {
    console.log('Rejecting bank:', bankId, 'Notes:', verificationNotes);
    setVerificationNotes('');
    setSelectedBank(null);
  };

  const handleRequestMoreInfo = (bankId: string) => {
    console.log('Requesting more info for bank:', bankId, 'Notes:', verificationNotes);
    setVerificationNotes('');
    setSelectedBank(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blood Bank Verification
          </h1>
          <p className="text-gray-600">
            Review and verify pending blood bank applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{pendingBanks.length}</div>
            <div className="text-sm text-gray-600">Pending Applications</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {pendingBanks.filter(b => b.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {pendingBanks.filter(b => b.inspectionRequired).length}
            </div>
            <div className="text-sm text-gray-600">Require Inspection</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {pendingBanks.reduce((sum, b) => sum + b.capacity, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Capacity</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Applications
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, location, or director..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                id="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                id="sort"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="submitted">Submission Date</option>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedBanks.map((bank) => (
            <div key={bank.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {bank.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    📍 {bank.location}
                  </p>
                  <p className="text-xs text-gray-500">
                    {bank.address}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(bank.priority)}`}>
                    {bank.priority.charAt(0).toUpperCase() + bank.priority.slice(1)} Priority
                  </span>
                  {bank.inspectionRequired && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded border border-orange-200">
                      Inspection Required
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="text-gray-600">
                  📞 {bank.phone}
                </div>
                <div className="text-gray-600">
                  ✉️ {bank.email}
                </div>
                <div className="text-gray-600">
                  🏥 Capacity: {bank.capacity} units
                </div>
                <div className="text-gray-600">
                  🕐 {bank.operatingHours}
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Director Information</h4>
                <div className="text-sm text-gray-600">
                  <div><strong>{bank.director.name}</strong></div>
                  <div>{bank.director.qualification}</div>
                  <div>{bank.director.experience} experience</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Registration Details</h4>
                <div className="text-sm text-gray-600">
                  <div>Registration: {bank.registrationNumber}</div>
                  <div>License: {bank.licenseNumber}</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Facilities & Equipment</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {bank.facilities.slice(0, 3).map((facility, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {facility}
                    </span>
                  ))}
                  {bank.facilities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{bank.facilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-1">
                  {bank.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {bank.notes && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Notes</h4>
                  <p className="text-sm text-yellow-700">{bank.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Submitted: {new Date(bank.submittedDate).toLocaleDateString()}
                  <br />
                  By: {bank.requestedBy}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    onClick={() => setSelectedBank(bank)}
                  >
                    Review Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedBanks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {selectedBank && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verification Review: {selectedBank.name}
                  </h2>
                  <button 
                    onClick={() => setSelectedBank(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedBank.name}</div>
                      <div><strong>Location:</strong> {selectedBank.location}</div>
                      <div><strong>Address:</strong> {selectedBank.address}</div>
                      <div><strong>Phone:</strong> {selectedBank.phone}</div>
                      <div><strong>Email:</strong> {selectedBank.email}</div>
                      {selectedBank.website && (
                        <div><strong>Website:</strong> {selectedBank.website}</div>
                      )}
                      <div><strong>Capacity:</strong> {selectedBank.capacity} units</div>
                      <div><strong>Operating Hours:</strong> {selectedBank.operatingHours}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Director Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedBank.director.name}</div>
                      <div><strong>Qualification:</strong> {selectedBank.director.qualification}</div>
                      <div><strong>Experience:</strong> {selectedBank.director.experience}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBank.facilities.map((facility, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBank.equipment.map((equipment, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBank.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="text-sm font-medium text-gray-900">License</div>
                      <div className="text-xs text-blue-600">{selectedBank.documents.license}</div>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="text-sm font-medium text-gray-900">Registration</div>
                      <div className="text-xs text-blue-600">{selectedBank.documents.registration}</div>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="text-sm font-medium text-gray-900">Inspection</div>
                      <div className="text-xs text-blue-600">{selectedBank.documents.inspection}</div>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="text-sm font-medium text-gray-900">Insurance</div>
                      <div className="text-xs text-blue-600">{selectedBank.documents.insurance}</div>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Notes</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Add your verification notes here..."
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedBank(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleRequestMoreInfo(selectedBank.id)}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                  >
                    Request More Info
                  </button>
                  <button 
                    onClick={() => handleReject(selectedBank.id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedBank.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}