// "use client"
// import { insertBloodDonation } from "@/actions/bloodDonationActions";
// import IValidation from "@/types/validationTypes";
// import { fromValidation } from "@/utils/validation";
// import { AlertCircle } from "lucide-react";
// import { useRef, useState } from "react";

// export default function page() {

//   const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
//   const [existingDonor, setExistingDonor] = useState<boolean>(true);
//   const [validationErrors, setValidationErrors] = useState<IValidation>();
// const formRef = useRef<HTMLFormElement>(null);
//   const handleDonor = () => {
//     setExistingDonor((c) => !c);
//     formRef.current?.reset();
//         setValidationErrors(undefined);
//   }
//   const handleSubmit = async (e: React.FormEvent) => {
//     try {
//       e.preventDefault();
//       const formdata = new FormData(e.target as HTMLFormElement);
//       const validation = fromValidation(formdata, existingDonor ? "existing_blood_donation" : "new_blood_donation");
//       const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
//       setValidationErrors(errors);
//       if (!errors) {
//         if (existingDonor) {
//           const bloodDonationData = await insertBloodDonation(formdata, "existing_blood_donation");
//           console.log(bloodDonationData);
//         } else if (!existingDonor) {
//           const bloodDonationData = await insertBloodDonation(formdata, "new_blood_donation");
//           console.log(bloodDonationData);
//         }
//         formRef.current?.reset();
//         setValidationErrors(undefined);
//       } else {
//         console.log(errors);
//       }
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl initialPage">
//       <h2 className="text-2xl font-bold mb-4">Blood Donation Form</h2>
//       <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <p className="select-none cursor-pointer" onClick={handleDonor}>{existingDonor ? "new Donor" : "existing Donor"}</p>
//         </div>

//         {existingDonor ? (
//           <>
//             <div>
//               <label className="block font-semibold">Donor ID</label>
//               <input
//                 type="text"
//                 name="donor_id"
//                 className="w-full p-2 border rounded"
//                 placeholder="DON-1043064479-123"
//               />
//             </div>
//             {validationErrors?.donor_id?.[0] && (
//               <div className="rounded-md bg-red-50 p-2">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-red-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">
//                       {validationErrors?.donor_id?.[0]}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             <div>
//               <label className="block font-semibold">Name</label>
//               <input
//                 type="text"
//                 name="donor_name"
//                 className="w-full p-2 border rounded"
//                 placeholder="John Doe"
//               />
//             </div>
//             {validationErrors?.donor_name?.[0] && (
//               <div className="rounded-md bg-red-50 p-2">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-red-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">
//                       {validationErrors?.donor_name?.[0]}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div>
//               <label className="block font-semibold">Contact</label>
//               <input
//                 type="text"
//                 name="donor_contact"
//                 className="w-full p-2 border rounded"
//                 placeholder="9876343210"
//               />
//             </div>
//             {validationErrors?.donor_contact?.[0] && (
//               <div className="rounded-md bg-red-50 p-2">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-red-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">
//                       {validationErrors?.donor_contact?.[0]}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )

//         }
//         <div>
//           <label className="block font-semibold">Address</label>
//           <input
//             type="text"
//             name="donor_address"
//             className="w-full p-2 border rounded"
//             placeholder="City"
//           />
//         </div>
//         {validationErrors?.donor_address?.[0] && (
//           <div className="rounded-md bg-red-50 p-2">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   {validationErrors?.donor_address?.[0]}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <label className="block font-semibold">Blood Group</label>
//           <select
//             name="blood_type"
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Select your Blood Group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//           </select>
//         </div>
//         {validationErrors?.blood_type?.[0] && (
//           <div className="rounded-md bg-red-50 p-2">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   {validationErrors?.blood_type?.[0]}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <label className="block font-semibold">Donation Type</label>
//           <select
//             name="donation_type"
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Select Donation Type</option>
//             <option value="whole_blood">Whole Blood</option>
//             <option value="rbc">Red Blood Cells (RBC)</option>
//             <option value="platelets">Platelets</option>
//             <option value="plasma">Plasma</option>
//             <option value="cryoprecipitate">Cryoprecipitate</option>
//           </select>
//         </div>
//         {validationErrors?.donation_type?.[0] && (
//           <div className="rounded-md bg-red-50 p-2">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   {validationErrors?.donation_type?.[0]}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <label className="block font-semibold">Quantity (Units)</label>
//           <input
//             type="number"
//             name="blood_quantity"
//             className="w-full p-2 border rounded"
//             placeholder="1"
//           />
//         </div>
//         {validationErrors?.blood_quantity?.[0] && (
//           <div className="rounded-md bg-red-50 p-2">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   {validationErrors?.blood_quantity?.[0]}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <label className="block font-semibold">Collected Date</label>
//           <input
//             type="date"
//             name="collected_date"
//             className="w-full p-2 border rounded"
//             min="2000-01-01"
//   max={new Date().toISOString().split("T")[0]}
//           />
//         </div>
//         {validationErrors?.collected_date?.[0] && (
//           <div className="rounded-md bg-red-50 p-2">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   {validationErrors?.collected_date?.[0]}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <button type="submit" className="w-full p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import type React from "react";

import { insertBloodDonation } from "@/actions/bloodDonationActions";
import type IValidation from "@/types/validationTypes";
import { fromValidation } from "@/utils/validation";
import {
  AlertCircle,
  Droplet,
  Heart,
  User,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useRef, useState } from "react";

