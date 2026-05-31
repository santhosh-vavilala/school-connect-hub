import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "School Connect Admin Login" },
      { name: "description", content: "Admin login portal for School Connect." },
    ],
  }),
  component: Login,
});

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetOtpFlow = () => {
    setCode("");
    setError(null);
    setSuccessMessage(null);
    auth.resetOtpFlow();
  };

  useEffect(() => {
    if (!auth.isLoading && auth.user) {
      navigate({ to: "/admin" });
    }
  }, [auth.isLoading, auth.user, navigate]);

  const handleSendOtp = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      await auth.sendOtp(phone);
      setCode("");
      setSuccessMessage("OTP sent successfully. Enter the code below to finish login.");
    } catch (error: any) {
      setError(error?.message || "Unable to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      await auth.verifyOtp(code);
      navigate({ to: "/admin" });
    } catch (error: any) {
      setError(error?.message || "Unable to verify OTP. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-md">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">School Connect</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Admin portal access</h1>
          <p className="text-sm text-slate-400">
            Use the same School Connect login as the mobile app to manage students, classes, teachers, and school operations.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        )}
        {successMessage && (
          <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</div>
        )}

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter 10-digit phone number"
              className={cn(
                "w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              )}
            />
          </div>

          {auth.otpRequestedFor && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">OTP code</label>
              <p className="mb-2 text-xs text-slate-400">
                OTP sent to {auth.otpRequestedFor.replace("+91", "+91 ")}
              </p>
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className={cn(
                  "w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                )}
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleSendOtp}
              className="rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Send OTP
            </button>
            {auth.otpRequestedFor && (
              <>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="rounded-3xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={resetOtpFlow}
                  className="rounded-3xl border border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white sm:col-span-2"
                >
                  Request New OTP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
