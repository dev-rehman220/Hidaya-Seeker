import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read the privacy policy for Hidaya Seeker.",
};

export default function PrivacyPage() {
    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light">Privacy Policy</h1>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                We collect only the minimum account and usage data required to provide core functionality,
                including authentication and personalized dashboard features.
            </p>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                We do not sell personal data. When analytics is enabled, aggregate usage metrics are used
                to improve content and product experience.
            </p>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                If you need account-related data support, contact us at support@hidayaseeker.com.
            </p>
        </section>
    );
}
