import { useState } from "react";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function Contact() {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const school = String(formData.get("school") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`New message from ${name || "School Connect website"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        school ? `School: ${school}` : undefined,
        "",
        `Message:\n${message}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );

    window.location.href = `mailto:hello@school-connect.app?subject=${subject}&body=${body}`;

    setTimeout(() => {
      toast.success("Your email app should now be opening to send the message.");
      e.currentTarget.reset();
      setSending(false);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold gradient-text uppercase tracking-wider mb-3">Contact</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Get in touch</h2>
          <p className="mt-4 text-muted-foreground">We'd love to hear from your school.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@school-connect.app" },
              { icon: Phone, label: "Phone", value: "+91 95152 20406" },
              { icon: MapPin, label: "Address", value: "Hyderabad, Telangana, India" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5 flex gap-4 items-center">
                <div className="h-11 w-11 rounded-xl [background:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="font-semibold">{c.value}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center hover:[background:var(--gradient-primary)] hover:text-white transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-3xl p-6 md:p-8 bg-card border border-border shadow-[var(--shadow-card)] space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input required placeholder="Your name" name="name" className="h-12 rounded-xl" />
              <Input required type="email" placeholder="Email address" name="email" className="h-12 rounded-xl" />
            </div>
            <Input placeholder="School name" name="school" className="h-12 rounded-xl" />
            <Textarea required placeholder="How can we help?" name="message" rows={5} className="rounded-xl" />
            <Button type="submit" variant="hero" size="xl" disabled={sending} className="w-full sm:w-auto">
              { (<><Send className="h-4 w-4" /> Send Message</>)}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}