import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | School Connect" },
      {
        name: "description",
        content: "Terms and conditions for using School Connect services, including account use, acceptable use, and responsibilities.",
      },
    ],
  }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-8 rounded-3xl border border-border bg-card/60 p-8 shadow-sm md:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Terms & Conditions</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-muted-foreground">
            By using School Connect, you agree to the terms below. These terms describe how the service may be used and what responsibilities both users and School Connect have.
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By creating an account or using School Connect, you agree to these Terms & Conditions and any additional policies referenced within them.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Use of the Service</h2>
              <p className="mt-2">
                You agree to use School Connect only for lawful purposes and in a manner that respects the rights of schools, parents, students, and other users. You must not misuse the platform, attempt unauthorized access, or distribute harmful content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Accounts and Responsibilities</h2>
              <p className="mt-2">
                You are responsible for maintaining the confidentiality of your login credentials and for all activity associated with your account. Please notify us promptly if you suspect unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Service Availability</h2>
              <p className="mt-2">
                We strive to keep School Connect available and reliable, but we cannot guarantee uninterrupted service. Planned maintenance or unforeseen technical issues may temporarily affect access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
              <p className="mt-2">
                School Connect is provided on an "as is" basis. To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Changes to Terms</h2>
              <p className="mt-2">
                We may update these Terms & Conditions from time to time. Continued use of the service after changes are published constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Governing Law</h2>
              <p className="mt-2">
                These Terms & Conditions are governed by the laws of the jurisdiction in which School Connect operates, without regard to conflict of law principles.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
