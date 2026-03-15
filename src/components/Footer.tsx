"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';

function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
        }
    };

    if (subscribed) {
        return (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Subscribed! JazakAllah Khayran.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubscribe} className="flex space-x-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                aria-label="Email address for newsletter subscription"
                className="flex h-9 w-full rounded-md border border-primary/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <button type="submit" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary-light shrink-0">
                Join
            </button>
        </form>
    );
}

export default function Footer() {
    return (
        <footer className="w-full border-t border-primary/20 bg-neutral-light dark:bg-neutral-dark mt-auto">
            <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary dark:text-primary-light">Daily Reminder</h3>
                        <p className="text-sm opacity-80 max-w-xs">
                            Providing daily Islamic guidance, educational resources, and useful tools for Muslims worldwide.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li><Link href="/" className="hover:text-primary dark:hover:text-primary-light">Home</Link></li>
                            <li><Link href="/learn" className="hover:text-primary dark:hover:text-primary-light">Learn Islam</Link></li>
                            <li><Link href="/posts" className="hover:text-primary dark:hover:text-primary-light">Posts & Videos</Link></li>
                            <li><Link href="/tools" className="hover:text-primary dark:hover:text-primary-light">Islamic Tools</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li><Link href="/donate" className="hover:text-secondary dark:hover:text-secondary-light flex items-center"><Heart className="w-4 h-4 mr-1" /> Donate</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary dark:hover:text-primary-light">My Dashboard</Link></li>
                            <li><Link href="/calendar" className="hover:text-primary dark:hover:text-primary-light">Islamic Calendar</Link></li>
                            <li><Link href="/contact" className="hover:text-primary dark:hover:text-primary-light">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <p className="text-sm opacity-80 mb-4">Subscribe to our newsletter for weekly reminders.</p>
                        <NewsletterForm />
                    </div>
                </div>
                <div className="mt-8 border-t border-primary/10 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm opacity-60">
                        © {new Date().getFullYear()} Islamic Daily Reminder. All rights reserved.
                    </p>
                    <div className="flex space-x-4 text-sm opacity-60">
                        <Link href="/about" className="hover:text-primary dark:hover:text-primary-light">About</Link>
                        <Link href="/privacy" className="hover:text-primary dark:hover:text-primary-light">Privacy Policy</Link>
                        <Link href="/donate" className="hover:text-primary dark:hover:text-primary-light">Donate</Link>
                        <Link href="/dashboard" className="hover:text-primary dark:hover:text-primary-light">Dashboard</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
