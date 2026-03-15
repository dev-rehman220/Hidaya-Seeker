import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact Hidaya Seeker for support, feedback, or partnership inquiries.",
};

export default function ContactPage() {
    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light">Contact Us</h1>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                We welcome feedback, correction requests, and collaboration ideas.
            </p>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                Email us at <a className="text-primary hover:underline" href="mailto:support@hidayaseeker.com">support@hidayaseeker.com</a>
                , or use your account area for support-related updates.
            </p>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                You can also visit the <Link href="/account" className="text-primary hover:underline">Account</Link> page after signing in.
            </p>
        </section>
    );
}
