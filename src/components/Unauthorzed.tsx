// components/Unauthorized.tsx
import React from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-center p-6">
      <div className="bg-white p-8 rounded-2xl  max-w-md w-full">
        <FaLock className="text-red-500 text-5xl mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page or perform this action.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
