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
                            <h2 className="text-lg font-semibold text-foreground">4. Service Availability and Downtime</h2>
                            <p className="mt-2">
                                We strive to keep School Connect available and reliable, but we cannot guarantee uninterrupted access. The service may be unavailable due to maintenance, upgrades, server issues, network problems, third-party outages, cyber incidents, or other unforeseen circumstances beyond our reasonable control.
                            </p>
                            <p className="mt-3">
                                During such periods, access may be delayed, reduced, or temporarily unavailable. We may not be able to restore service immediately or prevent every disruption. You acknowledge that the app may sometimes be unavailable and that you use the service at your own discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">5. Your Use of the App is at Your Own Risk</h2>
                            <p className="mt-2">
                                School Connect is provided on an “as is” and “as available” basis. Your use of the app is entirely your own choice. You are responsible for deciding whether the service is suitable for your school, staff, parents, or students.
                            </p>
                            <p className="mt-3">
                                We do not guarantee that the app will be error-free, secure, or suitable for every purpose. You should review the app’s features, permissions, and limitations before relying on it for critical school operations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
                            <p className="mt-2">
                                To the fullest extent permitted by law, School Connect and its team shall not be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages arising from your use of the app or inability to access it.
                            </p>
                            <p className="mt-3">
                                This includes, without limitation, loss of data, interrupted communication, missed announcements, delayed attendance updates, loss of revenue, business interruption, loss of reputation, or any other loss arising from service outages, bugs, incorrect information, or third-party integrations.
                            </p>
                            <p className="mt-3">
                                We are not responsible for any loss, damage, or inconvenience caused by reliance on information or messages sent through the platform, except where liability cannot be excluded under applicable law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">7. Indemnity</h2>
                            <p className="mt-2">
                                You agree to indemnify and hold harmless School Connect, its employees, partners, and affiliates from any claims, losses, damages, liabilities, or expenses arising from your misuse of the app, your violation of these terms, or your negligent or unlawful use of the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">8. User Responsibilities and Data Handling</h2>
                            <p className="mt-2">
                                You are responsible for ensuring that the information you share through School Connect is accurate, lawful, and appropriate. You must not upload or transmit content that is harmful, misleading, abusive, or otherwise prohibited.
                            </p>
                            <p className="mt-3">
                                While we implement reasonable security measures, you acknowledge that no online system can guarantee complete protection against unauthorized access, misuse, or data loss. You should keep backups of important records where necessary and use the app in accordance with your school’s policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">9. Third-Party Services</h2>
                            <p className="mt-2">
                                School Connect may integrate with third-party services such as cloud providers, analytics tools, notification systems, or payment providers. Their availability, performance, and privacy practices are outside our control, and any issues affecting those services may impact the app.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">10. Termination</h2>
                            <p className="mt-2">
                                We may suspend or terminate access to the service at any time, with or without notice, if we believe the service is being misused, the account is compromised, or these terms are violated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">11. Changes to Terms</h2>
                            <p className="mt-2">
                                We may update these Terms & Conditions from time to time. Continued use of the service after changes are published constitutes acceptance of the updated terms. We may notify users of major changes through the app or website where practical.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">12. Governing Law</h2>
                            <p className="mt-2">
                                These Terms & Conditions are governed by the laws of the jurisdiction in which School Connect operates, without regard to conflict of law principles. If any issue cannot be resolved amicably, the courts of that jurisdiction shall have exclusive authority.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">13. Contact</h2>
                            <p className="mt-2">
                                If you have questions about these Terms & Conditions, please contact the School Connect support team through the contact form on our website.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}
