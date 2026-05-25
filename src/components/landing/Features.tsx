import { motion } from "framer-motion";
import {
  CalendarCheck, BookOpen, Megaphone, Bell, CalendarDays,
  Wallet, TrendingUp, MessagesSquare,
} from "lucide-react";

const features = [
  { icon: CalendarCheck, title: "Attendance Tracking", desc: "Daily attendance with instant parent updates." },
  { icon: BookOpen, title: "Homework & Assignments", desc: "Share, submit, and track homework digitally." },
  { icon: Megaphone, title: "School Announcements", desc: "Reach every parent with one tap." },
  { icon: Bell, title: "Parent Notifications", desc: "Real-time push alerts that matter." },
  { icon: CalendarDays, title: "Event Management", desc: "Plan, schedule, and RSVP for events." },
  { icon: Wallet, title: "Fee Reminders", desc: "Automated fee notifications and receipts." },
  { icon: TrendingUp, title: "Student Progress", desc: "Reports, grades, and growth insights." },
  { icon: MessagesSquare, title: "Teacher Communication", desc: "Secure two-way chat with teachers." },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold gradient-text uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything your school needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful tools designed for modern schools, parents, teachers and students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl p-6 bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl [background:var(--gradient-primary)] opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl [background:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}