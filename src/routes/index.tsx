import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { MissionVision } from "@/components/landing/MissionVision";
import { WhyChoose } from "@/components/landing/WhyChoose";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { DownloadApp } from "@/components/landing/DownloadApp";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "School Connect — Connecting Schools, Parents & Students" },
      { name: "description", content: "All-in-one school communication app for announcements, attendance, homework, fees, and parent engagement." },
      { property: "og:title", content: "School Connect — School Communication Platform" },
      { property: "og:description", content: "Manage your school communication effortlessly with School Connect." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <MissionVision />
      <WhyChoose />
      <Pricing />
      <Testimonials />
      <FAQ />
      <DownloadApp />
      <Contact />
      <Footer />
      <Toaster />
    </main>
  );
}
