import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How quickly can my school get started?", a: "Most schools are up and running within 24 hours. Our team helps with onboarding and data import." },
  { q: "Is my school's data secure?", a: "Absolutely. We use bank-grade encryption, secure servers, and follow strict privacy policies." },
  { q: "Can parents use it on any phone?", a: "Yes — School Connect works on both Android and iOS, with a responsive web app as well." },
  { q: "Do you offer a free trial?", a: "Yes, every plan starts with a 14-day free trial. No credit card required." },
  { q: "What kind of support do you provide?", a: "Email, chat, and phone support during business hours, plus a dedicated success manager on larger plans." },
];

export function FAQ() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold gradient-text uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-5 shadow-[var(--shadow-card)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}