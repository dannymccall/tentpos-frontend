import React, { createContext, useState, useEffect, useContext } from "react";
import type { User } from "../types/user.types";
import { useNotification } from "./NotificationContext";
import { useNavigate } from "react-router-dom";
import type { BusinessProfile } from "../types/businessProfile.types";
import type { Permission } from "../types/permissions.types";
import { makeRequest } from "@/lib/helperFunctions";
type PublicUser = Pick<
  User & {
    avatar?: string;
    sessionId?: string;
    emailVerified?: boolean;
    mustResetPassword?: string;
  },
  | "id"
  | "avatar"
  | "sessionId"
  | "fullName"
  | "emailVerified"
  | "role"
  | "username"
  | "mustResetPassword"
  | "tenantId"
>;

interface AuthContextType {
  user: PublicUser | null;
  profilePicture: string;
  businessProfile: BusinessProfile | null;
  login: (userData: AuthContextType) => Promise<void>;
  logout: () => Promise<void>;
  permissions: Permission[];
  updateUser: () => void;
  createSessionId: (sessionId: string) => void;
  updateProfilePicture: (newPicture: string) => void;
  getSessionId: (name: string) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  avatar?: string;
  sessionId?: string;
  dataScope: DataScope[] | null;
  fetchMe: () => void
}

interface Settings {
  companyName: string;
  logo: string;
}


interface DataScope {
  scope: string;
  entity: string
};
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfile | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [dataScope, setDataScope] = useState<DataScope[] | null>(null)
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    companyName: "",
    logo: "",
  });
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const sessionId = localStorage.getItem("tentpos:sessionId");

  const fetchMe = async () => {
    try {
      // console.log(sessionId);
      if (sessionId) {
        const response = await makeRequest(`/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        // console.log({ response });
        if (response.data.data) {
          setUser(response.data.data);
          setProfilePicture(response.data.avatar || "");
          setBusinessProfile(response.data.data.businessProfile);
          response.data.data.businessProfile.userRole &&
            setPermissions(
              response.data.data.businessProfile.userRole.role.permissions
            );
          response.data.data.settings &&
            setSettings({
              companyName: response.data.data.settings.name || "",
              logo: response.data.data.settings.logo || "",
            });
            setDataScope(response.data.data.dataScope.scopes)
        }
      }
    } catch (error) {
      console.error("Error retrieving session:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (userData: AuthContextType) => {
    if (userData.sessionId) {
      localStorage.setItem("tentpos:sessionId", userData.sessionId);
    }
    setUser(userData as any);
    setProfilePicture(userData.avatar || "");
    setBusinessProfile(userData.businessProfile);
    userData.businessProfile?.userRole &&
      setPermissions(
        userData.businessProfile?.userRole.role.permissions as any
      );
    setSettings({
      companyName: (userData.settings as any).name,
      logo: userData.settings.logo,
    });
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem("tentpos:sessionId");
      console.log(sessionId);
      const response = await makeRequest(`/api/auth/signout`, {
        method: "POST",
        body: JSON.stringify({ sessionId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        credentials: "include",
      });
      console.log(response);
      const { status } = response;
      if (status === "error") {
        showToast(response.error?.message!, "error");
        return;
      }
      localStorage.removeItem("tentpos:sessionId");
      setUser(null);
      setProfilePicture("");
      navigate("/");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const createSessionId = async (sessionId: string) => {
    localStorage.setItem("tentpos:sessionId", sessionId);
  };

  const getSessionId = (name: string) => localStorage.getItem(name);

  const updateUser = () => fetchMe();

  const updateProfilePicture = (newPicture: string) => {
    setProfilePicture(newPicture);
    if (user) setUser({ ...user, avatar: newPicture });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profilePicture,
        login,
        logout,
        updateUser,
        createSessionId,
        updateProfilePicture,
        getSessionId,
        businessProfile,
        permissions,
        settings,
        setSettings,
        dataScope,
        fetchMe
      }}
    >
      {!loading && children}
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
