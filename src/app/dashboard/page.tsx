"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bookmark as BookmarkIcon, Trash2, ArrowRight, User, Compass, BookOpen, Wrench, RefreshCw } from "lucide-react";
import { getBookmarks, toggleBookmark, Bookmark } from "@/lib/bookmarks";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setBookmarks(getBookmarks());
        setMounted(true);
    }, []);

    const handleRemoveBookmark = (bookmark: Bookmark) => {
        toggleBookmark(bookmark);
        setBookmarks(getBookmarks());
    };

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    })();

    if (status === "loading") {
        return (
            <div className="flex-grow flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex-grow flex items-center justify-center bg-neutral-light/30 dark:bg-black/10 px-4 py-12">
                <div className="w-full max-w-xl rounded-2xl border border-primary/15 bg-white dark:bg-neutral-dark p-8 text-center shadow-sm">
                    <h1 className="text-3xl font-bold text-primary dark:text-primary-light">Login Required</h1>
                    <p className="mt-3 text-neutral-dark/80 dark:text-neutral-light/80">
                        Please sign in to view your dashboard, bookmarks, and personalized quick links.
                    </p>
                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/login?callbackUrl=/dashboard"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-white hover:bg-primary-light"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-primary/20 px-5 text-sm font-medium hover:bg-primary/5"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className="flex-grow bg-neutral-light/30 dark:bg-black/10 py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary dark:text-primary-light">
                        {greeting}{session?.user?.name ? `, ${session.user.name}` : ""}!
                    </h1>
                    <p className="text-lg text-neutral-dark/80 dark:text-neutral-light/80">
                        Assalamu Alaikum — here are your saved items and quick links.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { href: "/account", icon: User, label: "My Account", color: "text-primary" },
                        { href: "/learn", icon: BookOpen, label: "Learn Islam", color: "text-secondary-dark dark:text-secondary-light" },
                        { href: "/tools", icon: Wrench, label: "Islamic Tools", color: "text-primary" },
                        { href: "/calendar", icon: Compass, label: "Calendar", color: "text-secondary-dark dark:text-secondary-light" },
                    ].map(({ href, icon: Icon, label, color }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-neutral-dark rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            <div className="p-2.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                <Icon className={`w-6 h-6 ${color}`} />
                            </div>
                            <span className="text-sm font-semibold text-center">{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Bookmarks Section */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                    <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookmarkIcon className="w-6 h-6 text-primary fill-primary/20" />
                            <h2 className="text-2xl font-bold text-primary dark:text-primary-light">Saved Items</h2>
                        </div>
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                            {bookmarks.length}
                        </span>
                    </div>

                    <div className="p-6">
                        {bookmarks.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <BookmarkIcon className="w-16 h-16 mx-auto text-neutral-dark/30 dark:text-neutral-light/30 mb-4" />
                                <h3 className="text-xl font-medium mb-2">No saved items yet</h3>
                                <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-6">
                                    Items you bookmark across the site will appear here.
                                </p>
                                <Link
                                    href="/learn"
                                    className="inline-flex items-center text-primary font-medium hover:underline"
                                >
                                    Explore Learn Islam <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bookmarks.map(item => (
                                    <div key={item.id} className="group relative flex flex-col justify-between p-4 rounded-xl border border-neutral-light dark:border-white/10 bg-neutral-light/20 dark:bg-black/20 hover:border-primary/50 transition-colors">
                                        <div className="pr-10 mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-secondary-light">
                                                    {item.type}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600"></span>
                                                <span className="text-xs opacity-70">{item.id}</span>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                                <Link href={item.url} className="before:absolute before:inset-0">
                                                    {item.title}
                                                </Link>
                                            </h4>
                                            {item.subtitle && (
                                                <p className="text-sm opacity-80 line-clamp-2">{item.subtitle}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center relative z-10 pt-2 border-t border-neutral-light/50 dark:border-white/5">
                                            <Link href={item.url} className="text-sm font-medium text-primary dark:text-primary-light hover:underline">
                                                View Details
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveBookmark(item);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                title="Remove Bookmark"
                                                aria-label={`Remove bookmark for ${item.title}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
