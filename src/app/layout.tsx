import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', preload: false, display: 'swap' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ["arabic"], variable: '--font-amiri', preload: false, display: 'swap' });

export const metadata: Metadata = {
    title: "Islamic Daily Reminder",
    description: "A modern full-stack Islamic web application featuring daily guidance, educational resources, and useful Islamic tools.",
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
