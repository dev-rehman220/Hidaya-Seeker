"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Book, Star, Clock, Heart, Bookmark, BookmarkCheck,
    ChevronRight, ArrowRight, Shield, Users, Sparkles, BookOpen
} from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

const topics = [
    {
        id: "topic:basics",
        slug: "basics",
        title: "Basics of Islam",
        arabicTitle: "أساسيات الإسلام",
        description: "Explore the core concepts, the Shahada, and what it means to be a Muslim.",
        icon: Book,
        gradient: "from-primary to-emerald-700",
        bg: "bg-primary/5 dark:bg-primary/10",
        iconColor: "text-primary dark:text-primary-light",
        badge: "Foundation",
        verse: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ",
        verseRef: "Quran 3:19",
    },
    {
        id: "topic:pillars",
        slug: "pillars",
        title: "Five Pillars of Islam",
        arabicTitle: "أركان الإسلام الخمسة",
        description: "Shahadah, Salah, Zakat, Sawm, and Hajj — the foundations of practice.",
        icon: Shield,
        gradient: "from-amber-600 to-yellow-500",
        bg: "bg-amber-50 dark:bg-amber-900/10",
        iconColor: "text-amber-600 dark:text-amber-400",
        badge: "Practice",
        verse: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ",
        verseRef: "Bukhari",
    },
    {
        id: "topic:faith",
        slug: "faith",
        title: "Six Articles of Faith",
        arabicTitle: "أركان الإيمان الستة",
        description: "Believe in Allah, Angels, Books, Prophets, Judgment Day, and Divine Decree.",
        icon: Heart,
        gradient: "from-rose-600 to-red-500",
        bg: "bg-red-50 dark:bg-red-900/10",
        iconColor: "text-rose-600 dark:text-rose-400",
        badge: "Belief",
        verse: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ",
        verseRef: "Quran 2:285",
    },
];

const prophetsList = [
    { slug: "ibrahim-as", name: "Ibrahim (AS)", arabic: "إبراهيم", title: "Friend of Allah", label: "خليل الله" },
    { slug: "musa-as", name: "Musa (AS)", arabic: "موسى", title: "Spoke to Allah", label: "كليم الله" },
    { slug: "isa-as", name: "Isa (AS)", arabic: "عيسى", title: "Spirit of Allah", label: "روح الله" },
    { slug: "yusuf-as", name: "Yusuf (AS)", arabic: "يوسف", title: "The Patient One", label: "الصابر" },
    { slug: "nuh-as", name: "Nuh (AS)", arabic: "نوح", title: "Of the Ship", label: "صاحب السفينة" },
];

const timelineSnippet = [
    { title: "Birth in Makkah", year: "570 CE", desc: "Born in the Year of the Elephant to the noble Quraysh tribe." },
    { title: "First Revelation", year: "610 CE", desc: "Received 'Iqra' — the first verse of the Quran — in Cave Hira." },
    { title: "The Hijrah", year: "622 CE", desc: "The great migration from Makkah to Madinah. Year 1 AH begins." },
    { title: "Battle of Badr", year: "624 CE", desc: "A decisive victory that strengthened the Muslim community." },
    { title: "The Farewell Sermon", year: "632 CE", desc: "Final Hajj — the completion of the religion and human rights." },
];

