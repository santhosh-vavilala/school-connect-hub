import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/cookie-policy")({
    head: () => ({
        meta: [
            { title: "Cookie Policy | School Connect" },
            {
                name: "description",
                content:
                    "Cookie policy for School Connect explaining how cookies and similar technologies are used on our website and what users consent to by visiting the site.",
            },
        ],
    }),
    component: CookiePolicyPage,
});

function CookiePolicyPage() {
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
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Cookie Policy</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                        Cookie Policy
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        This Cookie Policy explains how School Connect uses cookies, local storage, and similar tracking technologies on our website and app-related pages.
                    </p>

                    <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">1. What are cookies?</h2>
                            <p className="mt-2">
                                Cookies are small text files stored on your device by your browser. They help websites remember preferences, improve performance, understand traffic, and provide a better user experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">2. What we use cookies for</h2>
                            <p className="mt-2">
                                We use cookies to remember language and UI preferences, keep the site secure, understand site usage, improve performance, and support essential functionality such as session management and basic analytics.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">3. Types of cookies we may use</h2>
                            <p className="mt-2">
                                We may use strictly necessary cookies to keep the site working, preference cookies to remember your settings, analytics cookies to understand usage patterns, and marketing or personalization cookies if enabled in the future. We will explain these uses clearly whenever applicable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">4. By visiting the website, you accept our cookies</h2>
                            <p className="mt-2">
                                By visiting School Connect and continuing to use our website, you agree that you have read and understood this Cookie Policy and that you accept the use of cookies and related information technologies described in this policy.
                            </p>
                            <p className="mt-3">
                                This includes the use of cookies, local storage, device identifiers, and other tracking or preference-related data as described in this policy and any future updates to it.
                            </p>
                            <p className="mt-3">
                                If you do not agree, you should adjust your browser settings, block cookies, or stop using the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">5. Your choices</h2>
                            <p className="mt-2">
                                You can manage or disable cookies through your browser settings. Please note that blocking or deleting cookies may affect the functionality of the website and some features may not work as intended.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">6. Updates to this policy</h2>
                            <p className="mt-2">
                                We may update this Cookie Policy from time to time to reflect changes in cookies, technology, or legal requirements. Continued use of the website after changes are made indicates acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
                            <p className="mt-2">
                                If you have questions about our use of cookies or this policy, please contact us through the contact form on our website.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}
