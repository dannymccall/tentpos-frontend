"use client";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileBackHeaderProps {
  title?: string;
  fallbackRoute?: string;
}

const MobileBackHeader = ({
  title,
  fallbackRoute = "/dashboard",
}: MobileBackHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackRoute);
    }
  };

  return (
    <div className="md:hidden sticky top-16 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-sm font-semibold text-gray-800 truncate">
            {title}
          </h2>
        )}
      </div>
    </div>
  );
};

export default MobileBackHeader;