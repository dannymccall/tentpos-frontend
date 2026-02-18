import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../button";

const Auth = () => {
  const APP_ID = import.meta.env.VITE_TENTPOS_APP_ID;
  const APP_SECRET = import.meta.env.VITE_TENTPOS_APP_SECRET;
  const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
  const TENTHUB_FRONTEND_URL = import.meta.env.VITE_TENTHUB_FRONTEND_URL;
  const SIGNUP_REDIRECT = import.meta.env.VITE_SIGNUP_REDIRECT;
  const BASENAME = import.meta.env.VITE_BASENAME;

  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (loading) return;
    setLoading(true);

    const redirectUri = encodeURIComponent(`${REDIRECT_URL}/auth/callback`);

    const url =
      `${TENTHUB_FRONTEND_URL}/auth/signin` +
      `?client_id=${APP_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&client_secret=${APP_SECRET}` +
      `&response_type=code` +
      `&app_name=TentPOS` +
      `&appLogo=/app_icons/tentpos-blue.png`;
    window.location.assign(url);
    window.location.assign(url.toString());
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div
        className={cn(
          "rounded-xl border border-[#1F2937] bg-[#020617] shadow-lg",
        )}
      >
        <div className="flex justify-center items-center w-full">
          <div className="bg-gray-100 rounded-lg p-8 max-w-md w-3xl h-[500px] text-center">
            {/* Logo */}
            <div className="flex flex-col items-center mb-10 space-y-6">
              <div className="absolute w-24 h-24 rounded-full bg-green-500/30 animate-ping"></div>

              <div className="bg-indigo-300 p-4 rounded-full">
                <img
                  src={`${BASENAME}/app_icons/tentpos-blue.png`}
                  alt="TentPOS Logo"
                  className="w-16 h-16"
                />
              </div>

              <p className="text-sm text-gray-500">Your gateway to smart POS</p>
            </div>

            <h1 className="text-xl font-bold text-gray-800 mb-6">
              Sign in to <span className="text-green-600">TentPOS</span>
            </h1>

            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Redirecting..." : "Sign in with App Center"}
            </Button>

            <p className="mt-6 text-sm text-gray-500">
              Don’t have an account?{" "}
              <a
                href={SIGNUP_REDIRECT}
                className="text-green-600 hover:underline"
              >
                Register now
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
