import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerBadge } from "@/components/SpinnerBadge";
import { useAuth } from "@/context/AuthContext";
import { makeRequest } from "@/lib/helperFunctions";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../card";
import { AlertCircle } from "lucide-react";
import { Button } from "../button";

type Status = "loading" | "error" | "success";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login, fetchMe, } = useAuth();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Processing sign-in...");

  const calledRef = useRef(false); // prevents double calls

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const error = params.get("error");
  const errorDescription = params.get("error_description");

  const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;


 
  const exchangeCode = async () => {
    if (!code) {
      setStatus("error");
      setMessage("Missing authorization code.");
      return;
    }

    try {
      setMessage("Authenticating...");

      const response = await makeRequest("/api/auth/exchange", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      if (response.status === "error") {
        throw new Error(response.error?.message || "Login failed");
      }

      const session = response.data.data;

      localStorage.setItem("tentpos:sessionId", session.sessionId);

      login(session);

      setStatus("success");
      setMessage("Redirecting...");

      navigate("/dashboard", { replace: true });
      fetchMe()
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Authentication failed. Please try again.");
    }
  };

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (error) {
      setStatus("error");
      setMessage(errorDescription || "Authentication cancelled.");
      return;
    }

    exchangeCode();
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className={cn("rounded-xl shadow-lg")}>
        <div className="flex justify-center items-center h-screen flex-col gap-4">
          {status === "loading" && (
            <>
              <SpinnerBadge title={message} />
              <p className="text-sm text-muted-foreground">
                Please wait while we process your request.
              </p>
            </>
          )}

          {status === "error" && (
            <Card className="w-[360px]">
              <CardContent className="p-6">
                <div className="flex gap-2 items-center text-red-600">
                  <AlertCircle size={18} />
                  <p>{message}</p>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => window.location.assign(`${REDIRECT_URL}/`)}
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthCallback;
