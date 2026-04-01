"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Bookmark, BookmarkCheck, CalendarDays, BookMarked } from 'lucide-react';
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

export default function DailyAyah() {
    const [content, setContent] = useState({
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        english: "\"For indeed, with hardship [will be] ease.\"",
        translation: "\"بیشک مشکل کے ساتھ آسانی ہے۔\"",
        reference: "Surah Ash-Sharh, Ayah 5",
        tafseer: "This verse assures believers that no difficulty is permanent. For every hardship, Allah provides relief, whether in this life or the next. It encourages patience and optimism."
    });
    const [loading, setLoading] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);
    const [showTafseer, setShowTafseer] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/content?date=${encodeURIComponent(selectedDate)}`);
                if (res.ok) {
                    const data = await res.json();
                    const item = data.find((i: any) => i.type === 'ayah');
                    if (item) setContent(item);
                }
            } catch (err) {
                console.error("Failed to fetch ayah", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [selectedDate]);

    useEffect(() => {
        setBookmarked(isBookmarked("ayah:daily"));
    }, []);

    const handleBookmark = () => {
        const newState = toggleBookmark({
            id: "ayah:daily",
            type: "ayah",
            title: content.reference.split(',')[0],
            subtitle: content.english,
            url: "/#daily-guidance"
        });
        setBookmarked(newState);
    };

    return (
        <section id="daily-guidance" className="py-12 bg-white dark:bg-neutral-dark">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-8 relative">
                    <BookOpen className="w-8 h-8 text-secondary mb-2" />
                    <h2 className="text-3xl font-bold text-primary dark:text-primary-light">Daily Qur'an Ayah</h2>
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-white/80 dark:bg-black/20 px-3 py-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-sm text-neutral-dark dark:text-neutral-light outline-none"
                            aria-label="Select date for Daily Ayah"
                        />
                    </div>
                    <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto bg-neutral-light/50 dark:bg-black/20 rounded-2xl p-8 border border-primary/10 shadow-sm relative overflow-hidden group">
                    {/* Decorative Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M50 0 L100 50 L50 100 L0 50 Z" />
                        </svg>
                    </div>

                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setShowTafseer(!showTafseer)}
                            className="p-2 rounded-full backdrop-blur-sm bg-primary/10 text-primary hover:bg-primary/20 dark:text-primary-light transition-colors"
                            title={showTafseer ? "Hide Tafseer" : "Show Tafseer"}
                        >
                            <BookMarked className="w-5 h-5" />
                        </button>
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

                    <div className="text-center space-y-6 relative z-10">
                        {loading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-12 bg-primary/10 rounded-xl w-3/4 mx-auto"></div>
                                <div className="h-8 bg-primary/10 rounded-xl w-1/2 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <p className="font-arabic text-3xl md:text-5xl leading-relaxed text-primary-dark dark:text-primary-light" dir="rtl">
                                    {content.arabic}
                                </p>
                                <div className="space-y-4">
                                    <p className="text-lg md:text-xl font-medium text-neutral-dark/90 dark:text-neutral-light/90">
                                        {content.english}
                                    </p>
                                    {content.translation && (
                                        <p className="text-md text-neutral-dark/70 dark:text-neutral-light/70 font-arabic" dir="rtl">
                                            {content.translation}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-4 flex justify-center items-center gap-2 text-sm text-primary dark:text-primary-light font-semibold">
                                    <span>{content.reference}</span>
                                </div>
                                
                                {showTafseer && content.tafseer && (
                                    <div className="mt-6 pt-6 border-t border-primary/20 dark:border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 text-left">
                                            <h3 className="font-bold text-primary dark:text-primary-light mb-3 flex items-center gap-2">
                                                <BookMarked className="w-4 h-4" />
                                                Tafseer (Explanation)
                                            </h3>
                                            <p className="text-sm md:text-base text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">
                                                {content.tafseer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
