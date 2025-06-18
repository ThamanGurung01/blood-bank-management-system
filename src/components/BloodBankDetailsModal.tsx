import { BloodBank } from "@/app/admin/dashboard/list-blood_banks/page";
import { Building2, Edit, Phone, Save, X } from "lucide-react";
import { useState } from "react";

interface BloodBankFormData {
    name: string;
    password: string;
    blood_bank: string;
    contact: string;
}
interface BloodBankDetailModalProps {
    bloodBank: BloodBank;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (bloodBankId: string, updatedData: Partial<BloodBank>) => void;
}

const BloodBankDetailModal: React.FC<BloodBankDetailModalProps> = ({ bloodBank, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<BloodBankFormData>({
        name: bloodBank.user.name || '',
        password: '',
        blood_bank: bloodBank.blood_bank,
        contact: bloodBank.contact
    });

    const handleSave = () => {
        onUpdate(bloodBank._id as string, formData);
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            name: bloodBank.user.name || '',
            password: '',
            blood_bank: bloodBank.blood_bank,
            contact: bloodBank.contact
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{bloodBank.user.name}</h2>
                                <p className="text-sm text-gray-600">Blood Bank - {bloodBank.blood_bank}</p>
                                <p className="text-sm text-gray-600">{bloodBank.user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Bank Name</label>
                            <input
                                type="text"
                                value={formData.blood_bank}
                                onChange={(e) => setFormData({ ...formData, blood_bank: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Enter blood bank name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                            <input
                                type="tel"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Enter contact number"
                            />
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
        </div>
    );
};
export default BloodBankDetailModal;
