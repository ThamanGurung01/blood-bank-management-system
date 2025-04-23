"use client"
import { insertBloodDonation } from "@/actions/bloodDonationActions";
import IValidation from "@/types/validationTypes";
import { fromValidation } from "@/utils/validation";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function page() {

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [existingDonor, setExistingDonor] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<IValidation>();

  const handleDonor = () => {
    setExistingDonor((c) => !c);
  }
  const handleSubmit = async (e: React.FormEvent) => {
try {
  e.preventDefault();
  const formdata = new FormData(e.target as HTMLFormElement);
  const validation = fromValidation(formdata, existingDonor?"existing_blood_donation":"new_blood_donation");
  const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
  setValidationErrors(errors);
  if(!errors){
if(existingDonor){
  const bloodDonationData=await insertBloodDonation(formdata,"existing_blood_donation");
  console.log(bloodDonationData);
}else if(!existingDonor){
  const bloodDonationData=await insertBloodDonation(formdata,"new_blood_donation");
  console.log(bloodDonationData);
}
  }
} catch (error:any) {
  throw new Error(error.message);
}
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl initialPage">
      <h2 className="text-2xl font-bold mb-4">Blood Donation Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="select-none cursor-pointer" onClick={handleDonor}>{existingDonor ? "new Donor" : "existing Donor"}</p>
        </div>

        {existingDonor ? (
         <>
          <div>
            <label className="block font-semibold">Donor ID</label>
            <input
              type="text"
              name="donor_id"
              className="w-full p-2 border rounded"
              placeholder="DON-1043064479-123"
            />
          </div>
          {validationErrors?.donor_id?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.donor_id?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
         </>
        ):(
        <>
        <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              name="donor_name"
              className="w-full p-2 border rounded"
              placeholder="John Doe"
            />
          </div>
          {validationErrors?.donor_name?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.donor_name?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
          <div>
            <label className="block font-semibold">Contact</label>
            <input
              type="text"
              name="donor_contact"
              className="w-full p-2 border rounded"
              placeholder="9876343210"
            />
          </div>
          {validationErrors?.donor_contact?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.donor_contact?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
        </>
        )

        }
        <div>
            <label className="block font-semibold">Address</label>
            <input
              type="text"
              name="donor_address"
              className="w-full p-2 border rounded"
              placeholder="City"
            />
          </div>
          {validationErrors?.donor_address?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.donor_address?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

        <div>
          <label className="block font-semibold">Blood Group</label>
          <select
            name="blood_type"
            className="w-full p-2 border rounded"
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
        {validationErrors?.blood_type?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.blood_type?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

        <div>
          <label className="block font-semibold">Donation Type</label>
          <select
            name="donation_type"
            className="w-full p-2 border rounded"
          >
            <option value="">Select Donation Type</option>
            <option value="whole_blood">Whole Blood</option>
            <option value="rbc">Red Blood Cells (RBC)</option>
            <option value="platelets">Platelets</option>
            <option value="plasma">Plasma</option>
            <option value="cryoprecipitate">Cryoprecipitate</option>
          </select>
        </div>
        {validationErrors?.donation_type?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.donation_type?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

        <div>
          <label className="block font-semibold">Quantity (Units)</label>
          <input
            type="number"
            name="blood_quantity"
            className="w-full p-2 border rounded"
            placeholder="1"
          />
        </div>
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

        <div>
          <label className="block font-semibold">Collected Date</label>
          <input
            type="date"
            name="collected_date"
            className="w-full p-2 border rounded"
          />
        </div>
        {validationErrors?.collected_date?.[0] && (
                            <div className="rounded-md bg-red-50 p-2">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {validationErrors?.collected_date?.[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}



        <button type="submit" className="w-full p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
