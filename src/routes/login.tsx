import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Moon, ShieldCheck, Sparkles, Sun, Users } from "lucide-react";
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

const highlights = [
  {
    icon: Users,
    title: "Manage large student data",
    description: "Add and organize students, teachers, and classes faster when your school handles 500+ records.",
  },
  {
    icon: ShieldCheck,
    title: "Use the same mobile login",
    description: "Admins sign in with the same OTP-based account already used inside the School Connect mobile app.",
  },
  {
    icon: Sparkles,
    title: "See the school clearly",
    description: "Keep operations simple with a central web dashboard built for admin work and super admin oversight.",
  },
];

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("school-connect-theme");
    if (savedTheme === "dark") {
      setDark(true);
      return;
    }
    if (savedTheme === "light") {
      setDark(false);
      return;
    }

    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("school-connect-theme", dark ? "dark" : "light");
  }, [dark]);

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
    <main className="relative min-h-screen overflow-hidden bg-[oklch(0.98_0.015_250)] text-slate-950 transition-colors dark:bg-[oklch(0.14_0.025_265)] dark:text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,81,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(86,110,255,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-stretch px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:shadow-[0_30px_80px_-20px_rgba(2,6,23,0.72)] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#3148ff_0%,#2b36c9_42%,#121e91_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute inset-0 opacity-35">
              <div className="absolute -left-24 top-12 h-72 w-72 rounded-full border border-white/20" />
              <div className="absolute left-8 top-24 h-[24rem] w-[24rem] rounded-full border border-white/15" />
              <div className="absolute left-24 top-40 h-[28rem] w-[28rem] rounded-full border border-white/10" />
              <div className="absolute right-[-8rem] top-[-5rem] h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-[-7rem] left-10 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                <GraduationCap className="h-8 w-8" />
              </div>

              <div className="mt-14 max-w-md">
                <p className="text-sm font-medium uppercase tracking-[0.42em] text-white/70">School Connect</p>
                <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-white">
                  Hello
                  <br />
                  Admin Hub.
                </h1>
                <p className="mt-6 text-base leading-7 text-white/78">
                  Manage students, classes, teachers, and school operations from one focused web workspace built for high-volume admin tasks.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid gap-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-md"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/14">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex min-h-[100dvh] flex-col justify-center bg-white/92 px-6 py-8 dark:bg-slate-950/78 sm:px-8 lg:min-h-0 lg:px-10 xl:px-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-cyan-300">
                    School Connect
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Login with your admin mobile number to access the web dashboard.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDark((current) => !current)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:text-white"
                  aria-label="Toggle theme"
                >
                  {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>

              <div className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {successMessage}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</label>
                  <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900/80 dark:focus-within:border-cyan-300 dark:focus-within:ring-cyan-400/10">
                    <span className="inline-flex items-center border-r border-slate-200 px-4 text-sm font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit phone number"
                      className={cn(
                        "w-full bg-transparent px-4 py-3.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>
                </div>

                {auth.otpRequestedFor && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">OTP code</label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      OTP sent to {auth.otpRequestedFor.replace("+91", "+91 ")}
                    </p>
                    <input
                      type="text"
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className={cn(
                        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300 dark:focus:ring-cyan-400/10"
                      )}
                    />
                  </div>
                )}

                <div className={cn("grid gap-3", auth.otpRequestedFor ? "sm:grid-cols-2" : "grid-cols-1")}>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    Send OTP
                  </button>

                  {auth.otpRequestedFor && (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                    >
                      Verify OTP
                    </button>
                  )}
                </div>

                {auth.otpRequestedFor && (
                  <button
                    type="button"
                    onClick={resetOtpFlow}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
                  >
                    Request New OTP
                  </button>
                )}

                <div className="rounded-2xl bg-slate-100/80 px-4 py-4 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-400 lg:hidden">
                  Use the same School Connect login as the mobile app. On desktop, the full admin workspace opens after OTP verification.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
