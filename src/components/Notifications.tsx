import React, { useState } from "react";
import type { Notification } from "@/types/notification.types";
import {   MessageSquareMore } from "lucide-react";
import { getTimeAgo } from "@/lib/helperFunctions";

const NotificationDropdown: React.FC<{ notification: Notification[] }> = ({
  notification,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <MessageSquareMore className="text-gray-700 text-xl" />
        {/* Notification Badge */}

        <span className="absolute top-0.5 right-0.4  bg-emerald-600 text-white text-xs rounded-full px-1">
          {notification.length}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fade-in">
          <div className="p-3 font-semibold border-b border-gray-200 text-slate-800">
            Notifications
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notification.map((notif) => (
              <li
                key={notif.id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition"
              >
                <p className="text-sm text-gray-800">{`${notif.text} ${(notif.payload as any).loanRef as any}`}</p>
                <span className="text-xs text-gray-500">
                  {getTimeAgo(notif.createdAt!)}
                </span>
              </li>
            ))}
          </ul>
          <div className="p-3 text-center text-blue-500 text-sm cursor-pointer hover:bg-gray-50 rounded-b-lg">
            View all
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
