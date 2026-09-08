import { Coordinates } from "@/types";

export const CITY_PRESETS: { name: string; lat: number; lng: number }[] = [
  { name: "Manado (Pusat Kota & Tikala)", lat: 1.474830, lng: 124.842079 },
  { name: "Manado (Boulevard & Sario)", lat: 1.468000, lng: 124.833000 },
  { name: "Manado (Malalayang)", lat: 1.455200, lng: 124.815500 },
  { name: "Tomohon (Kota Bunga & Kakaskasen)", lat: 1.328248, lng: 124.840228 },
  { name: "Bitung (Pelabuhan & Aertembaga)", lat: 1.440398, lng: 125.121650 },
  { name: "Minahasa (Tondano)", lat: 1.304523, lng: 124.914389 },
  { name: "Minahasa Utara (Airmadidi)", lat: 1.416800, lng: 124.983200 },
  { name: "Minahasa Utara (Likupang DPSP)", lat: 1.683300, lng: 125.050000 },
  { name: "Minahasa Selatan (Amurang)", lat: 1.187456, lng: 124.571404 },
  { name: "Kotamobagu", lat: 0.730556, lng: 124.313889 },
  { name: "Minahasa Tenggara (Ratahan)", lat: 1.045000, lng: 124.780000 },
];

/**
 * Calculate distance between two coordinates in Kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimate travel time in minutes based on distance (Distance Matrix simulation)
 * Urban average speed: ~25 km/h with 5 mins base buffer
 */
export function estimateTravelTimeMinutes(distanceKm: number): number {
  const avgSpeedKmh = 30; // average city driving speed
  const baseMinutes = 5;
  const driveMinutes = (distanceKm / avgSpeedKmh) * 60;
  return Math.round(baseMinutes + driveMinutes);
}

/**
 * Request Browser GPS location with graceful fallback
 */
export async function requestUserLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation permission denied or error:", err.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Reverse geocode mock helper finding closest known area name
 */
export function getClosestCityName(lat: number, lng: number): string {
  let closest = CITY_PRESETS[0];
  let minDistance = Infinity;

  for (const city of CITY_PRESETS) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  if (minDistance < 25) {
    return closest.name;
  }
  return `Sekitar (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
}
