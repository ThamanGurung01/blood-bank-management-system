"use client"
import React, { useEffect, useState } from 'react';
import { User, Phone, Droplet, X, Save } from 'lucide-react';
import { Donor } from '@/app/admin/dashboard/list-donors/page';

interface DonorFormData {
  name: string;
  password: string;
  blood_group: string;
  age: number;
  contact: string;
  status: boolean;
}

interface DonorUpdateModalProps {
  donor: Donor;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (donorId: string, updatedData: Partial<Donor>) => Promise<void>;
}

const DonorUpdateModal: React.FC<DonorUpdateModalProps> = ({ donor, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<DonorFormData>({
    name: '',
    password: '',
    blood_group: '',
    age: 0,
    contact: '',
    status: false
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSave = () => {
    onUpdate(donor._id, formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: donor.user.name,
      password: '',
      blood_group: donor.blood_group,
      age: donor.age,
      contact: donor.contact,
      status: donor.status
    });
    onClose();
  };

  useEffect(() => {
    if (donor) {
      setFormData({
        name: donor.user?.name,
        password: '',
        blood_group: donor.blood_group,
        age: donor.age,
        contact: donor.contact,
        status: donor.status
      });
    }
  }, [donor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Update Donor</h2>
                <p className="text-sm text-gray-600">{donor.user.name} - {donor.donorId}</p>
              <p className="text-sm text-gray-600">{donor.user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: (e.target.value).toString() })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: (e.target.value).toString() })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                min="18"
                max="65"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Donor
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DonorUpdateModal;