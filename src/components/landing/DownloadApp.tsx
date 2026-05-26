import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";
import appStoreQr from "@/assets/School.Connect App - App Store.svg";
import playStoreQr from "@/assets/School Connect - Apps on Google Play.svg";

export function DownloadApp() {
  return (
    <section id="download" className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl [background:var(--gradient-primary)] p-8 md:p-16 text-white shadow-[var(--shadow-glow)]"
        >
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Get School Connect on your phone
              </h2>
              <p className="mt-4 text-white/90 text-lg">
                Download School Connect and stay connected anytime, anywhere.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="https://apps.apple.com/in/app/school-connect/id6761590610" target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-3 rounded-xl bg-black/30 backdrop-blur px-5 py-3 hover:bg-black/50 transition-colors border border-white/20">
                  <Apple className="h-7 w-7" />
                  <div className="text-left">
                    <p className="text-[10px] opacity-80">Download on the</p>
                    <p className="text-sm font-semibold -mt-0.5">App Store</p>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.leadingapps.schoolconnect&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-3 rounded-xl bg-black/30 backdrop-blur px-5 py-3 hover:bg-black/50 transition-colors border border-white/20">
                  <Play className="h-7 w-7" />
                  <div className="text-left">
                    <p className="text-[10px] opacity-80">Get it on</p>
                    <p className="text-sm font-semibold -mt-0.5">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-4 md:justify-end">
              <div className="rounded-2xl bg-white p-5 shadow-2xl mx-1">
                <div className="h-44 w-44 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={appStoreQr}
                    alt="App Store QR code"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-center text-xs font-semibold text-foreground mt-3">App Store QR</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-2xl mx-1">
                <div className="h-44 w-44 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={playStoreQr}
                    alt="Google Play QR code"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-center text-xs font-semibold text-foreground mt-3">Google Play QR</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}