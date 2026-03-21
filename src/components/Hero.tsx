"use client";

import React from 'react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="w-full py-16 md:py-28 lg:py-36 xl:py-48 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
            {/* Islamic geometric background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="islamic-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            <path d="M40 10 L50 30 L40 50 L30 30 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#islamic-pattern)" />
                </svg>
            </div>
            {/* Radial glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
            </div>

           
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary flex flex-col gap-2">
                    <span className="font-arabic text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 text-primary-dark dark:text-primary-light">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                    <span>Find Peace in Remembrance</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-neutral-dark/80 dark:text-neutral-light/80 md:text-xl/relaxed lg:text-2xl/relaxed mt-6">
                    Your daily source of Islamic guidance, authentic Hadiths, beautiful Duas, and spiritual growth.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                    <Link href="#daily-guidance" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary-light">
                        Read Today's Guidance
                    </Link>
                    <Link href="/learn" className="inline-flex h-12 items-center justify-center rounded-md border border-primary/20 bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-primary/5">
                        Explore Resources
                    </Link>
                </div>
            </div>
        </section>
    );
}
