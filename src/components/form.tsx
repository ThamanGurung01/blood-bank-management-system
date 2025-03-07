"use client";
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/map'), { ssr: false });

const Form = ({ type }: { type: string }) => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

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
}    
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
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <h1>{type}</h1>
      <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col">
        {type !== "login" && (
          <>
            <label htmlFor="profile_picture">
              Profile Picture:
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </label>
            {preview ? (
              <img
                src={preview}
                alt="Selected Profile"
                className="w-32 h-32 object-cover mt-2 rounded-full border-2"
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src="/defaultProfile.png"
                alt="Default Profile"
                className="w-32 h-32 object-cover mt-2 rounded-full border-2"
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
              />
            )}
            <label htmlFor="name" className="">
              Name:
              <input type="text" id="name" name="name" />
            </label>
          </>
        )}
        <label htmlFor="email" className="">
          Email:
          <input type="email" id="email" name="email" />
        </label>
        <label htmlFor="password" className="">
          Password:
          <input type="password" id="password" name="password" />
        </label>
        {type !== "login" && (
          <>
            <label htmlFor="role" className="">
              Role:
              <select name="role" id="role" className='text-center'>
                <option value="">-</option>
                <option value="donor">Donor</option>
                <option value="blood_bank">Blood Bank</option>
              </select>
            </label>
            <label htmlFor="location">
              Location:
              <button type="button" onClick={handleGetLocation} className='px-5'>
              Get Current Location
            </button>
            <button type='button' onClick={toggleMap} className='mx-5'>Manual Location</button>
            {showMap && <Map onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }} />}
            </label>
          </>
        )}
        <button type="submit">{type}</button>
      </form>
      <span>{latitude}, {longitude}</span>
    </div>
  );
}

export default Form;