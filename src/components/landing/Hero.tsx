import { motion } from "framer-motion";
import { Download, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import mockup from "@/assets/app-mockup.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 [background:var(--gradient-hero)]" />
      <div className="absolute top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute top-40 right-0 -z-10 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>New: Real-time parent notifications</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Manage Your School{" "}
              <span className="gradient-text">Communication</span> Effortlessly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              School Connect helps schools manage announcements, attendance, homework, events,
              and parent engagement — all in one beautifully simple app.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <a href="#download"><Download className="h-4 w-4" /> Download App</a>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <a href="#contact"><MessageCircle className="h-4 w-4" /> Contact Us</a>
              </Button>
            </div>
            {/* <div className="mt-10 flex gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div><span className="font-bold text-foreground text-xl">500+</span> Schools</div>
              <div><span className="font-bold text-foreground text-xl">50K+</span> Parents</div>
              <div><span className="font-bold text-foreground text-xl">4.9★</span> Rating</div>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 -z-10 [background:var(--gradient-primary)] opacity-20 blur-3xl rounded-full" />
            <img
              src={mockup}
              alt="School Connect mobile app preview"
              width={1024}
              height={1024}
              className="w-full max-w-md"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}