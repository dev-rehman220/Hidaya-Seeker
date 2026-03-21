"use client";

import React, { useState, useEffect } from 'react';
import { Star, RefreshCw, CalendarDays } from 'lucide-react';

export default function DailyReminder() {
    const [text, setText] = useState("Do not put off till tomorrow what you can do today. The time for genuine repentance is right now.");
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/content?date=${encodeURIComponent(selectedDate)}`);
                if (res.ok) {
                    const data = await res.json();
                    const item = data.find((i: any) => i.type === 'reminder');
                    if (item) setText(item.english);
                }
            } catch (err) {
                console.error("Failed to fetch reminder", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [selectedDate]);

    return (
        <section className="py-16 bg-gradient-to-r from-secondary/20 via-primary/10 to-secondary/20 dark:from-secondary/10 dark:via-primary/5 dark:to-secondary/10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="flex justify-center mb-4">
                        <Star className="w-10 h-10 text-secondary fill-secondary" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-light">
                        Islamic Reminder
                    </h2>
                    <div className="flex justify-center">
                        <div className="mt-1 flex items-center gap-2 rounded-xl border border-primary/20 bg-white/70 dark:bg-black/20 px-3 py-2">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent text-sm text-neutral-dark dark:text-neutral-light outline-none"
                                aria-label="Select date for Daily Reminder"
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <RefreshCw className="w-8 h-8 animate-spin text-primary/20" />
                        </div>
                    ) : (
                        <p className="text-xl md:text-2xl font-medium text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed italic">
                            &quot;{text}&quot;
                        </p>
                    )}
                    <div className="pt-4">
                        <button className="text-sm font-semibold text-primary hover:text-primary-dark dark:text-secondary-light transition-colors uppercase tracking-wider">
                            Share Reminder
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
