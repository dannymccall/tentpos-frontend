const Auth = () => {
  const APP_ID = import.meta.env.VITE_TENTPOS_APP_ID;
  const APP_SECRET = import.meta.env.VITE_TENTPOS_APP_SECRET;
  const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
  const TENTHUB_FRONTEND_URL = import.meta.env.VITE_TENTHUB_FRONTEND_URL;
  
  const handleLogin = () => {
    window.location.href = `${TENTHUB_FRONTEND_URL}/auth/signin?client_id=${APP_ID}&client_secret=${APP_SECRET}&redirect_uri=${encodeURIComponent(
      `${REDIRECT_URL}/tentpos/auth/callback`
    )}&response_type=code&app_name=TentPOS&appLogo=/app_icons/tentCredit.png`;
  };
  return (
    <main className="relative h-screen bg-[url(/background.png)] bg-cover bg-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          {/* Logo + Animated Glow */}
          <div className="relative flex flex-col items-center mb-6">
            <div className="absolute w-24 h-24 rounded-full bg-green-500/30 animate-ping"></div>
            <img
              src="/app_icons/tentpos.png"
              alt="TentCredit Logo"
              className="w-16 h-16 relative z-10"
            />
            <h2 className="text-xl font-semibold text-green-700 mt-3">
              TentPOS
            </h2>
            <p className="text-sm text-gray-500">
              Your gateway to smart POS
            </p>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Sign in to <span className="text-green-600">TentPOS</span>
          </h1>

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300"
          >
            Sign in with App Center
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Don’t have an account?{" "}
             <a href={`${TENTHUB_FRONTEND_URL}/auth/signup`} className="text-green-600 hover:underline">
              Register now
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Auth;
