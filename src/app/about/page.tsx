import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "Learn about Hidaya Seeker and our mission to provide daily Islamic guidance.",
};

export default function AboutPage() {
    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light">About Hidaya Seeker</h1>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                Hidaya Seeker is a faith-centered platform designed to make daily Islamic learning simple and accessible.
                Our goal is to help Muslims build consistency through reminders, authentic content, and practical tools.
            </p>
            <p className="mt-4 text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                We focus on clarity, authenticity, and usability so visitors can quickly find beneficial Qur'an ayahs,
                hadith, duas, and spiritual resources.
            </p>
        </section>
    );
}
