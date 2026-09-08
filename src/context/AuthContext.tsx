"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { User, Coordinates, UserRole } from "@/types";
import { requestUserLocation, getClosestCityName } from "@/lib/geo";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

interface AuthContextType {
  currentUser: User | null;
  userLocation: Coordinates;
  locationName: string;
  isLocationGranted: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: Partial<User> & { email: string; name: string; role: UserRole; password?: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  toggleAccountStatus: (isActive: boolean) => Promise<void>;
  setUserLocation: (coords: Coordinates, name?: string) => void;
  requestGps: () => Promise<boolean>;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "fte_current_user_sulut_v3";
const STORAGE_KEY_LOCATION = "fte_user_coords_sulut_v3";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLocation, setUserLocationState] = useState<Coordinates>({
    latitude: 1.474830,
    longitude: 124.842079, // Default: Tikala, Manado
  });
  const [locationName, setLocationName] = useState<string>("Tikala, Manado");
  const [isLocationGranted, setIsLocationGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Convex Reactive Query for all users
  const convexUsers = useQuery(api.users.listAllUsers);
  const registerMutation = useMutation(api.users.registerUser);
  const loginMutation = useMutation(api.users.loginUser);
  const updateProfileMutation = useMutation(api.users.updateProfile);
  const toggleAccountStatusMutation = useMutation(api.users.toggleAccountStatus);

  // Transform Convex documents to User[]
  const allUsers: User[] = useMemo(() => {
    if (!convexUsers) return [];
    return convexUsers.map((u: any) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role as UserRole,
      latitude: u.latitude,
      longitude: u.longitude,
      avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
      lokasi_nama: u.lokasi_nama,
      kategori_keahlian: u.kategori_keahlian,
      deskripsi_bio: u.deskripsi_bio,
      rata_rata_rating: u.rata_rata_rating,
      jumlah_review: u.jumlah_review,
      pengalaman_tahun: u.pengalaman_tahun,
      telepon: u.telepon,
      verified: u.verified,
      likes: u.likes || 0,
      keahlian_tags: u.keahlian_tags || [],
      pendidikan: u.pendidikan,
      sertifikasi: u.sertifikasi,
      is_active: u.is_active !== false,
      created_at: u.created_at || u._creationTime,
    }));
  }, [convexUsers]);

  // Restore stored session and location on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        const parsed: User = JSON.parse(storedUser);
        setCurrentUser(parsed);
        if (parsed.latitude && parsed.longitude) {
          setUserLocationState({ latitude: parsed.latitude, longitude: parsed.longitude });
          setLocationName(parsed.lokasi_nama || getClosestCityName(parsed.latitude, parsed.longitude));
        }
      }

      const storedCoords = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (storedCoords) {
        const coords = JSON.parse(storedCoords);
        setUserLocationState(coords);
        setLocationName(getClosestCityName(coords.latitude, coords.longitude));
        setIsLocationGranted(true);
      }
    } catch (e) {
      console.error("Failed to load initial auth state:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Synchronize currentUser with real-time Convex data whenever allUsers updates
  useEffect(() => {
    if (currentUser && allUsers.length > 0) {
      const updated = allUsers.find(
        (u) => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (updated && (updated.id !== currentUser.id || updated.rata_rata_rating !== currentUser.rata_rata_rating || updated.jumlah_review !== currentUser.jumlah_review)) {
        setCurrentUser(updated);
        try {
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
        } catch (e) {}
      }
    }
  }, [allUsers, currentUser]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check locally in current allUsers list
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (foundUser) {
      setCurrentUser(foundUser);
      setUserLocationState({ latitude: foundUser.latitude, longitude: foundUser.longitude });
      setLocationName(foundUser.lokasi_nama || getClosestCityName(foundUser.latitude, foundUser.longitude));
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(foundUser));
      } catch (e) {
        console.error("Failed storing user:", e);
      }
      return true;
    }

    // Call Convex login mutation directly
    try {
      const loggedUser = await loginMutation({ email: cleanEmail, password: password || "123456" });
      if (loggedUser) {
        const userObj: User = {
          id: loggedUser._id,
          email: loggedUser.email,
          name: loggedUser.name,
          role: loggedUser.role as UserRole,
          latitude: loggedUser.latitude,
          longitude: loggedUser.longitude,
          avatar: loggedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${loggedUser.name}`,
          lokasi_nama: loggedUser.lokasi_nama,
          kategori_keahlian: loggedUser.kategori_keahlian,
          deskripsi_bio: loggedUser.deskripsi_bio,
          rata_rata_rating: loggedUser.rata_rata_rating,
          jumlah_review: loggedUser.jumlah_review,
          pengalaman_tahun: loggedUser.pengalaman_tahun,
          telepon: loggedUser.telepon,
          verified: loggedUser.verified,
          created_at: loggedUser.created_at || loggedUser._creationTime,
        };
        setCurrentUser(userObj);
        setUserLocationState({ latitude: userObj.latitude, longitude: userObj.longitude });
        setLocationName(userObj.lokasi_nama || getClosestCityName(userObj.latitude, userObj.longitude));
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userObj));
        return true;
      }
    } catch (err: any) {
      console.warn("Convex login attempt error:", err.message);
    }

    return false;
  };

  const register = async (
    userData: Partial<User> & { email: string; name: string; role: UserRole; password?: string }
  ): Promise<User> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // Call Convex registerUser mutation to save to Cloud Database
    const registeredDoc = await registerMutation({
      email: cleanEmail,
      password: userData.password || "123456",
      name: userData.name,
      role: userData.role,
      latitude: userData.latitude || userLocation.latitude,
      longitude: userData.longitude || userLocation.longitude,
      lokasi_nama: userData.lokasi_nama || locationName,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      telepon: userData.telepon || "+62 812-0000-0000",
      kategori_keahlian: userData.role === "AHLI" ? userData.kategori_keahlian || "Technology & Software" : undefined,
      deskripsi_bio: userData.role === "AHLI" ? userData.deskripsi_bio || "Experienced practitioner and mentor." : undefined,
      pengalaman_tahun: userData.role === "AHLI" ? userData.pengalaman_tahun || 1 : undefined,
    });

    const newUser: User = {
      id: registeredDoc?._id || `user-${Date.now()}`,
      email: cleanEmail,
      name: userData.name,
      role: userData.role,
      latitude: userData.latitude || userLocation.latitude,
      longitude: userData.longitude || userLocation.longitude,
      lokasi_nama: userData.lokasi_nama || locationName,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      telepon: userData.telepon || "",
      kategori_keahlian: userData.kategori_keahlian,
      deskripsi_bio: userData.deskripsi_bio,
      rata_rata_rating: userData.role === "AHLI" ? 5.0 : undefined,
      jumlah_review: userData.role === "AHLI" ? 0 : undefined,
      pengalaman_tahun: userData.pengalaman_tahun || 1,
      verified: true,
      created_at: Date.now(),
    };

    setCurrentUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    // Persist changes to Convex Cloud database
    try {
      await updateProfileMutation({
        id: currentUser.id,
        name: updatedData.name,
        avatar: updatedData.avatar,
        latitude: updatedData.latitude,
        longitude: updatedData.longitude,
        lokasi_nama: updatedData.lokasi_nama,
        deskripsi_bio: updatedData.deskripsi_bio,
        kategori_keahlian: updatedData.kategori_keahlian,
        pengalaman_tahun: updatedData.pengalaman_tahun,
        telepon: updatedData.telepon,
        is_active: updatedData.is_active,
      });
    } catch (err) {
      console.error("Failed to sync profile update to Convex:", err);
    }
  };

  const toggleAccountStatus = async (isActive: boolean) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, is_active: isActive };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch (e) {}

    try {
      await toggleAccountStatusMutation({
        id: currentUser.id,
        is_active: isActive,
      });
    } catch (err) {
      console.error("Failed to toggle account status in Convex:", err);
    }
  };

  const setUserLocation = (coords: Coordinates, name?: string) => {
    setUserLocationState(coords);
    const resolvedName = name || getClosestCityName(coords.latitude, coords.longitude);
    setLocationName(resolvedName);
    setIsLocationGranted(true);
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(coords));
    } catch (e) {
      console.error(e);
    }

    if (currentUser) {
      updateProfile({ latitude: coords.latitude, longitude: coords.longitude, lokasi_nama: resolvedName });
    }
  };

  const requestGps = async (): Promise<boolean> => {
    const coords = await requestUserLocation();
    if (coords) {
      setUserLocation(coords);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userLocation,
        locationName,
        isLocationGranted,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        toggleAccountStatus,
        setUserLocation,
        requestGps,
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
