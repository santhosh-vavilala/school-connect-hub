import { motion } from "framer-motion";
import { Star } from "lucide-react";

const items = [
  { name: "Priya Sharma", role: "Parent", text: "I never miss an update about my child anymore. The notifications are instant and helpful!" },
  { name: "Mr. Rajesh Kumar", role: "Parent", text: "School Connect has completely transformed how we communicate with our 800+ parents." },
  { name: "Anita Verma", role: "Teacher", text: "Sharing homework and reaching parents is now effortless. A real time-saver." },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold gradient-text uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Loved by schools & parents</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-6 bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-shadow"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 italic">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full [background:var(--gradient-primary)] flex items-center justify-center text-white font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}