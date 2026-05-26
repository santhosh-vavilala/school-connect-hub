import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | School Connect" },
      {
        name: "description",
        content: "Privacy policy for School Connect, covering how we collect, use, store, and protect user information.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
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
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Privacy Policy</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            This Privacy Policy explains how School Connect collects, uses, stores, and protects information when you use our mobile app and website.
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
              <p className="mt-2">
                We may collect account details such as your name, email address, phone number, school information, parent/student role, and profile data you choose to share. We also collect usage information such as app activity, device information, and technical logs necessary for support and security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="mt-2">
                Your information is used to create and manage your account, send important school updates, enable attendance and communication features, improve the service, and provide customer support. We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Data Security</h2>
              <p className="mt-2">
                We take reasonable technical and organizational steps to protect your data, including secure storage, access controls, and encryption where applicable. While no system is completely risk-free, we are committed to maintaining a secure environment for all users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Sharing of Information</h2>
              <p className="mt-2">
                We may share limited information with authorized school administrators, teachers, and parents where needed to deliver the School Connect service. We may also share information when required by law or to protect the rights and safety of users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Your Choices</h2>
              <p className="mt-2">
                You can update your profile settings, manage notification preferences, and delete your account subject to applicable law and service requirements. We recommend reviewing account settings regularly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Contact Us</h2>
              <p className="mt-2">
                If you have questions about this policy, please contact us through the contact form on our website or by reaching out to the School Connect support team.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
