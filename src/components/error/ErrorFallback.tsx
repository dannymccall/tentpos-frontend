import React from "react";
import { AiOutlineWarning } from "react-icons/ai"; // 👈 choose your preferred icon

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AiOutlineWarning className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-slate-500 mb-6">
          We ran into an unexpected error while loading this page. You can try
          refreshing, or go back to safety.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset || (() => window.location.reload())}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            🔄 Refresh Page
          </button>
          <a
            href="/dashboard"
            className="block w-full border border-slate-300 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            🏠 Go to Dashboard
          </a>
        </div>

        {import.meta.env.VITE_ENVIRONMENT === "development" && error && (
          <div className="mt-6 text-left text-sm text-red-500 bg-red-50 p-3 rounded-lg overflow-auto max-h-48">
            <p className="font-semibold">Error Details:</p>
            <pre>{error.message}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
