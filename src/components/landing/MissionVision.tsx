import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Empower schools with simple and powerful digital communication tools that bring everyone together.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To make every school digitally connected and accessible for parents and students everywhere.",
  },
];

export function MissionVision() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-card text-card-foreground border border-border shadow-[var(--shadow-card)]"
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full [background:var(--gradient-primary)] opacity-20 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl [background:var(--gradient-primary)] shadow-[var(--shadow-glow)] mb-5">
                <it.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">{it.title}</h3>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{it.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}