import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerBadge } from "@/components/SpinnerBadge";
import { useAuth } from "@/context/AuthContext";
import { makeRequest } from "@/lib/helperFunctions";
const AuthCallback = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const error = params.get("error");
  const error_description = params.get("error_description");
  const [progress, setProgress] = useState("Processing sign-in");
  const {login} = useAuth()
  async function makeExachange() {
    if (code) {
      const response = await makeRequest(
        "/api/auth/exchange",
        {
          // Your TentCredit backend endpoint
          method: "POST",
          body: JSON.stringify({ code }),
        },
      );

      if (response.status === "error") {
        console.log(response.error?.message);
      }

      console.log(response)

      localStorage.setItem("tentpos:sessionId", response.data.data.sessionId);
      login(response.data.data)
      navigate("/dashboard");
    }
  }
  useEffect(() => {
    if (error) {
      setProgress(error_description!);
    } else {
      makeExachange();
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-2">
      <SpinnerBadge title={progress} />
      <p className="text-sm">
        {" "}
        Please wait while we process your request. Do not refresh the page.
      </p>
    </div>
  );
};

export default AuthCallback;
