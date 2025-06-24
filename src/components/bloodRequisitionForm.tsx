"use client";
import { useState } from "react";
import { CheckCircle, AlertCircle, FileText, MoveLeft } from "lucide-react";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import IValidation from "@/types/validationTypes";
import { fromValidation } from "@/utils/validation";
import { insertBloodRequest } from "@/actions/bloodRequestActions";
import { useRouter } from "next/navigation";
import { UploadResult } from "./form";
import { uploadAllFile } from "@/actions/uploadFileActions";

interface Prop {
  formType: string;
}

const BloodRequisitionForm = ({formType}:Prop) => {
  const router=useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    hospitalName:"",
    hospitalAddress: "",
    blood_group: "",
    blood_quantity: 1,
    blood_component: "",
    priorityLevel: "Normal",
    requestDate: "",
    document: null,
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
    const [validationErrors, setValidationErrors] = useState<IValidation>();
    const [BloodReqResponse, setBloodReqResponse] = useState<any>(null);

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
        setFileError("File size exceeds 5MB limit");
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only PDF, JPEG, PNG, and DOC/DOCX files are allowed");
        return;
      }

      setFormData({
        ...formData,
        document: file
      });
      setFileName(file.name);
      setFileError("");
    }
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault();
   try {
    setFileError("");
    const formdata = new FormData();
    formdata.append("patientName", formData.patientName);
    formdata.append("contactNumber", formData.contactNumber);
    formdata.append("hospitalName", formData.hospitalName);
    formdata.append("hospitalAddress", formData.hospitalAddress);
    formdata.append("blood_group", formData.blood_group);
    formdata.append("blood_quantity", formData.blood_quantity.toString());
    formdata.append("blood_component", formData.blood_component);
    formdata.append("priorityLevel", formData.priorityLevel);
    formdata.append("requestDate", formData.requestDate);
    formdata.append("notes", formData.notes);
    if (formData.document) {
      formdata.append("document", formData.document);
    }
  const validation = fromValidation(formdata, "blood_request");
  const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
  setValidationErrors(errors);
  if(!errors&&!fileError){
    const file = formdata.get("document");
    if (file && file instanceof File) {
      const uploadFile: UploadResult = await uploadAllFile(file, "bloodRequestFile");
      const mimeType = file.type;
      if(uploadFile.success&&uploadFile.data){
        formdata.set("document", JSON.stringify({
        url: uploadFile.data.secure_url,
        publicId: uploadFile.data.public_id,
        fileType:mimeType,
        }));
      }else {
        formdata.set("document", JSON.stringify({
        url: '',
        publicId: '',
        fileType:'',
        }));
      }
    } else {
      setFileError("Please upload a valid file.");
      return;
    }
    const response:any=await insertBloodRequest(formdata);
    console.log("Response: ",response);
    setBloodReqResponse(response);

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  }else{
    console.log(errors);
  }
   } catch (error) {
    console.error("Error submitting form:", error);
   }
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      contactNumber: "",
      hospitalName:"",
      hospitalAddress: "",
      blood_group: "",
      blood_quantity: 1,
      blood_component: "",
      priorityLevel: "Normal",
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
                  <span className="text-gray-600">Blood Request Id:</span>
                  <span className="font-semibold">{BloodReqResponse?.data?.bloodRequestId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Requesting Blood Bank:</span>
                  <span className="font-semibold">{BloodReqResponse?.data?.bloodBankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Units Requested:</span>
                  <span className="font-semibold">{BloodReqResponse?.data?.blood_quantity}</span>
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
          <>
                  <div className="mb-6">
          <div className="flex justify-around"><h1 className="text-2xl font-bold text-gray-800">Blood Bank Requisition Form</h1> <button onClick={()=>router.push("/dashboard/blood-request")} className='flex justify-between border-2 border-gray-600 w-32 rounded-2xl px-5 py-2 cursor-pointer font-bold text-xl hover:text-white hover:bg-black transition-all duration-500'><MoveLeft className='mt-1'/>Back</button></div>
          <p className="text-gray-600 mt-1">
            Note*: If the request is emergency, please contact the blood bank directly.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div>
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
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {validationErrors?.patientName?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.patientName?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {validationErrors?.contactNumber?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.contactNumber?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hospitalName">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="hospitalName"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hospitalAddress">
                    Hospital Address / Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="hospitalAddress"
                      name="hospitalAddress"
                      value={formData.hospitalAddress}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {validationErrors?.hospitalName?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.hospitalName?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {validationErrors?.hospitalAddress?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.hospitalAddress?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
              </div>



              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="blood_group">
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="blood_group"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {validationErrors?.blood_group?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.blood_group?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {validationErrors?.blood_quantity?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.blood_quantity?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
                </div>
                <div  className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="blood_component">Blood Component <span className="text-red-500">*</span></label>
          <select
          value={formData.blood_component}
          onChange={handleInputChange}
            name="blood_component"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Donation Type</option>
            <option value="whole_blood">Whole Blood</option>
            <option value="rbc">Red Blood Cells (RBC)</option>
            <option value="platelets">Platelets</option>
            <option value="plasma">Plasma</option>
            <option value="cryoprecipitate">Cryoprecipitate</option>
          </select>
        </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {validationErrors?.blood_component?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.blood_component?.[0]}
                                  </p>
                                </div>
                              </div>
                              
                            </div>
                          )}
                          </div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="requestDate">
                      Required Date <span className="text-red-500">*</span>
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
                      />
                    </div>
                  </div>
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

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {validationErrors?.requestDate?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.requestDate?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {validationErrors?.priorityLevel?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.priorityLevel?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
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
                <div className="mb-4">
                {validationErrors?.notes?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.notes?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Upload Blood Requisition Document <span className="text-red-500">*</span>
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
                <div className="mb-4">
                {validationErrors?.document?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.document?.[0]} <br/> If you don't have one, please consult with the doctor or the hospital.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
              </div>

              {fileError && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
                  <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-red-600">{fileError}</p>
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
          </>
        )}
      </div>
    </div>
  )
}

export default BloodRequisitionForm