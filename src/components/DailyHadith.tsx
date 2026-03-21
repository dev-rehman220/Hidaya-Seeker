"use client";

import React, { useState, useEffect } from "react";
import { Library, Bookmark, BookmarkCheck, CalendarDays } from 'lucide-react';
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

export default function DailyHadith() {
    const [content, setContent] = useState({
        arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِکُلِّ امْرِئٍ مَا نَوَى",
        english: "\"Actions are [judged] by intentions (niyyah), so each man will have what he intended.\"",
        reference: "Sahih al-Bukhari 1",
        subtitle: "Book of Revelation"
    });
    const [loading, setLoading] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/content?date=${encodeURIComponent(selectedDate)}`);
                if (res.ok) {
                    const data = await res.json();
                    const item = data.find((i: any) => i.type === 'hadith');
                    if (item) setContent(item);
                }
            } catch (err) {
                console.error("Failed to fetch hadith", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [selectedDate]);

    useEffect(() => {
        setBookmarked(isBookmarked("hadith:daily"));
    }, []);

    const handleBookmark = () => {
        const newState = toggleBookmark({
            id: "hadith:daily",
            type: "hadith",
            title: content.reference,
            subtitle: content.english,
            url: "/#daily-hadith"
        });
        setBookmarked(newState);
    };

    return (
        <section id="daily-hadith" className="py-12 bg-primary/5 dark:bg-black/10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <Library className="w-8 h-8 text-secondary mb-2" />
                    <h2 className="text-3xl font-bold text-primary dark:text-primary-light">Daily Hadith</h2>
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-white/80 dark:bg-black/20 px-3 py-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-sm text-neutral-dark dark:text-neutral-light outline-none"
                            aria-label="Select date for Daily Hadith"
                        />
                    </div>
                    <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-dark rounded-2xl p-8 border border-primary/10 shadow-sm relative group">
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleBookmark}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${bookmarked
                                ? 'bg-secondary/20 text-secondary'
                                : 'bg-primary/10 text-primary hover:bg-primary/20 dark:text-primary-light'
                                }`}
                            title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                        >
                            {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="text-center space-y-6">
                        {loading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-10 bg-primary/5 rounded-xl w-3/4 mx-auto"></div>
                                <div className="h-6 bg-primary/5 rounded-xl w-1/2 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <p className="font-arabic text-2xl md:text-4xl leading-loose text-primary-dark dark:text-primary-light" dir="rtl">
                                    {content.arabic}
                                </p>
                                <div className="space-y-4 max-w-2xl mx-auto">
                                    <p className="text-lg font-medium text-neutral-dark/90 dark:text-neutral-light/90">
                                        {content.english}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-neutral-light dark:border-white/10 flex justify-center items-center gap-2 text-sm text-primary font-semibold">
                                    <span>{content.reference}</span>
                                    {content.subtitle && (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                            <span>{content.subtitle}</span>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
