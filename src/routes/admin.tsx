import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Download,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  School,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

type AdminSection = "overview" | "students" | "teachers" | "classes";
type ModalType = "student" | "teacher" | "class" | null;

interface DashboardSummary {
  students: number;
  teachers: number;
  classes: number;
}

interface TeacherRecord {
  _id: string;
  name: string;
  phone: string;
  isActive?: boolean;
}

interface StudentRecord {
  _id: string;
  name: string;
  phone: string;
  admissionNumber?: string | null;
  gender?: string | null;
  dob?: string | null;
  rollNumber?: number | null;
  fatherName?: string | null;
  motherName?: string | null;
  alternatePhone?: string | null;
  address?: string | null;
  classId?: string | null;
  isActive?: boolean;
}

interface ClassRecord {
  _id: string;
  name: string;
  section?: string | null;
  teacherId?: { _id?: string; name?: string; phone?: string } | null;
}

interface PlatformUser {
  _id: string;
  name: string;
  role: string;
  phone: string;
  schoolName?: string;
  isActive: boolean;
}

interface StudentFormState {
  name: string;
  phone: string;
  email: string;
  admissionNumber: string;
  gender: string;
  dob: string;
  rollNumber: string;
  fatherName: string;
  motherName: string;
  alternatePhone: string;
  address: string;
  classId: string;
}

