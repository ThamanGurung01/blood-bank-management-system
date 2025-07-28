"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Upload,
  User,
  Mail,
  Lock,
  AlertCircle,
  Contact,
  Building,
  MapPinned,
} from "lucide-react";
import { fromValidation } from "@/utils/validation";
import IValidation from "@/types/validationTypes";
import { ACCEPTED_IMAGE_TYPES } from "@/utils/validation";
import { createUser } from "@/actions/userActions";
import { getSession, signIn } from "next-auth/react";
import { useSearchParams,useRouter } from "next/navigation";
import { uploadAllFile } from "@/actions/uploadFileActions";
import { toast } from "react-toastify";

export interface UploadResult {
  success: boolean;
  data?: {
    secure_url: string;
    public_id: string;
    resource_type: string;
  };
  error?: string;
}

const Map = dynamic(() => import("@/components/map"), { ssr: false });
const Form = ({ type }: { type: string }) => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownValue, setDropdownValue] = useState("");
  const [validationErrors, setValidationErrors] = useState<IValidation>();
  const searchParams=useSearchParams();
  const from = useSearchParams().get('from');
  const signinError=searchParams.get("error");
  const router=useRouter();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || undefined;
    setSelectedFile(file);
    if (file && ACCEPTED_IMAGE_TYPES.includes(file?.type || "")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setErrors({
            ...errors,
            location: "Failed to get your location. Please try again.",
          });
        }
      );
    } else {
      setErrors({
        ...errors,
        location: "Geolocation is not supported by this browser.",
      });
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target?.value;
    setDropdownValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formdata = new FormData(e.target as HTMLFormElement);
      const location = {
        latitude,
        longitude,
      };
      if (type === "signup") {
        formdata.append("location", JSON.stringify(location));
      }
      const validation = fromValidation(formdata, type);
      const errors: IValidation | undefined =
        validation?.error?.flatten().fieldErrors;
      setValidationErrors(errors);
      if (!errors) {
        if (type === "signup") {
          if (!selectedFile) {
            setValidationErrors((prev) => ({
              ...prev,
              profile_picture: ["Profile picture is required."],
            }));
            return;
          }
          const role = formdata.get("role");
          let folder: string | null = null;

  switch (role) {
    case "donor":
      folder = "donorProfile";
      break;
    case "blood_bank":
      folder = "bloodBankProfile";
      break;
    default:
      console.error("Invalid role specified");
      return;
  }
    const uploadFile: UploadResult = await uploadAllFile(selectedFile, folder);
    if(uploadFile.success&&uploadFile.data){
      formdata.append("profileImage", JSON.stringify({url:uploadFile.data.secure_url, publicId:uploadFile.data.public_id}));
      const response = await createUser(formdata);
    if(response?.success){
      toast.success("Account created successfully!",{
        theme:"colored",
      });
      setTimeout(() => {router.push("/");}, 1000);
    }
    }else {
      toast.error("Failed to upload profile image. Please try again.",{
        theme:"colored",
      });
    }
}else if(type==="login"){
const credentials=Object.fromEntries(formdata);
const res = await signIn("credentials", {
    ...credentials,
    redirect: false,
  });

  if (!res || !res.ok) {
if(res?.error==="Incorrect password") {setValidationErrors((prev) => ({
    ...prev,
    password: [res?.error || "Something went wrong"],
  }))}else{
    toast.error(res?.error || "Login failed. Please try again.",{
        theme:"colored",
      });
  }
    return;
  }

          const session = await getSession();
          const role = session?.user?.role;

  let destination = "/dashboard";
  if (role === "admin") {
    destination = "/admin/dashboard";
  } else if (role === "blood_bank") {
    destination = "/dashboard/";
  } else if(role === "donor"){
    destination = "/dashboard/find-donors";
  }
  
  toast.success("Login successful! Redirecting...",{
        theme:"colored",
      });
  setTimeout(() => {router.push(destination);}, 1000);
}
  }
} catch (error:any) {
  throw new Error(error.message);
}
  };

  useEffect(() => {
  if (from === 'protected') toast.error('Please login to continue',{
        theme:"colored",
      })
}, [from]);
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Column - Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {type === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {type === "login" ? (
                <>
                  Or{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    create a new account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/"
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            encType="multipart/form-data"
          >
            {type !== "login" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="profile_picture"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Profile Picture
                  </label>
                  <div
                    onClick={handleImageClick}
                    className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-red-500"
                  >
                    {preview ? (
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt="Selected Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">
                          Upload photo
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profile_picture"
                    name="profile_picture"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                {validationErrors?.profile_picture?.[0] && (
                  <div className="rounded-md bg-red-50 p-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {validationErrors?.profile_picture?.[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                {validationErrors?.name?.[0] && (
                  <div className="rounded-md bg-red-50 p-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {validationErrors?.name?.[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            {validationErrors?.email?.[0] && (
              <div className="rounded-md bg-red-50 p-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {validationErrors?.email?.[0]}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {validationErrors?.password?.[0] && (
                <div className="rounded-md bg-red-50 p-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {validationErrors?.password?.[0]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {type === "login" && (
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}
            </div>

            {type !== "login" && (
              <>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    id="role"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    onChange={handleOptionChange}
                    value={dropdownValue}
                  >
                    <option value="">Select your role</option>
                    <option value="donor">Donor</option>
                    <option value="blood_bank">Blood Bank</option>
                  </select>
                </div>
                {validationErrors?.role?.[0] && (
                  <div className="rounded-md bg-red-50 p-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {validationErrors?.role?.[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {dropdownValue === "donor" && (
                  <>
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Age
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          id="age"
                          name="age"
                          className="block w-full rounded-md border-gray-300 pl-4.5 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          placeholder="22"
                        />
                      </div>
                    </div>
                    {validationErrors?.age?.[0] && (
                      <div className="rounded-md bg-red-50 p-2">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              {validationErrors?.age?.[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="blood_group"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Blood Group
                      </label>
                      <select
                        name="blood_group"
                        id="blood_group"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
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
                  </>
                )}
                {dropdownValue === "blood_bank" && (
                  <>
                    <div>
                      <label
                        htmlFor="blood_bank"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Blood Bank
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="blood_bank"
                          name="blood_bank"
                          className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          placeholder="NRCS Blood Bank"
                        />
                      </div>
                    </div>
                    {validationErrors?.blood_bank?.[0] && (
                      <div className="rounded-md bg-red-50 p-2">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              {validationErrors?.blood_bank?.[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MapPinned className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="1234 Main St, City, Country"
                    />
                  </div>
                </div>
                {validationErrors?.address?.[0] && (
                  <div className="rounded-md bg-red-50 p-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {validationErrors?.address?.[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Contact className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="contact"
                      name="contact"
                      className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="9826853429"
                    />
                  </div>
                </div>
                {validationErrors?.contact?.[0] && (
                  <div className="rounded-md bg-red-50 p-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {validationErrors?.contact?.[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Current Location
                      </button>
                      <button
                        type="button"
                        onClick={toggleMap}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        {showMap ? "Hide Map" : "Manual Location"}
                      </button>
                    </div>

                    {errors.location && (
                      <div className="rounded-md bg-red-50 p-2">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              {errors.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {validationErrors?.location?.[0] && (
                      <div className="rounded-md bg-red-50 p-2">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              {validationErrors?.location?.[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {(latitude !== 0 || longitude !== 0) && (
                      <div className="rounded-md bg-gray-50 p-2 text-sm text-gray-700">
                        Coordinates: {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                      </div>
                    )}

                    {showMap && (
                      <div className="h-64 w-full overflow-hidden rounded-lg border border-gray-300">
                        <Map
                          onChange={(lat, lng) => {
                            setLatitude(lat);
                            setLongitude(lng);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {type === "login" ? "Sign in" : "Create account"}
              </button>
            </div>
            {signinError && (
              <div className="rounded-md bg-red-50 p-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{signinError}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden bg-red-600 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center">
        <div className="max-w-md px-8 text-center">
          <Image
            src="/donation-img.jpg"
            alt="Blood Donation"
            width={400}
            height={400}
            className="mx-auto bg-blend-color-burn bg-opacity-50 rounded-lg"
          />
          <h2 className="mt-6 text-3xl font-bold text-white">
            {type === "login" ? "Welcome back!" : "Join our community"}
          </h2>
          <p className="mt-2 text-white">
            Your donation can save up to three lives. Be a hero today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form;
