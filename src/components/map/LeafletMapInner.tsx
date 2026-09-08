"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates, ExpertWithDistance } from "@/types";
import { Star, Award, MessageSquare, ChevronRight, Navigation, MapPin } from "lucide-react";
import Link from "next/link";

interface LeafletMapInnerProps {
  userLocation: Coordinates;
  locationName: string;
  experts: ExpertWithDistance[];
  radiusKm: number;
  selectedExpertId?: string | null;
  onSelectExpert: (expert: ExpertWithDistance | null) => void;
}

// Helper to auto-recenter map when coordinates change
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMapInner({
  userLocation,
  locationName,
  experts,
  radiusKm,
  selectedExpertId,
  onSelectExpert,
}: LeafletMapInnerProps) {
  // Create custom user marker icon
  const userIcon = L.divIcon({
    className: "custom-user-marker",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background-color: rgba(37, 99, 235, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 18px; height: 18px; border-radius: 9999px; background-color: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Calculate appropriate zoom level based on radius
  const getZoomLevel = (radius: number) => {
    if (radius <= 5) return 14;
    if (radius <= 15) return 12;
    if (radius <= 35) return 11;
    return 10;
  };

  const selectedExpert = experts.find((e) => e.id === selectedExpertId);

  return (
    <div className="relative w-full h-full min-h-[460px]">
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={getZoomLevel(radiusKm)}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", minHeight: "460px" }}
      >
        <ChangeView
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={getZoomLevel(radiusKm)}
        />

        {/* High quality OpenStreetMap vector tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Visual search radius circle around user location */}
        <Circle
          center={[userLocation.latitude, userLocation.longitude]}
          radius={radiusKm * 1000} // meters
          pathOptions={{
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.08,
            weight: 2,
            dashArray: "6, 6",
          }}
        />

        {/* User Marker */}
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>
            <div className="p-2 text-center">
              <span className="font-bold text-xs text-blue-600">Your Location</span>
              <p className="text-[11px] text-slate-600">{locationName}</p>
            </div>
          </Popup>
        </Marker>

        {/* Expert Markers */}
        {experts
          .filter(
            (expert) =>
              typeof expert.latitude === "number" &&
              typeof expert.longitude === "number" &&
              !isNaN(expert.latitude) &&
              !isNaN(expert.longitude) &&
              (expert.latitude !== 0 || expert.longitude !== 0)
          )
          .map((expert) => {
            const isSelected = expert.id === selectedExpertId;
            const expertIcon = L.divIcon({
              className: "custom-expert-marker",
              html: `
                <div style="position: relative; width: 44px; height: 44px; cursor: pointer; transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition: all 0.2s;">
                  <div style="width: 40px; height: 40px; border-radius: 9999px; overflow: hidden; border: 3px solid ${isSelected ? '#2563eb' : '#059669'}; background: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
                    <img src="${expert.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + expert.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <div style="position: absolute; bottom: -2px; right: -2px; background: #f59e0b; color: #ffffff; font-size: 9px; font-weight: 800; border-radius: 9999px; padding: 1px 4px; border: 1.5px solid #ffffff; display: flex; align-items: center; gap: 1px;">
                    ★ ${expert.rata_rata_rating?.toFixed(1) || '5.0'}
                  </div>
                </div>
              `,
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            });

            return (
              <Marker
                key={expert.id}
                position={[expert.latitude, expert.longitude]}
                icon={expertIcon}
                eventHandlers={{
                  click: () => onSelectExpert(expert),
                }}
              >
                <Popup>
                  <div className="p-3 max-w-[220px]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900 leading-tight">
                          {expert.name}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-semibold truncate max-w-[140px]">
                          {(expert.kategori_keahlian || "Expert").split(",").join(" • ")}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                      {expert.deskripsi_bio}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 mb-2">
                      <span>{expert.distanceKm} km away</span>
                      <span>~{expert.travelTimeMin} min</span>
                    </div>
                    <div className="flex gap-1">
                      <a
                        href={`/messages?to=${expert.id}`}
                        className="flex-1 py-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-semibold"
                      >
                        Chat
                      </a>
                      <a
                        href={`/experts/${expert.id}`}
                        className="flex-1 py-1 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-semibold"
                      >
                        Profile
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Floating Expert Card Preview when selected on map */}
      {selectedExpert && (
        <div className="absolute bottom-4 left-4 right-4 z-[500] max-w-md mx-auto bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slideUp">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedExpert.avatar}
                alt={selectedExpert.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                  {selectedExpert.name}
                </h4>
                <div className="flex flex-wrap items-center gap-1 mt-0.5">
                  {(selectedExpert.kategori_keahlian || "Expert")
                    .split(",")
                    .slice(0, 2)
                    .map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded"
                      >
                        <Award className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate max-w-[120px]">{cat.trim()}</span>
                      </span>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {selectedExpert.rata_rata_rating?.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {selectedExpert.distanceKm} km (~{selectedExpert.travelTimeMin} min)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectExpert(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/messages?to=${selectedExpert.id}`}
              className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </Link>
            <Link
              href={`/experts/${selectedExpert.id}`}
              className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1 shadow-md shadow-blue-500/20"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
