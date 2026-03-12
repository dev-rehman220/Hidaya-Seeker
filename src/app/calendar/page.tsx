"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Moon, Star } from "lucide-react";
import { HijriDate } from "@/lib/prayerTimes";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHijriDate() {
            setLoading(true);
            try {
                const res = await fetch(`https://api.aladhan.com/v1/gToH/${format(currentDate, "dd-MM-yyyy")}`);
                const data = await res.json();
                setHijriDate(data.data.hijri);
            } catch (error) {
                console.error("Failed to fetch Hijri date", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHijriDate();
    }, [currentDate]);

    const changeDay = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const changeMonth = (months: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + months);
        setCurrentDate(newDate);
    };

    const islamicEvents = [
        { name: "Ramadan Begins", date: "1 Ramadan" },
        { name: "Eid al-Fitr", date: "1 Shawwal" },
        { name: "Day of Arafah", date: "9 Dhul Hijjah" },
        { name: "Eid al-Adha", date: "10 Dhul Hijjah" },
        { name: "Islamic New Year", date: "1 Muharram" },
        { name: "Ashura", date: "10 Muharram" }
    ];

    return (
        <div className="flex-grow flex flex-col items-center py-12 px-4 md:px-8 bg-neutral-light/50 dark:bg-black/10">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12 space-y-4">
                    <div className="flex justify-center mb-2">
                        <Moon className="w-12 h-12 text-secondary fill-secondary/20" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light">
                        Islamic Calendar
                    </h1>
                    <p className="text-lg text-neutral-dark/80 dark:text-neutral-light/80 max-w-2xl mx-auto">
                        Stay aligned with the Hijri dates and important Islamic events.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Calendar View */}
                    <div className="md:col-span-2 bg-white dark:bg-neutral-dark rounded-3xl shadow-lg border border-primary/10 overflow-hidden">
                        {/* Calendar Header */}
                        <div className="bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute opacity-10 right-0 top-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                                <Star className="w-full h-full" />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-1">
                                    {loading ? "..." : (hijriDate ? `${hijriDate.month.en} ${hijriDate.year}` : "Loading")}
                                </h2>
                                <div className="flex items-center gap-2 text-primary-light">
                                    <Calendar className="w-4 h-4" />
                                    <span>{format(currentDate, "MMMM yyyy")}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 relative z-10">
                                <button onClick={() => changeDay(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Previous Day">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={() => changeDay(1)} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Next Day">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Daily View Block */}
                        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                            {loading ? (
                                <div className="animate-pulse space-y-4 w-full max-w-sm">
                                    <div className="h-20 bg-primary/10 rounded-xl w-3/4 mx-auto"></div>
                                    <div className="h-6 bg-primary/10 rounded w-1/2 mx-auto"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-8xl font-bold text-primary dark:text-primary-light mb-4">
                                        {hijriDate?.day}
                                    </p>
                                    <p className="text-3xl font-arabic text-secondary dark:text-secondary-light mb-6" dir="rtl">
                                        {hijriDate?.month.ar} {hijriDate?.year}
                                    </p>
                                    <div className="w-24 h-1 bg-primary/20 rounded-full mb-6"></div>
                                    <p className="text-xl font-medium text-neutral-dark/80 dark:text-neutral-light/80">
                                        {format(currentDate, "EEEE, MMMM do, yyyy")}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="bg-primary/5 p-4 flex justify-between">
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="text-sm font-semibold text-primary px-4 py-2 hover:bg-white dark:hover:bg-neutral-dark rounded-lg transition-colors"
                            >
                                Today
                            </button>
                        </div>
                    </div>

                    {/* Key Events Sidebar */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-primary dark:text-primary-light border-b border-primary/10 pb-4">
                            Important Events
                        </h3>
                        <div className="space-y-4">
                            {islamicEvents.map((event, idx) => (
                                <div key={idx} className="bg-white dark:bg-neutral-dark p-4 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-neutral-dark dark:text-neutral-light">{event.name}</h4>
                                    </div>
                                    <p className="text-sm font-medium text-secondary dark:text-secondary-light bg-secondary/10 inline-block px-2 py-1 rounded">
                                        {event.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