export default function BloodDonationPage() {
  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [existingDonor, setExistingDonor] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<IValidation>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDonor = () => {
    setExistingDonor((c) => !c);
    formRef.current?.reset();
    setValidationErrors(undefined);
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      setIsSuccess(false);

      const formdata = new FormData(e.target as HTMLFormElement);
      const validation = fromValidation(
        formdata,
        existingDonor ? "existing_blood_donation" : "new_blood_donation"
      );
      const errors: IValidation | undefined =
        validation?.error?.flatten().fieldErrors;
      setValidationErrors(errors);

      if (!errors) {
        if (existingDonor) {
          const bloodDonationData = await insertBloodDonation(
            formdata,
            "existing_blood_donation"
          );
          console.log(bloodDonationData);
        } else if (!existingDonor) {
          const bloodDonationData = await insertBloodDonation(
            formdata,
            "new_blood_donation"
          );
          console.log(bloodDonationData);
        }
        formRef.current?.reset();
        setValidationErrors(undefined);
        setIsSuccess(true);
      } else {
        console.log(errors);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Blood Donation Registration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Register a new blood donation in the system
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Heart className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">
              Donation Information
            </h2>
            <button
              type="button"
              onClick={handleDonor}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              {existingDonor ? (
                <>
                  <User className="h-4 w-4 text-gray-500" />
                  Switch to New Donor
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4" />
                  Switch to Existing Donor
                </>
              )}
            </button>
          </div>
        </div>

        {isSuccess && (
          <div className="mx-6 mt-6 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-800">
            <div className="rounded-full bg-green-100 p-1">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Donation Registered Successfully</h3>
              <p className="text-sm">
                The blood donation has been successfully recorded in the system.
              </p>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {existingDonor ? (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Donor ID
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="donor_id"
                    className={`block w-full rounded-lg border ${
                      validationErrors?.donor_id
                        ? "border-red-300"
                        : "border-gray-300"
                    } bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                    placeholder="DON-1043064479-123"
                  />
                </div>
                {validationErrors?.donor_id?.[0] && (
                  <p className="mt-2 text-sm text-red-600">
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                    {validationErrors?.donor_id?.[0]}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    name="donor_name"
                    className={`block w-full rounded-lg border ${
                      validationErrors?.donor_name
                        ? "border-red-300"
                        : "border-gray-300"
                    } bg-gray-50 p-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                    placeholder="John Doe"
                  />
                  {validationErrors?.donor_name?.[0] && (
                    <p className="mt-2 text-sm text-red-600">
                      <AlertCircle className="mr-1 inline h-4 w-4" />
                      {validationErrors?.donor_name?.[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="donor_contact"
                    className={`block w-full rounded-lg border ${
                      validationErrors?.donor_contact
                        ? "border-red-300"
                        : "border-gray-300"
                    } bg-gray-50 p-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                    placeholder="9876343210"
                  />
                  {validationErrors?.donor_contact?.[0] && (
                    <p className="mt-2 text-sm text-red-600">
                      <AlertCircle className="mr-1 inline h-4 w-4" />
                      {validationErrors?.donor_contact?.[0]}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="donor_address"
                className={`block w-full rounded-lg border ${
                  validationErrors?.donor_address
                    ? "border-red-300"
                    : "border-gray-300"
                } bg-gray-50 p-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                placeholder="City, State, Country"
              />
              {validationErrors?.donor_address?.[0] && (
                <p className="mt-2 text-sm text-red-600">
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  {validationErrors?.donor_address?.[0]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Droplet className="h-5 w-5 text-red-500" />
                </div>
                <select
                  name="blood_type"
                  className={`block w-full rounded-lg border ${
                    validationErrors?.blood_type
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                >
                  <option value="">Select Blood Group</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {validationErrors?.blood_type?.[0] && (
                <p className="mt-2 text-sm text-red-600">
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  {validationErrors?.blood_type?.[0]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Donation Type
              </label>
              <select
                name="donation_type"
                className={`block w-full rounded-lg border ${
                  validationErrors?.donation_type
                    ? "border-red-300"
                    : "border-gray-300"
                } bg-gray-50 p-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500`}
              >
                <option value="">Select Donation Type</option>
                <option value="whole_blood">Whole Blood</option>
                <option value="rbc">Red Blood Cells (RBC)</option>
                <option value="platelets">Platelets</option>
                <option value="plasma">Plasma</option>
                <option value="cryoprecipitate">Cryoprecipitate</option>
              </select>
              {validationErrors?.donation_type?.[0] && (
                <p className="mt-2 text-sm text-red-600">
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  {validationErrors?.donation_type?.[0]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity (Units)
              </label>
              <input
                type="number"
                name="blood_quantity"
                className={`block w-full rounded-lg border ${
                  validationErrors?.blood_quantity
                    ? "border-red-300"
                    : "border-gray-300"
                } bg-gray-50 p-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                placeholder="1"
                min="1"
              />
              {validationErrors?.blood_quantity?.[0] && (
                <p className="mt-2 text-sm text-red-600">
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  {validationErrors?.blood_quantity?.[0]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Collection Date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="collected_date"
                  className={`block w-full rounded-lg border ${
                    validationErrors?.collected_date
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500`}
                  min="2000-01-01"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              {validationErrors?.collected_date?.[0] && (
                <p className="mt-2 text-sm text-red-600">
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  {validationErrors?.collected_date?.[0]}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>All fields are required</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Register Donation"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-xl bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Droplet className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Blood Donation Guidelines
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Donors must be at least 18 years old and in good health
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Minimum weight of 50kg (110 lbs) is required
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Must not have donated whole blood in the last 56 days
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Must not have any active infections or serious chronic illnesses
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