interface StudentImportPreviewRow {
  id: string;
  rowNumber: number;
  data: StudentFormState;
  errors: string[];
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

const emptyStudentForm: StudentFormState = {
  name: "",
  phone: "",
  email: "",
  admissionNumber: "",
  gender: "",
  dob: "",
  rollNumber: "",
  fatherName: "",
  motherName: "",
  alternatePhone: "",
  address: "",
  classId: "",
};

const emptyTeacherForm = { name: "", phone: "" };
const emptyClassForm = { name: "", section: "" };

const adminMenu = [
  { id: "overview" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "students" as const, label: "Students", icon: Users },
  { id: "teachers" as const, label: "Teachers", icon: UserRound },
  { id: "classes" as const, label: "Classes", icon: School },
];

function Admin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [summary, setSummary] = useState<DashboardSummary>({ students: 0, teachers: 0, classes: 0 });
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyStudentForm);
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);
  const [classForm, setClassForm] = useState(emptyClassForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportingStudents, setIsImportingStudents] = useState(false);
  const [studentImportRows, setStudentImportRows] = useState<StudentImportPreviewRow[]>([]);
  const [studentImportOpen, setStudentImportOpen] = useState(false);
  const [studentImportFeedback, setStudentImportFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const studentCsvInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.setItem("school-connect-theme", "light");
  }, []);

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      navigate({ to: "/login" });
    }
  }, [auth.isLoading, auth.user, navigate]);

  const isAdmin = auth.user?.role === "admin";
  const isSuperAdmin = auth.user?.role === "super_admin";
  const schoolId = auth.user?.schoolId ?? null;

  const classOptions = useMemo(
    () =>
      classes.map((item) => ({
        value: item._id,
        label: `${item.name}${item.section ? ` - ${item.section}` : ""}`,
      })),
    [classes]
  );

  const classMap = useMemo(
    () =>
      Object.fromEntries(
        classes.map((item) => [item._id, `${item.name}${item.section ? ` - ${item.section}` : ""}`])
      ),
    [classes]
  );

  const hasInvalidImportRows = useMemo(
    () => studentImportRows.some((row) => row.errors.length > 0),
    [studentImportRows]
  );

  useEffect(() => {
    if (!isAdmin || !schoolId) {
      return;
    }

    const loadAdminData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [summaryResponse, studentsResponse, teachersResponse, classesResponse] = await Promise.all([
          apiFetch(`/schools/dashboard-summary/${schoolId}`),
          apiFetch(`/students?schoolId=${schoolId}`),
          apiFetch(`/teachers?schoolId=${schoolId}`),
          apiFetch(`/classes?schoolId=${schoolId}`),
        ]);

        setSummary({
          students: Number((summaryResponse as any)?.students || 0),
          teachers: Number((summaryResponse as any)?.teachers || 0),
          classes: Number((summaryResponse as any)?.classes || 0),
        });
        setStudents(Array.isArray(studentsResponse) ? (studentsResponse as StudentRecord[]) : []);
        setTeachers(Array.isArray(teachersResponse) ? (teachersResponse as TeacherRecord[]) : []);
        setClasses(Array.isArray(classesResponse) ? (classesResponse as ClassRecord[]) : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadAdminData();
  }, [isAdmin, schoolId]);

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const users = await apiFetch("/auth/users");
        setPlatformUsers(Array.isArray(users) ? (users as PlatformUser[]) : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Unable to load platform users.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, [isSuperAdmin]);

  const reloadAdminData = async () => {
    if (!isAdmin || !schoolId) {
      return;
    }

    const [summaryResponse, studentsResponse, teachersResponse, classesResponse] = await Promise.all([
      apiFetch(`/schools/dashboard-summary/${schoolId}`),
      apiFetch(`/students?schoolId=${schoolId}`),
      apiFetch(`/teachers?schoolId=${schoolId}`),
      apiFetch(`/classes?schoolId=${schoolId}`),
    ]);

    setSummary({
      students: Number((summaryResponse as any)?.students || 0),
      teachers: Number((summaryResponse as any)?.teachers || 0),
      classes: Number((summaryResponse as any)?.classes || 0),
    });
    setStudents(Array.isArray(studentsResponse) ? (studentsResponse as StudentRecord[]) : []);
    setTeachers(Array.isArray(teachersResponse) ? (teachersResponse as TeacherRecord[]) : []);
    setClasses(Array.isArray(classesResponse) ? (classesResponse as ClassRecord[]) : []);
  };

  const closeModal = () => {
    setModalType(null);
    setError(null);
    setStudentForm(emptyStudentForm);
    setTeacherForm(emptyTeacherForm);
    setClassForm(emptyClassForm);
  };

  const openModal = (type: Exclude<ModalType, null>) => {
    setMessage(null);
    setError(null);
    setModalType(type);
    setMobileMenuOpen(false);
  };

  const handleAddStudent = async () => {
    if (!schoolId) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify({
          ...studentForm,
          schoolId,
          phone: studentForm.phone.trim(),
          alternatePhone: studentForm.alternatePhone.trim(),
          email: studentForm.email.trim() || null,
          admissionNumber: studentForm.admissionNumber.trim(),
          gender: studentForm.gender || null,
          dob: studentForm.dob || null,
          rollNumber: studentForm.rollNumber ? Number(studentForm.rollNumber) : null,
          fatherName: studentForm.fatherName.trim() || null,
          motherName: studentForm.motherName.trim() || null,
          address: studentForm.address.trim() || null,
          classId: studentForm.classId || null,
        }),
      });

      setMessage("Student added successfully.");
      await reloadAdminData();
      closeModal();
      setActiveSection("students");
    } catch (err: any) {
      setError(err?.message || "Unable to add student.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!schoolId) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await apiFetch("/teachers", {
        method: "POST",
        body: JSON.stringify({
          ...teacherForm,
          schoolId,
        }),
      });

      setMessage("Teacher added successfully.");
      await reloadAdminData();
      closeModal();
      setActiveSection("teachers");
    } catch (err: any) {
      setError(err?.message || "Unable to add teacher.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClass = async () => {
    if (!schoolId) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await apiFetch("/classes", {
        method: "POST",
        body: JSON.stringify({
          ...classForm,
          schoolId,
        }),
      });

      setMessage("Class added successfully.");
      await reloadAdminData();
      closeModal();
      setActiveSection("classes");
    } catch (err: any) {
      setError(err?.message || "Unable to add class.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadStudentSampleCsv = () => {
    const csv = createStudentSampleCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-import-sample.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleStudentCsvSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsImportingStudents(true);
    setError(null);
    setMessage(null);

    try {
      const csvText = await file.text();
      const rows = parseStudentCsv(csvText);

      if (rows.length === 0) {
        throw new Error("The CSV file is empty.");
      }

      const previewRows = rows.map((row, index) => buildStudentImportPreviewRow(row, index, classMap));
      setStudentImportRows(previewRows);
      setStudentImportOpen(true);
      setActiveSection("students");
    } catch (err: any) {
      setError(err?.message || "Unable to import students from CSV.");
    } finally {
      setIsImportingStudents(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const removeStudentImportRow = (rowId: string) => {
    setStudentImportRows((current) => current.filter((row) => row.id !== rowId));
  };

  const closeStudentImport = () => {
    setStudentImportOpen(false);
    setStudentImportRows([]);
    setStudentImportFeedback(null);
  };

  const handleConfirmStudentImport = async () => {
    if (!schoolId || studentImportRows.length === 0) {
      return;
    }

    if (hasInvalidImportRows) {
      setError("Please fix or remove all invalid rows before confirming the import.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);
    setStudentImportFeedback(null);

    try {
      const response = (await apiFetch("/students/bulk", {
        method: "POST",
        body: JSON.stringify({
          schoolId,
          students: studentImportRows.map((row) => ({
            ...row.data,
            rowNumber: row.rowNumber,
          })),
        }),
      })) as {
        total: number;
        successCount: number;
        failureCount: number;
        failures?: Array<{ row: number; message: string; admissionNumber?: string | null }>;
      };

      await reloadAdminData();

      if (response.failureCount === 0) {
        closeStudentImport();
        setMessage(`${response.successCount} students imported successfully.`);
      } else {
        const failureMap = new Map((response.failures || []).map((failure) => [failure.row, failure.message]));

        setStudentImportRows((current) =>
          current
            .filter((row) => failureMap.has(row.rowNumber))
            .map((row) => ({
              ...row,
              errors: [failureMap.get(row.rowNumber) || "Unable to import student"],
            }))
        );

        const preview = (response.failures || [])
          .slice(0, 3)
          .map((failure) => `Row ${failure.row}: ${failure.message}`)
          .join(" | ");

        setStudentImportFeedback({
          tone: response.successCount > 0 ? "success" : "error",
          message:
            response.successCount > 0
              ? `${response.successCount} students were saved. ${response.failureCount} rows still need attention.${preview ? ` ${preview}` : ""}`
              : `No students were saved. ${response.failureCount} rows failed validation.${preview ? ` ${preview}` : ""}`,
        });
      }
    } catch (err: any) {
      setStudentImportFeedback({
        tone: "error",
        message: err?.message || "Unable to save imported students.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (auth.isLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-xl shadow-slate-200/60">
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (!auth.user) {
    return null;
  }

  if (!isAdmin && !isSuperAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
        <div className="rounded-3xl border border-red-200 bg-white px-8 py-12 text-center shadow-xl shadow-slate-200/60">
          <h1 className="text-2xl font-semibold text-slate-950">Access denied</h1>
          <p className="mt-4 text-slate-500">Only admin and super admin users can access the School Connect dashboard.</p>
        </div>
      </main>
    );
  }

  if (isSuperAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Super Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Platform overview</h1>
                <p className="mt-2 text-sm text-slate-500">View the full School Connect user base from one place.</p>
              </div>
              <button
                onClick={auth.signOut}
                className="inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
              >
                Sign out
              </button>
            </div>
          </section>

          {error && <InlineBanner tone="error" message={error} />}

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <h2 className="text-xl font-semibold text-slate-950">Platform users</h2>
            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-white text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {platformUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-100/80">
                      <td className="px-4 py-3">{user.name || "-"}</td>
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
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <SidebarContent
            activeSection={activeSection}
            onNavigate={setActiveSection}
            userName={auth.user.name || "Admin"}
            onSignOut={auth.signOut}
          />
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <aside
              className="h-full w-72 border-r border-slate-200 bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              <SidebarContent
                activeSection={activeSection}
                onNavigate={(section) => {
                  setActiveSection(section);
                  setMobileMenuOpen(false);
                }}
                userName={auth.user.name || "Admin"}
                onSignOut={auth.signOut}
                mobile
                onClose={() => setMobileMenuOpen(false)}
              />
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
                  <h1 className="mt-0 text-2xl font-semibold text-slate-950">
                    Welcome back, {auth.user.name || "Admin"}!
                  </h1>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div className="space-y-6">
              {message && <InlineBanner tone="success" message={message} />}
              {error && <InlineBanner tone="error" message={error} />}

              <section className="grid gap-4 md:grid-cols-3">
                <StatCard
                  label="Students"
                  value={summary.students}
                  icon={Users}
                  accent="from-sky-500 to-cyan-400"
                />
                <StatCard
                  label="Teachers"
                  value={summary.teachers}
                  icon={UserRound}
                  accent="from-emerald-500 to-teal-400"
                />
                <StatCard
                  label="Classes"
                  value={summary.classes}
                  icon={BookOpen}
                  accent="from-indigo-500 to-blue-500"
                />
              </section>

              {activeSection === "overview" && (
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">School snapshot</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Use the left menu to manage students, teachers, and classes. Each section shows your current records and lets you add new entries from a modal without leaving the page.
                    </p>
                  </div>
                </section>
              )}

              {activeSection === "students" && (
                <SectionPanel
                  title="Students"
                  description="All student records for your school."
                  actionLabel="Add student"
                  onAction={() => openModal("student")}
                  actions={
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        ref={studentCsvInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleStudentCsvSelected}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleDownloadStudentSampleCsv}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                      >
                        <Download className="h-4 w-4" />
                        Download sample CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => studentCsvInputRef.current?.click()}
                        disabled={isImportingStudents}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Upload className="h-4 w-4" />
                        {isImportingStudents ? "Importing CSV..." : "Upload CSV"}
                      </button>
                    </div>
                  }
                >
                  <DataTable
                    columns={["Name", "Admission No.", "Phone", "Class", "Parent", "Status"]}
                    rows={students.map((student) => [
                      student.name || "-",
                      student.admissionNumber || "-",
                      student.phone || "-",
                      student.classId ? classMap[student.classId] || student.classId : "-",
                      student.fatherName || student.motherName || "-",
                      student.isActive === false ? "Inactive" : "Active",
                    ])}
                    emptyMessage="No students found yet."
                  />
                </SectionPanel>
              )}

              {activeSection === "teachers" && (
                <SectionPanel
                  title="Teachers"
                  description="All teacher accounts currently available in the school."
                  actionLabel="Add teacher"
                  onAction={() => openModal("teacher")}
                >
                  <DataTable
                    columns={["Name", "Phone", "Status"]}
                    rows={teachers.map((teacher) => [
                      teacher.name || "-",
                      teacher.phone || "-",
                      teacher.isActive === false ? "Inactive" : "Active",
                    ])}
                    emptyMessage="No teachers found yet."
                  />
                </SectionPanel>
              )}

              {activeSection === "classes" && (
                <SectionPanel
                  title="Classes"
                  description="Class list with assigned teachers."
                  actionLabel="Add class"
                  onAction={() => openModal("class")}
                >
                  <DataTable
                    columns={["Class ID", "Class", "Section", "Assigned teacher"]}
                    rows={classes.map((item) => [
                      item._id || "-",
                      item.name || "-",
                      item.section || "-",
                      item.teacherId?.name || "Not assigned",
                    ])}
                    emptyMessage="No classes found yet."
                  />
                </SectionPanel>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <ModalShell
          title={
            modalType === "student"
              ? "Add new student"
              : modalType === "teacher"
                ? "Add new teacher"
                : "Add new class"
          }
          footer={
            <ModalActions
              onClose={closeModal}
              onSubmit={
                modalType === "student"
                  ? handleAddStudent
                  : modalType === "teacher"
                    ? handleAddTeacher
                    : handleAddClass
              }
              isSaving={isSaving}
            />
          }
          onClose={closeModal}
        >
          {modalType === "student" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Student name" value={studentForm.name} onChange={(value) => setStudentForm((prev) => ({ ...prev, name: value }))} />
                <TextField label="Phone" value={studentForm.phone} onChange={(value) => setStudentForm((prev) => ({ ...prev, phone: value }))} />
                <TextField label="Email" value={studentForm.email} onChange={(value) => setStudentForm((prev) => ({ ...prev, email: value }))} />
                <TextField label="Admission number" value={studentForm.admissionNumber} onChange={(value) => setStudentForm((prev) => ({ ...prev, admissionNumber: value }))} />
                <SelectField
                  label="Gender"
                  value={studentForm.gender}
                  onChange={(value) => setStudentForm((prev) => ({ ...prev, gender: value }))}
                  options={[
                    { value: "", label: "Select gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <TextField label="Date of birth" type="date" value={studentForm.dob} onChange={(value) => setStudentForm((prev) => ({ ...prev, dob: value }))} />
                <TextField label="Roll number" value={studentForm.rollNumber} onChange={(value) => setStudentForm((prev) => ({ ...prev, rollNumber: value }))} />
                <SelectField
                  label="Class"
                  value={studentForm.classId}
                  onChange={(value) => setStudentForm((prev) => ({ ...prev, classId: value }))}
                  options={[{ value: "", label: "Select class" }, ...classOptions]}
                />
                <TextField label="Father name" value={studentForm.fatherName} onChange={(value) => setStudentForm((prev) => ({ ...prev, fatherName: value }))} />
                <TextField label="Mother name" value={studentForm.motherName} onChange={(value) => setStudentForm((prev) => ({ ...prev, motherName: value }))} />
                <TextField label="Alternate phone" value={studentForm.alternatePhone} onChange={(value) => setStudentForm((prev) => ({ ...prev, alternatePhone: value }))} />
              </div>
              <TextAreaField label="Address" value={studentForm.address} onChange={(value) => setStudentForm((prev) => ({ ...prev, address: value }))} />
            </div>
          )}

          {modalType === "teacher" && (
            <div className="space-y-4">
              <TextField label="Teacher name" value={teacherForm.name} onChange={(value) => setTeacherForm((prev) => ({ ...prev, name: value }))} />
              <TextField label="Phone" value={teacherForm.phone} onChange={(value) => setTeacherForm((prev) => ({ ...prev, phone: value }))} />
            </div>
          )}

          {modalType === "class" && (
            <div className="space-y-4">
              <TextField label="Class name" value={classForm.name} onChange={(value) => setClassForm((prev) => ({ ...prev, name: value }))} />
              <TextField label="Section" value={classForm.section} onChange={(value) => setClassForm((prev) => ({ ...prev, section: value }))} />
            </div>
          )}
        </ModalShell>
      )}

      {studentImportOpen && (
        <ModalShell
          title="Review imported students"
          maxWidthClass="w-[75vw] max-w-6xl"
          footer={
            <ModalActions
              onClose={closeStudentImport}
              onSubmit={handleConfirmStudentImport}
              isSaving={isSaving}
              submitLabel={hasInvalidImportRows ? "Resolve invalid rows to continue" : "Confirm and save"}
              submitDisabled={studentImportRows.length === 0 || hasInvalidImportRows}
            />
          }
          onClose={closeStudentImport}
        >
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Review the imported rows before saving. Rows with a red status have validation issues. You can remove any rows you do not want to import.
            </div>

            {studentImportFeedback && (
              <InlineBanner tone={studentImportFeedback.tone} message={studentImportFeedback.message} />
            )}

            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-white text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Admission No.</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Class ID</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentImportRows.map((row) => {
                    const isValid = row.errors.length === 0;
                    return (
                      <tr key={row.id} className="align-top hover:bg-slate-100/80">
                        <td className="px-4 py-3">
                          {isValid ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <CircleAlert className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                        <td className="px-4 py-3">{row.rowNumber}</td>
                        <td className="px-4 py-3">{row.data.name || "-"}</td>
                        <td className="px-4 py-3">{row.data.admissionNumber || "-"}</td>
                        <td className="px-4 py-3">{row.data.phone || "-"}</td>
                        <td className="px-4 py-3">{row.data.classId || "-"}</td>
                        <td className="w-[200px] min-w-[200px] px-4 py-3 text-xs leading-5 text-slate-500">
                          {isValid ? "Ready to import" : row.errors.join(" | ")}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeStudentImportRow(row.id)}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </ModalShell>
      )}
    </main>
  );
}

function SidebarContent({
  activeSection,
  onNavigate,
  userName,
  onSignOut,
  mobile = false,
  onClose,
}: {
  activeSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  userName: string;
  onSignOut: () => Promise<void>;
  mobile?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">School Connect</p>
            <p className="text-xs text-slate-500">Admin workspace</p>
          </div>
        </div>
        {mobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 px-4 py-5">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Menu</p>
        <nav className="mt-4 space-y-2">
          {adminMenu.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition",
                activeSection === id
                  ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">{userName}</p>
          <p className="mt-1 text-xs text-slate-500">School administrator</p>
          <button
            onClick={onSignOut}
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{label}</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white", accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionPanel({
  title,
  description,
  actionLabel,
  onAction,
  actions,
  children,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {actions}
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DataTable({
  columns,
  rows,
  emptyMessage,
}: {
  columns: string[];
  rows: string[][];
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
        <thead className="bg-white text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="hover:bg-slate-100/80">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineBanner({ tone, message }: { tone: "success" | "error"; message: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-4 text-sm",
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {message}
    </div>
  );
}

function ModalShell({
  title,
  children,
  footer,
  maxWidthClass,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6">
      <div
        className={cn(
          "w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/50",
          maxWidthClass
        )}
      >
        <div className="flex max-h-[90vh] flex-col">
          <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-6 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-950">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="scrollbar-clean min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            {children}
          </div>
          {footer && (
            <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-5 sm:px-8">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  onSubmit,
  isSaving,
  submitLabel = "Save",
  submitDisabled = false,
}: {
  onClose: () => void;
  onSubmit: () => void;
  isSaving: boolean;
  submitLabel?: string;
  submitDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSaving || submitDisabled}
        className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm text-slate-600">
      <span className="mb-2 block font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-slate-600">
      <span className="mb-2 block font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block text-sm text-slate-600">
      <span className="mb-2 block font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function createStudentSampleCsv() {
  const headers = [
    "name",
    "phone",
    "email",
    "admissionNumber",
    "gender",
    "dob",
    "rollNumber",
    "fatherName",
    "motherName",
    "alternatePhone",
    "address",
    "classId",
  ];

  const sampleRow = [
    "Aarav Kumar",
    "9876543210",
    "aarav.parent@example.com",
    "ADM-001",
    "male",
    "2014-06-15",
    "12",
    "Ramesh Kumar",
    "Priya Kumar",
    "9876500000",
    "12 MG Road, Bengaluru",
    "",
  ];

  return [headers, sampleRow]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}

function parseStudentCsv(csvText: string) {
  const rows = parseCsvRows(csvText).filter((row) => row.some((cell) => cell.trim() !== ""));

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  const requiredHeaders = ["name", "phone", "admissionNumber"];
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required CSV columns: ${missingHeaders.join(", ")}`);
  }

  return rows.slice(1).map((row, index) => {
    const record = headers.reduce<Record<string, string>>((accumulator, header, cellIndex) => {
      accumulator[header] = row[cellIndex]?.trim() || "";
      return accumulator;
    }, {});

    return {
      ...record,
      rowNumber: index + 2,
    };
  });
}

function parseCsvRows(csvText: string) {
  const normalized = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const nextChar = normalized[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (char === "\n" && !inQuotes) {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);
  return rows;
}

function escapeCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function buildStudentImportPreviewRow(
  row: Record<string, string | number>,
  index: number,
  classMap: Record<string, string>
): StudentImportPreviewRow {
  const normalizedDob = normalizeImportedDate(String(row.dob || "").trim());
  const data: StudentFormState = {
    name: String(row.name || "").trim(),
    phone: String(row.phone || "").trim(),
    email: String(row.email || "").trim(),
    admissionNumber: String(row.admissionNumber || "").trim(),
    gender: String(row.gender || "").trim().toLowerCase(),
    dob: normalizedDob.value,
    rollNumber: String(row.rollNumber || "").trim(),
    fatherName: String(row.fatherName || "").trim(),
    motherName: String(row.motherName || "").trim(),
    alternatePhone: String(row.alternatePhone || "").trim(),
    address: String(row.address || "").trim(),
    classId: String(row.classId || "").trim(),
  };

  const errors: string[] = [];

  if (!data.name) {
    errors.push("Student name is required");
  }
  if (!data.phone) {
    errors.push("Phone is required");
  } else if (!/^\d{10}$/.test(data.phone)) {
    errors.push("Phone must be a 10-digit number");
  }
  if (!data.admissionNumber) {
    errors.push("Admission number is required");
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email format is invalid");
  }
  if (data.gender && !["male", "female", "other"].includes(data.gender)) {
    errors.push("Gender must be male, female, or other");
  }
  if (!normalizedDob.valid) {
    errors.push("Date of birth must be in YYYY-MM-DD or DD-MM-YYYY format");
  }
  if (data.rollNumber && !/^\d+$/.test(data.rollNumber)) {
    errors.push("Roll number must be numeric");
  }
  if (data.alternatePhone && !/^\d{10}$/.test(data.alternatePhone)) {
    errors.push("Alternate phone must be a 10-digit number");
  }
  if (data.classId && !classMap[data.classId]) {
    errors.push("Class ID was not found in the current class list");
  }

  return {
    id: `${data.admissionNumber || "row"}-${index}`,
    rowNumber: Number(row.rowNumber || index + 2),
    data,
    errors,
  };
}

function normalizeImportedDate(rawValue: string) {
  if (!rawValue) {
    return { valid: true, value: "" };
  }

  const isoMatch = rawValue.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return {
      valid: isValidDateParts(Number(year), Number(month), Number(day)),
      value: `${year}-${month}-${day}`,
    };
  }

  const dayFirstMatch = rawValue.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dayFirstMatch) {
    const [, day, month, year] = dayFirstMatch;
    return {
      valid: isValidDateParts(Number(year), Number(month), Number(day)),
      value: `${year}-${month}-${day}`,
    };
  }

  return { valid: false, value: rawValue };
}

function isValidDateParts(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    Number.isFinite(year) &&
    Number.isFinite(month) &&
    Number.isFinite(day) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
