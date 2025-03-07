"use client";
import type React from "react";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Upload, User, Mail, Lock, AlertCircle } from "lucide-react";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

const Form = ({ type }: { type: string }) => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
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
    toggleMap();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation would go here
    // This is just a placeholder for demonstration
    console.log("Form submitted");
  };

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
                    href="/login"
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
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
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

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
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
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
                  >
                    <option value="">Select your role</option>
                    <option value="donor">Donor</option>
                    <option value="blood_bank">Blood Bank</option>
                  </select>
                </div>

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
