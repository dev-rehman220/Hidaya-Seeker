import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', preload: false, display: 'swap' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ["arabic"], variable: '--font-amiri', preload: false, display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://hidaya-seeker.vercel.app";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Hidaya Seeker | Daily Islamic Reminder",
        template: "%s | Hidaya Seeker",
    },
    description: "Daily Islamic reminders, Qur'an ayahs, hadith, duas, and practical tools to support your spiritual journey.",
    keywords: ["Islam", "Quran", "Hadith", "Dua", "Islamic reminders", "Prayer times", "Qibla", "Zakat"],
    authors: [{ name: "Hidaya Seeker" }],
    creator: "Hidaya Seeker",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "Hidaya Seeker",
        title: "Hidaya Seeker | Daily Islamic Reminder",
        description: "Daily Islamic reminders, Qur'an ayahs, hadith, duas, and practical tools.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hidaya Seeker | Daily Islamic Reminder",
        description: "Daily Islamic reminders, Qur'an ayahs, hadith, duas, and practical tools.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${amiri.variable} font-sans bg-neutral-light dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light min-h-screen flex flex-col`}>
                {gaId && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                            strategy="afterInteractive"
                        />
                        <Script id="ga4-init" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${gaId}');
                            `}
                        </Script>
                    </>
                )}
                <AuthProvider>
                    <ThemeProvider defaultTheme="system" storageKey="daily-reminder-theme">
                        <Header />
                        <main className="flex-grow flex flex-col">
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
