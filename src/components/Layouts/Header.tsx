import React, { useEffect, useState } from "react";
import { FaBars, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
// import { useSocket } from "@/context/SocketContext";
import type { Notification } from "@/types/notification.types";
// import useSocketEvents from "@/hooks/useSocketNotification";
import { useNotification } from "@/context/NotificationContext";
import api from "@/lib/api";
import ProfileBadge from "../profile/ProfileBadge";
import NotificationDropdown from "../Notifications";
interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
  className: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title, className }) => {
  const { user, logout, businessProfile } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const displayName = user?.username || user?.fullName?.split(" ")[0] || "User";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const { socket, connected } = useSocket();
  const { showToast } = useNotification();
  const fetchNotifications = async () => {
    const res = await api.get(`/api/notifications/get-notifications?unread=1`);
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  // useSocketEvents(socket, connected, {
  //   notifyUser: (data) => {
  //     console.log("🔥 notifyUser:", data);
  //     fetchNotifications();
  //     showToast(data, "message");
  //   },

  //   notifyCreditOfficer: (data) => {
  //     console.log("📌 New loan app:", data);
  //     fetchNotifications();
  //     showToast(data, "message");
  //   },

  //   loanProgressUpdate: (data) => {
  //     console.log("🔔 Notification:", data);
  //     fetchNotifications();
  //     showToast(data, "message");
  //   },
  // });

  return (
    <header
      className={`backdrop-blur-md bg-white/80 border-b border-gray-200 px-4 h-16 flex items-center justify-between fixed top-0 z-30 transition-all duration-300 shadow-sm ${className}`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <FaBars size={18} />
        </Button>

        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center">
        <NotificationDropdown notification={notifications!} />

        <Separator orientation="vertical" className="h-6 bg-gray-300" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-50 transition"
            >
              <Avatar className="w-8 h-8 border border-gray-200 shadow-sm">
                <AvatarImage
                  src={user?.avatar ? `${apiUrl}${user.avatar}` : undefined}
                  alt={displayName}
                />
                <AvatarFallback>
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 rounded-xl shadow-md border border-gray-100"
          >
            <div className="px-3 py-2">
              <ProfileBadge
                branch={businessProfile?.branch?.name}
                role={businessProfile?.userRole?.role?.name || ""}
              />
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                window.location.assign("/account/settings?query=loan_settings")
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              <FaCog size={14} /> Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-500 focus:text-red-600 cursor-pointer"
            >
              <FaSignOutAlt size={14} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
