"use client"
import IValidation from "@/types/validationTypes";
import { fromValidation } from "@/utils/validation";
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
}else{
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

        {existingDonor && (
          <div>
            <label className="block font-semibold">Donor ID</label>
            <input
              type="text"
              name="donor_id"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )

        }

        <div>
          <label className="block font-semibold">Blood Type</label>
          <select
            name="blood_type"
            className="w-full p-2 border rounded"
            required
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
          <label className="block font-semibold">Donation Type</label>
          <select
            name="donation_type"
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Donation Type</option>
            <option value="whole_blood">Whole Blood</option>
            <option value="rbc">Red Blood Cells (RBC)</option>
            <option value="platelets">Platelets</option>
            <option value="plasma">Plasma</option>
            <option value="cryoprecipitate">Cryoprecipitate</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Quantity (Units)</label>
          <input
            type="number"
            name="blood_quantity"
            className="w-full p-2 border rounded"
            min={1}
            placeholder="1"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Collected Date</label>
          <input
            type="date"
            name="collected_date"
            className="w-full p-2 border rounded"
            required
          />
        </div>



        <button type="submit" className="w-full p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
