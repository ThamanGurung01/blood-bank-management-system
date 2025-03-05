"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import React from 'react'
import { LatLngExpression } from "leaflet";
const Map = () => {
    const position:LatLngExpression=[27.6719, 84.4265];
  return (
    <MapContainer center={position} zoom={10} style={{ height: "400px", width: "100%" }}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  )
}

export default Map