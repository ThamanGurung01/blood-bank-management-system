'use client';

import { useState } from 'react';

interface BloodBank {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  bloodTypes: string[];
  capacity: number;
  currentStock: number;
  registeredDate: string;
  lastUpdated: string;
}

const page = () => {
    const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - replace with actual API call
  const bloodBanks: BloodBank[] = [
    {
      id: '1',
      name: 'City General Hospital Blood Bank',
      location: 'Downtown, Metro City',
      phone: '+1 (555) 123-4567',
      email: 'blood@citygeneral.com',
      status: 'active',
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      capacity: 500,
      currentStock: 324,
      registeredDate: '2023-01-15',
      lastUpdated: '2024-06-01'
    },
    {
      id: '2',
      name: 'Regional Medical Center',
      location: 'North District, Metro City',
      phone: '+1 (555) 234-5678',
      email: 'info@regionalmed.org',
      status: 'active',
      bloodTypes: ['A+', 'B+', 'O+', 'O-'],
      capacity: 300,
      currentStock: 89,
      registeredDate: '2023-03-22',
      lastUpdated: '2024-05-28'
    },
    {
      id: '3',
      name: 'Community Health Blood Bank',
      location: 'Eastside, Metro City',
      phone: '+1 (555) 345-6789',
      email: 'blood@communityhealth.net',
      status: 'pending',
      bloodTypes: ['A+', 'A-', 'O+'],
      capacity: 200,
      currentStock: 0,
      registeredDate: '2024-05-30',
      lastUpdated: '2024-05-30'
    },
    {
      id: '4',
      name: 'Metro Blood Services',
      location: 'West End, Metro City',
      phone: '+1 (555) 456-7890',
      email: 'contact@metroblood.com',
      status: 'active',
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'O+', 'O-'],
      capacity: 750,
      currentStock: 523,
      registeredDate: '2022-11-08',
      lastUpdated: '2024-06-02'
    },
    {
      id: '5',
      name: 'University Hospital Blood Center',
      location: 'University District, Metro City',
      phone: '+1 (555) 567-8901',
      email: 'bloodcenter@university.edu',
      status: 'suspended',
      bloodTypes: ['A+', 'B+', 'O+'],
      capacity: 400,
      currentStock: 156,
      registeredDate: '2023-07-12',
      lastUpdated: '2024-04-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockLevel = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 70) return { color: 'bg-green-500', level: 'High' };
    if (percentage >= 30) return { color: 'bg-yellow-500', level: 'Medium' };
    return { color: 'bg-red-500', level: 'Low' };
  };

  const filteredAndSortedBanks = bloodBanks
    .filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bank.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bank.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'stock':
          return b.currentStock - a.currentStock;
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });
  return (
     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blood Banks Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all registered blood banks in the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{bloodBanks.length}</div>
            <div className="text-sm text-gray-600">Total Blood Banks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {bloodBanks.filter(b => b.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {bloodBanks.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {bloodBanks.filter(b => b.status === 'suspended').length}
            </div>
            <div className="text-sm text-gray-600">Suspended</div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Blood Banks
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                id="sort"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
                <option value="stock">Stock Level</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedBanks.map((bank) => {
            const stockInfo = getStockLevel(bank.currentStock, bank.capacity);
            const stockPercentage = Math.round((bank.currentStock / bank.capacity) * 100);
            
            return (
              <div key={bank.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {bank.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      📍 {bank.location}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bank.status)}`}>
                    {bank.status.charAt(0).toUpperCase() + bank.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    📞 {bank.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    ✉️ {bank.email}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Blood Stock</span>
                    <span className="text-sm text-gray-600">
                      {bank.currentStock} / {bank.capacity} units ({stockPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stockInfo.color}`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs font-medium ${
                      stockInfo.level === 'High' ? 'text-green-600' :
                      stockInfo.level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stockInfo.level} Stock Level
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Available Blood Types:</span>
                  <div className="flex flex-wrap gap-1">
                    {bank.bloodTypes.map((type) => (
                      <span key={type} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Registered: {new Date(bank.registeredDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      View Details
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

        {filteredAndSortedBanks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blood banks found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {filteredAndSortedBanks.length > 0 && (
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