import { motion } from "framer-motion";
import { Zap, Shield, BellRing, IndianRupee, Smartphone, Headphones } from "lucide-react";

const points = [
  { icon: Zap, title: "Easy to Use", desc: "Intuitive design parents love." },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade data protection." },
  { icon: BellRing, title: "Real-Time Notifications", desc: "Updates delivered instantly." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Plans for every school size." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Beautiful on every device." },
  { icon: Headphones, title: "Fast Support", desc: "Help when you need it most." },
];

export function WhyChoose() {
  return (
    <section id="why" className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold gradient-text uppercase tracking-wider mb-3">Why Choose</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Built for schools that <span className="gradient-text">care</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass rounded-2xl p-6 flex gap-4 hover:scale-[1.02] transition-transform"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-xl [background:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                <p.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}