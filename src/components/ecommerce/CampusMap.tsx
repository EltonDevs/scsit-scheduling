"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface CampusMapProps {
  mapColor?: string;
}

const CampusMap: React.FC<CampusMapProps> = () => {
  const [hasMounted, setHasMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LeafletIcon, setLeafletIcon] = useState<any>(null);

  useEffect(() => {
    setHasMounted(true);
    
    // Dynamically import Icon from leaflet on client only
    import("leaflet").then((L) => {
      setLeafletIcon(() => L.Icon);
    });
  }, []);

  const customIcon = useMemo(() => {
    if (!hasMounted || !LeafletIcon) return null;

    return new LeafletIcon({
      iconUrl:
        "data:image/svg+xml," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#465FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        `),
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  }, [hasMounted, LeafletIcon]);

  // Only render after mount to prevent SSR errors
  if (!hasMounted || !customIcon) return null;

  return (
    <div className="w-full h-[212px] 2xsm:h-[250px] xsm:h-[280px] sm:h-[300px] md:h-[350px] xl:h-[350px] rounded-2xl overflow-hidden">
      <MapContainer
        center={[10.3814, 123.9585]}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[10.29614, 123.88367]} icon={customIcon}>
          <Popup>SCSIT-Main Campus (Cebu City)</Popup>
        </Marker>
        <Marker position={[11.2667, 123.7333]} icon={customIcon}>
          <Popup>SCSIT-Madridejos Campus</Popup>
        </Marker>
        <Marker position={[10.2447, 123.8492]} icon={customIcon}>
          <Popup>SCSIT-Talisay Campus</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default CampusMap;