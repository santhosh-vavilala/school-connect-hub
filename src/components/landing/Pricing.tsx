import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  { range: "0 – 50", price: "₹499", popular: false },
  { range: "51 – 100", price: "₹999", popular: false },
  { range: "101 – 300", price: "₹1,999", popular: true },
  { range: "301 – 500", price: "₹3,499", popular: false },
  { range: "500+", price: "Contact Us", popular: false, custom: true },
];

const perks = ["All features included", "Unlimited parents", "Free updates", "Email support"];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 [background:var(--gradient-hero)] opacity-50" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold gradient-text uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">Pay only for what your school needs.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={t.range}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 ${
                t.popular
                  ? "[background:var(--gradient-primary)] text-white border-transparent shadow-[var(--shadow-glow)] scale-105"
                  : "bg-card border-border shadow-[var(--shadow-card)]"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold shadow">
                  POPULAR
                </span>
              )}
              <p className={`text-xs uppercase tracking-wider font-semibold ${t.popular ? "text-white/80" : "text-muted-foreground"}`}>
                Students
              </p>
              <p className="mt-1 font-bold text-lg">{t.range}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">{t.price}</span>
                {!t.custom && <span className={`text-sm ${t.popular ? "text-white/80" : "text-muted-foreground"}`}>/mo</span>}
              </div>
              <ul className="mt-5 space-y-2">
                {perks.map((p) => (
                  <li key={p} className={`flex items-center gap-2 text-sm ${t.popular ? "text-white/90" : "text-muted-foreground"}`}>
                    <Check className="h-4 w-4 flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="hero" size="xl" asChild>
            <a href="#contact">Get Started</a>
          </Button>
        </div>
      </div>
    </section>
  );
}