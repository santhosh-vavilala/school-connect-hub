import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AdminDashboardData {
  students: Array<Record<string, unknown>>;
  teachers: Array<Record<string, unknown>>;
  classes: Array<Record<string, unknown>>;
}

interface PlatformUser {
  _id: string;
  name: string;
  role: string;
  phone: string;
  schoolName?: string;
  isActive: boolean;
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "School Connect Admin Dashboard" },
      { name: "description", content: "Admin dashboard for managing students, classes, and teachers." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", admissionNumber: "", classId: "" });
  const [teacherForm, setTeacherForm] = useState({ name: "", phone: "" });
  const [classForm, setClassForm] = useState({ name: "", section: "" });
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({ students: [], teachers: [], classes: [] });
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      navigate({ to: "/login" });
    }
  }, [auth.isLoading, auth.user, navigate]);

  const isAdmin = auth.user?.role === "admin";
  const isSuperAdmin = auth.user?.role === "super_admin";
  const schoolId = auth.user?.schoolId ?? null;

  useEffect(() => {
    if (!isAdmin || !schoolId) {
      return;
    }

    const loadDashboard = async () => {
      setIsLoadingDashboard(true);
      try {
        const [students, teachers, classes] = await Promise.all([
          apiFetch(`/students?schoolId=${schoolId}`),
          apiFetch(`/teachers?schoolId=${schoolId}`),
          apiFetch(`/classes?schoolId=${schoolId}`),
        ]);

        setDashboardData({
          students: Array.isArray(students) ? students : [],
          teachers: Array.isArray(teachers) ? teachers : [],
          classes: Array.isArray(classes) ? classes : [],
        });
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Unable to load dashboard data.");
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    void loadDashboard();
  }, [isAdmin, schoolId]);

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }

    const loadUsers = async () => {
      setIsLoadingPlatformUsers(true);
      try {
        const users = await apiFetch("/auth/users");
        setPlatformUsers(Array.isArray(users) ? users : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Unable to load platform users.");
      } finally {
        setIsLoadingPlatformUsers(false);
      }
    };

    void loadUsers();
  }, [isSuperAdmin]);

  const reloadDashboard = async () => {
    if (!isAdmin || !schoolId) {
      return;
    }

    setIsLoadingDashboard(true);
    try {
      const [students, teachers, classes] = await Promise.all([
        apiFetch(`/students?schoolId=${schoolId}`),
        apiFetch(`/teachers?schoolId=${schoolId}`),
        apiFetch(`/classes?schoolId=${schoolId}`),
      ]);

      setDashboardData({
        students: Array.isArray(students) ? students : [],
        teachers: Array.isArray(teachers) ? teachers : [],
        classes: Array.isArray(classes) ? classes : [],
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to refresh dashboard data.");
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const handleAddStudent = async () => {
    setMessage(null);
    setError(null);

    try {
      await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify({
          ...studentForm,
          schoolId,
        }),
      });
      setMessage("Student added successfully.");
      setStudentForm({ name: "", phone: "", admissionNumber: "", classId: "" });
      await reloadDashboard();
    } catch (err: any) {
      setError(err?.message || "Unable to add student.");
    }
  };

  const handleAddTeacher = async () => {
    setMessage(null);
    setError(null);

    try {
      await apiFetch("/teachers", {
        method: "POST",
        body: JSON.stringify({
          ...teacherForm,
          schoolId,
        }),
      });
      setMessage("Teacher added successfully.");
      setTeacherForm({ name: "", phone: "" });
      await reloadDashboard();
    } catch (err: any) {
      setError(err?.message || "Unable to add teacher.");
    }
  };

  const handleAddClass = async () => {
    setMessage(null);
    setError(null);

    try {
      await apiFetch("/classes", {
        method: "POST",
        body: JSON.stringify({
          ...classForm,
          schoolId,
        }),
      });
      setMessage("Class added successfully.");
      setClassForm({ name: "", section: "" });
      await reloadDashboard();
    } catch (err: any) {
      setError(err?.message || "Unable to add class.");
    }
  };

  if (auth.isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/90 px-8 py-12 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-lg font-medium">Loading dashboard…</p>
        </div>
      </main>
    );
  }

  if (!auth.user) {
    return null;
  }

  if (!isAdmin && !isSuperAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-red-500/20 bg-slate-900/90 px-8 py-12 text-center shadow-2xl shadow-slate-950/40">
          <h1 className="text-2xl font-semibold text-white">Access denied</h1>
          <p className="mt-4 text-slate-400">Only admin and super admin users can access the School Connect dashboard.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Admin dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Welcome, {auth.user.name || "School Connect user"}</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">Role: {auth.user.role}</span>
              <button
                onClick={auth.signOut}
                className="inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
              >
                Sign out
              </button>
            </div>
          </div>
        </section>

        {message && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message}</div>
        )}
        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
        )}

        {isSuperAdmin ? (
          <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white">Super admin overview</h2>
            <p className="mt-2 text-slate-400">View platform users and school administration data.</p>

            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {platformUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-900/70">
                      <td className="px-4 py-3">{user.name || "—"}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">{user.phone}</td>
                      <td className="px-4 py-3">{user.schoolName || "Global"}</td>
                      <td className="px-4 py-3">{user.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <Card label="Students" value={dashboardData.students.length} />
              <Card label="Teachers" value={dashboardData.teachers.length} />
              <Card label="Classes" value={dashboardData.classes.length} />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">Add a new class</h2>
                <form className="mt-5 space-y-4" onSubmit={(event) => {
                  event.preventDefault();
                  void handleAddClass();
                }}>
                  <InputLabel label="Class name" value={classForm.name} onChange={(value) => setClassForm((prev) => ({ ...prev, name: value }))} />
                  <InputLabel label="Section" value={classForm.section} onChange={(value) => setClassForm((prev) => ({ ...prev, section: value }))} />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Add class
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">Add a teacher</h2>
                <form className="mt-5 space-y-4" onSubmit={(event) => {
                  event.preventDefault();
                  void handleAddTeacher();
                }}>
                  <InputLabel label="Name" value={teacherForm.name} onChange={(value) => setTeacherForm((prev) => ({ ...prev, name: value }))} />
                  <InputLabel label="Phone" value={teacherForm.phone} onChange={(value) => setTeacherForm((prev) => ({ ...prev, phone: value }))} />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Add teacher
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">Add a student</h2>
                <form className="mt-5 space-y-4" onSubmit={(event) => {
                  event.preventDefault();
                  void handleAddStudent();
                }}>
                  <InputLabel label="Name" value={studentForm.name} onChange={(value) => setStudentForm((prev) => ({ ...prev, name: value }))} />
                  <InputLabel label="Phone" value={studentForm.phone} onChange={(value) => setStudentForm((prev) => ({ ...prev, phone: value }))} />
                  <InputLabel label="Admission number" value={studentForm.admissionNumber} onChange={(value) => setStudentForm((prev) => ({ ...prev, admissionNumber: value }))} />
                  <InputLabel label="Class ID" value={studentForm.classId} onChange={(value) => setStudentForm((prev) => ({ ...prev, classId: value }))} />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Add student
                  </button>
                </form>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InputLabel({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
        )}
      />
    </label>
  );
}
