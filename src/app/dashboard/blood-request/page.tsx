"use client"
import { useState } from "react";
import { CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
const page = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    address: "",
    blood_group: "",
    blood_quantity: 1,
    priorityLevel: "normal",
    requestDate: "",
    document: null,
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e: any) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData({
      ...formData,
      [name]: numValue
    });
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF, JPEG, PNG, and DOC/DOCX files are allowed");
        return;
      }

      setFormData({
        ...formData,
        document: file
      });
      setFileName(file.name);
      setError("");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    if (!formData.patientName || !formData.contactNumber || !formData.requestDate) {
      setError("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      contactNumber: "",
      address: "",
      blood_group: "",
      blood_quantity: 1,
      priorityLevel: "normal",
      requestDate: "",
      document: null,
      notes: ""
    });
    setFileName("");
    setIsSubmitted(false);
  };

  return (
    <div className="bg-gray-50 p-10 ml-10 min-h-screen initialPage">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Blood Bank Requisition Form</h1>
          <p className="text-gray-600 mt-1">
            Request blood units from the central blood supply management system
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Requisition Submitted Successfully</h2>
              <p className="text-gray-600 mb-6">
                Your blood requisition has been received and is being processed. You will receive a confirmation shortly.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Reference Number:</span>
                  <span className="font-semibold">BBR-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Requesting Blood Bank:</span>
                  <span className="font-semibold">NCRS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Units Requested:</span>
                  <span className="font-semibold">1</span>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="patientName">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contactNumber">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                      Blood Group
                    </label>
                    <select
                      name="blood_type"
                      value={formData.blood_group}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select your Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>



              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label >Quantity (Units)</label>
                    <input
                      type="number"
                      name="blood_quantity"
                      value={formData.blood_quantity}
                      onChange={handleNumberChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priorityLevel">
                      Priority Level
                    </label>
                    <select
                      id="priorityLevel"
                      name="priorityLevel"
                      value={formData.priorityLevel}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="requestDate">
                      Required By Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="requestDate"
                        name="requestDate"
                        value={formData.requestDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Any special requirements or instructions..."
                  ></textarea>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Upload Supporting Document (Optional)
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PDF, DOC, DOCX, JPG or PNG (Max. 5MB)
                    </p>

                    <input
                      type="file"
                      id="document"
                      name="document"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />

                    <button
                      type="button"
                      onClick={() => document.getElementById('document')?.click()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Select File
                    </button>

                    {fileName && (
                      <div className="mt-4 text-sm text-gray-600">
                        <span className="font-medium">Selected File:</span> {fileName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
                  <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => resetForm()}
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Ring2
                      size="20"
                      stroke="5"
                      strokeLength="0.25"
                      bgOpacity="0.1"
                      speed="0.8"
                      color="white"
                    />
                    <span className="ml-3">Processing...</span>
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default page