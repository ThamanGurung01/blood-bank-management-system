'use client';

import { useState } from 'react';

interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodType: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  status: 'active' | 'inactive' | 'restricted';
  registeredDate: string;
  lastDonation: string | null;
  totalDonations: number;
  eligibleTodonate: boolean;
  nextEligibleDate: string | null;
  medicalConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
  };
}

const page = () => {
   const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - replace with actual API call
  const donors: Donor[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      bloodType: 'O+',
      age: 28,
      gender: 'male',
      location: 'Downtown, Metro City',
      status: 'active',
      registeredDate: '2023-01-15',
      lastDonation: '2024-04-15',
      totalDonations: 8,
      eligibleTodonate: true,
      nextEligibleDate: null,
      medicalConditions: [],
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 123-4568'
      }
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 234-5678',
      bloodType: 'A-',
      age: 34,
      gender: 'female',
      location: 'North District, Metro City',
      status: 'active',
      registeredDate: '2022-08-22',
      lastDonation: '2024-05-20',
      totalDonations: 12,
      eligibleTodonate: false,
      nextEligibleDate: '2024-07-20',
      medicalConditions: [],
      emergencyContact: {
        name: 'Carlos Garcia',
        phone: '+1 (555) 234-5679'
      }
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Johnson',
      email: 'david.johnson@email.com',
      phone: '+1 (555) 345-6789',
      bloodType: 'B+',
      age: 45,
      gender: 'male',
      location: 'Eastside, Metro City',
      status: 'restricted',
      registeredDate: '2023-03-10',
      lastDonation: '2023-12-05',
      totalDonations: 3,
      eligibleTodonate: false,
      nextEligibleDate: '2024-08-15',
      medicalConditions: ['Hypertension'],
      emergencyContact: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 345-6790'
      }
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 456-7890',
      bloodType: 'AB-',
      age: 26,
      gender: 'female',
      location: 'West End, Metro City',
      status: 'active',
      registeredDate: '2024-01-08',
      lastDonation: null,
      totalDonations: 0,
      eligibleTodonate: true,
      nextEligibleDate: null,
      medicalConditions: [],
      emergencyContact: {
        name: 'Michael Chen',
        phone: '+1 (555) 456-7891'
      }
    },
    {
      id: '5',
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.williams@email.com',
      phone: '+1 (555) 567-8901',
      bloodType: 'O-',
      age: 52,
      gender: 'male',
      location: 'University District, Metro City',
      status: 'active',
      registeredDate: '2021-11-30',
      lastDonation: '2024-03-10',
      totalDonations: 24,
      eligibleTodonate: true,
      nextEligibleDate: null,
      medicalConditions: [],
      emergencyContact: {
        name: 'Linda Williams',
        phone: '+1 (555) 567-8902'
      }
    },
    {
      id: '6',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 678-9012',
      bloodType: 'A+',
      age: 29,
      gender: 'female',
      location: 'South District, Metro City',
      status: 'inactive',
      registeredDate: '2023-06-18',
      lastDonation: '2023-09-22',
      totalDonations: 2,
      eligibleTodonate: true,
      nextEligibleDate: null,
      medicalConditions: [],
      emergencyContact: {
        name: 'Mark Anderson',
        phone: '+1 (555) 678-9013'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'restricted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      'A+': 'bg-blue-100 text-blue-800',
      'A-': 'bg-blue-200 text-blue-900',
      'B+': 'bg-purple-100 text-purple-800',
      'B-': 'bg-purple-200 text-purple-900',
      'AB+': 'bg-pink-100 text-pink-800',
      'AB-': 'bg-pink-200 text-pink-900',
      'O+': 'bg-red-100 text-red-800',
      'O-': 'bg-red-200 text-red-900'
    };
    return colors[bloodType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDonationLevel = (total: number) => {
    if (total >= 20) return { level: 'Champion', color: 'text-purple-600', icon: '👑' };
    if (total >= 10) return { level: 'Hero', color: 'text-gold-600', icon: '🏆' };
    if (total >= 5) return { level: 'Regular', color: 'text-blue-600', icon: '⭐' };
    if (total >= 1) return { level: 'Contributor', color: 'text-green-600', icon: '🎯' };
    return { level: 'New', color: 'text-gray-600', icon: '🆕' };
  };

  const filteredAndSortedDonors = donors
    .filter(donor => {
      const matchesSearch = 
        donor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBloodType = bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter;
      const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
      const matchesEligibility = eligibilityFilter === 'all' || 
        (eligibilityFilter === 'eligible' && donor.eligibleTodonate) ||
        (eligibilityFilter === 'ineligible' && !donor.eligibleTodonate);
      
      return matchesSearch && matchesBloodType && matchesStatus && matchesEligibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'bloodType':
          return a.bloodType.localeCompare(b.bloodType);
        case 'donations':
          return b.totalDonations - a.totalDonations;
        case 'age':
          return b.age - a.age;
        case 'registered':
          return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
        default:
          return 0;
      }
    });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Donors Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all registered blood donors in the system
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{donors.length}</div>
            <div className="text-sm text-gray-600">Total Donors</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {donors.filter(d => d.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {donors.filter(d => d.eligibleTodonate).length}
            </div>
            <div className="text-sm text-gray-600">Eligible</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {donors.reduce((sum, d) => sum + d.totalDonations, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {donors.filter(d => d.bloodType === 'O-').length}
            </div>
            <div className="text-sm text-gray-600">Universal Donors</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {donors.filter(d => d.totalDonations === 0).length}
            </div>
            <div className="text-sm text-gray-600">New Donors</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Donors
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, email, or location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <select
                id="bloodType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="restricted">Restricted</option>
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
                <option value="name">Name</option>
                <option value="bloodType">Blood Type</option>
                <option value="donations">Total Donations</option>
                <option value="age">Age</option>
                <option value="registered">Registration Date</option>
                <option value="location">Location</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eligibility
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eligibility"
                  value="all"
                  checked={eligibilityFilter === 'all'}
                  onChange={(e) => setEligibilityFilter(e.target.value)}
                  className="mr-2"
                />
                All
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eligibility"
                  value="eligible"
                  checked={eligibilityFilter === 'eligible'}
                  onChange={(e) => setEligibilityFilter(e.target.value)}
                  className="mr-2"
                />
                Eligible to Donate
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eligibility"
                  value="ineligible"
                  checked={eligibilityFilter === 'ineligible'}
                  onChange={(e) => setEligibilityFilter(e.target.value)}
                  className="mr-2"
                />
                Not Eligible
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedDonors.map((donor) => {
            const donationInfo = getDonationLevel(donor.totalDonations);
            
            return (
              <div key={donor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {donor.firstName} {donor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      📍 {donor.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(donor.status)}`}>
                      {donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBloodTypeColor(donor.bloodType)}`}>
                      {donor.bloodType}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="text-gray-600">
                    👤 Age: {donor.age}
                  </div>
                  <div className="text-gray-600">
                    🚻 {donor.gender.charAt(0).toUpperCase() + donor.gender.slice(1)}
                  </div>
                  <div className="text-gray-600">
                    📞 {donor.phone}
                  </div>
                  <div className="text-gray-600">
                    ✉️ {donor.email}
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Donation History</span>
                    <span className={`text-sm font-medium ${donationInfo.color} flex items-center gap-1`}>
                      {donationInfo.icon} {donationInfo.level}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Donations: <span className="font-medium">{donor.totalDonations}</span>
                  </div>
                  {donor.lastDonation && (
                    <div className="text-sm text-gray-600">
                      Last Donation: {new Date(donor.lastDonation).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  {donor.eligibleTodonate ? (
                    <div className="flex items-center text-green-600 text-sm">
                      ✅ Eligible to donate
                    </div>
                  ) : (
                    <div className="text-orange-600 text-sm">
                      ⏰ Next eligible: {donor.nextEligibleDate ? new Date(donor.nextEligibleDate).toLocaleDateString() : 'N/A'}
                    </div>
                  )}
                </div>

                {donor.medicalConditions.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-1">Medical Conditions:</span>
                    <div className="flex flex-wrap gap-1">
                      {donor.medicalConditions.map((condition, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4 text-sm text-gray-600">
                  <div className="font-medium">Emergency Contact:</div>
                  <div>{donor.emergencyContact.name} - {donor.emergencyContact.phone}</div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Registered: {new Date(donor.registeredDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      View Profile
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedDonors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {filteredAndSortedDonors.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50" disabled>
                Previous
              </button>
              <span className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded">1</span>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default page