export default function LearnIslamPage() {
    return (
        <div className="flex-grow flex flex-col bg-neutral-light/20 dark:bg-black/5">

            {/* ─── Hero ─────────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-emerald-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="lp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="0.8" />
                                <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#lp)" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-light dark:from-neutral-dark to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold tracking-wider uppercase mb-6 border border-white/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Islamic Education
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">Learn Islam</h1>
                    <p className="font-arabic text-3xl md:text-4xl text-yellow-300 mb-6" dir="rtl">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                        "Read in the name of your Lord who created" — Explore the teachings of Islam, the life of Prophet Muhammad ﷺ, and stories of the noble Prophets.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[{ href: "#core-topics", label: "Core Beliefs" }, { href: "#timeline", label: "Prophet's Life" }, { href: "#prophets", label: "Prophet Stories" }].map(({ href, label }) => (
                            <a key={href} href={href} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-colors">
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl w-full mx-auto px-4 md:px-8 pb-20">

                {/* ─── Core Topics ──────────────────────────────────────── */}
                <section id="core-topics" className="pt-16 mb-20">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-bold text-primary/60 dark:text-primary-light/60 uppercase tracking-widest mb-1">Start Here</p>
                            <h2 className="text-3xl font-bold text-primary dark:text-white">Core Beliefs & Practices</h2>
                        </div>
                        <BookOpen className="w-8 h-8 text-primary/20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topics.map((topic) => (
                            <TopicCard key={topic.id} topic={topic} />
                        ))}
                    </div>
                </section>

                {/* ─── Quran Verse Feature ───────────────────────────────── */}
                <section className="mb-20">
                    <div className="relative bg-gradient-to-r from-amber-50 via-yellow-50 to-transparent dark:from-secondary/10 dark:via-secondary/5 rounded-3xl border border-secondary/20 p-8 md:p-12 overflow-hidden">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-secondary/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-center md:text-right">
                                <p className="font-arabic text-3xl md:text-4xl text-primary dark:text-primary-light leading-[2] mb-3" dir="rtl">
                                    وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا
                                </p>
                                <p className="text-secondary-dark dark:text-secondary-light font-semibold text-sm mb-1">
                                    "And whoever obeys Allah and His Messenger has certainly attained a great attainment."
                                </p>
                                <p className="text-xs opacity-50">— Surah Al-Ahzab (33:71)</p>
                            </div>
                            <div className="shrink-0 w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center">
                                <Star className="w-8 h-8 text-secondary" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Prophet Muhammad Timeline ─────────────────────────── */}
                <section id="timeline" className="mb-20">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-bold text-primary/60 dark:text-primary-light/60 uppercase tracking-widest mb-1">Life of the Prophet ﷺ</p>
                            <h2 className="text-3xl font-bold text-primary dark:text-white flex items-center gap-3">
                                <Clock className="w-7 h-7" />
                                Journey of Light
                            </h2>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-dark rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 border-b border-primary/10">
                            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                                A glimpse into the life of Prophet Muhammad ﷺ — the Seal of all Prophets and Messengers.
                            </p>
                        </div>
                        <div className="p-6 md:p-10">
                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/15 rounded-full" />
                                <div className="space-y-8">
                                    {timelineSnippet.map((event, i) => (
                                        <div key={i} className="relative pl-16">
                                            <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary border-4 border-white dark:border-neutral-dark shadow-md" />
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-primary dark:text-primary-light">{event.title}</h3>
                                                <span className="inline-block px-3 py-0.5 text-xs font-bold rounded-full bg-secondary/10 text-secondary-dark dark:text-secondary-light w-fit">{event.year}</span>
                                            </div>
                                            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">{event.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 md:px-10 pb-8">
                            <Link href="/learn/prophet-timeline" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                                View Full Timeline <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Prophet Stories ───────────────────────────────────── */}
                <section id="prophets">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-bold text-primary/60 dark:text-primary-light/60 uppercase tracking-widest mb-1">Stories of the Prophets</p>
                            <h2 className="text-3xl font-bold text-primary dark:text-white flex items-center gap-3">
                                <Users className="w-7 h-7" />
                                قصص الأنبياء
                            </h2>
                        </div>
                        <p className="text-sm opacity-50 hidden md:block">Click any prophet to read their story</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {prophetsList.map((p, i) => (
                            <Link key={p.slug} href={`/learn/prophets/${p.slug}`} className="group relative bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 p-5 flex flex-col items-center text-center hover:shadow-lg hover:border-amber-300/60 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-arabic text-2xl font-bold text-primary group-hover:from-secondary/20 group-hover:to-amber-200/30 transition-all">
                                    {p.arabic[0]}
                                </div>
                                <p className="font-arabic text-base text-primary/50 dark:text-primary-light/40 mb-0.5" dir="rtl">{p.arabic}</p>
                                <h3 className="font-bold text-primary dark:text-primary-light text-sm group-hover:text-secondary-dark dark:group-hover:text-secondary-light transition-colors">{p.name}</h3>
                                <p className="text-[11px] text-neutral-dark/50 dark:text-neutral-light/50 mt-0.5 font-arabic" dir="rtl">{p.label}</p>
                                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary/50 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                                    Read Story <ChevronRight className="w-3 h-3" />
                                </div>
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-primary/40">{i + 1}</div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function TopicCard({ topic }: { topic: typeof topics[0] }) {
    const { id, slug, title, arabicTitle, description, icon: Icon, bg, iconColor, badge, verse, verseRef, gradient } = topic;
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => { setBookmarked(isBookmarked(id)); }, [id]);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        const newState = toggleBookmark({ id, type: "article", title, subtitle: description, url: `/learn/topics/${slug}` });
        setBookmarked(newState);
    };

    return (
        <Link href={`/learn/topics/${slug}`} className="group relative flex flex-col rounded-2xl border border-primary/10 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 bg-white dark:bg-neutral-dark">
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${bg} ${iconColor}`}>{badge}</span>
                        <button onClick={handleBookmark} className={`p-1.5 rounded-full transition-colors ${bookmarked ? "bg-secondary/20 text-secondary" : "opacity-0 group-hover:opacity-100 bg-primary/5 text-primary/60 hover:text-primary"}`} title={bookmarked ? "Remove bookmark" : "Bookmark"}>
                            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <p className="font-arabic text-lg text-primary/40 dark:text-primary-light/30 mb-1 text-right" dir="rtl">{arabicTitle}</p>
                <h3 className="text-xl font-bold text-primary dark:text-primary-light mb-2">{title}</h3>
                <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70 flex-1 mb-4">{description}</p>
                <div className="mt-auto pt-4 border-t border-primary/5">
                    <p className="font-arabic text-sm text-secondary dark:text-secondary-light text-right mb-0.5" dir="rtl">{verse}</p>
                    <p className="text-[10px] text-neutral-dark/40 dark:text-neutral-light/40 text-right">{verseRef}</p>
                </div>
            </div>
            <div className="px-6 pb-5">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-light group-hover:gap-3 transition-all">
                    <span>Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}

