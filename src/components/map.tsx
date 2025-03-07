"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useRef, useState, useEffect } from "react";
import { LatLngExpression, Icon } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const Map = ({ onChange }: { onChange: (lat: number, lng: number) => void }) => {
  const centerPosition: LatLngExpression = [27.6719, 84.4265];
  const mapRef = useRef<any>(null); 
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const customIcon = new Icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
  }

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <MapContainer
      center={centerPosition}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
      whenReady={() => {
        if (!mapRef.current) {
          mapRef.current = mapRef.current;
        }
      }}
    >
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;