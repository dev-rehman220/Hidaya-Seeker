"use client";

import React, { useState, useEffect } from "react";
import { Link2, Bookmark, BookmarkCheck } from 'lucide-react';
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

export default function DailyDua() {
    const [content, setContent] = useState({
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "\"Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.\"",
        translation: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar",
        reference: "Al-Baqarah 2:201"
    });
    const [loading, setLoading] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                if (res.ok) {
                    const data = await res.json();
                    const item = data.find((i: any) => i.type === 'dua');
                    if (item) setContent(item);
                }
            } catch (err) {
                console.error("Failed to fetch dua", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        setBookmarked(isBookmarked("dua:daily"));
    }, []);

    const handleBookmark = () => {
        const newState = toggleBookmark({
            id: "dua:daily",
            type: "dua",
            title: "Dua of the Day",
            subtitle: content.reference,
            url: "/#daily-dua"
        });
        setBookmarked(newState);
    };

    return (
        <section id="daily-dua" className="py-12 bg-white dark:bg-neutral-dark">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="text-4xl mb-2 text-secondary font-arabic">🤲</div>
                    <h2 className="text-3xl font-bold text-primary dark:text-primary-light">Dua of the Day</h2>
                    <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 shadow-lg text-white relative group">
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleBookmark}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${bookmarked
                                ? 'bg-secondary/40 text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                        >
                            {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="text-center space-y-8">
                        {loading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-12 bg-white/10 rounded-xl w-3/4 mx-auto"></div>
                                <div className="h-8 bg-white/10 rounded-xl w-1/2 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <p className="font-arabic text-3xl md:text-5xl leading-relaxed text-secondary-light" dir="rtl">
                                    {content.arabic}
                                </p>
                                <div className="space-y-2 text-white/90">
                                    {content.translation && (
                                        <p className="text-lg italic font-medium opacity-80">
                                            {content.translation}
                                        </p>
                                    )}
                                    <p className="text-xl font-bold drop-shadow-sm">
                                        {content.english}
                                    </p>
                                </div>
                                <div className="pt-6 font-semibold text-secondary-light/80 text-sm">
                                    {content.reference}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
