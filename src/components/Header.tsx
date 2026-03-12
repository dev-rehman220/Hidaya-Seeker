"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LayoutDashboard, LogOut, User as UserIcon, Menu, X, Settings, Moon } from 'lucide-react';
import { format } from 'date-fns';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/learn', label: 'Learn Islam' },
    { href: '/posts', label: 'Posts' },
    { href: '/tools', label: 'Tools' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/donate', label: 'Donate' },
];

export default function Header() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hijriDate, setHijriDate] = useState('');
    const isAdmin = (session?.user as any)?.role === 'admin';
    const pathname = usePathname();
    const today = new Date();

    useEffect(() => {
        const formatted = format(today, 'dd-MM-yyyy');
        fetch(`https://api.aladhan.com/v1/gToH/${formatted}`)
            .then(r => r.json())
            .then(d => {
                if (d?.data?.hijri) {
                    const h = d.data.hijri;
                    setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
                }
            })
            .catch(() => {});
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-neutral-light/95 dark:bg-neutral-dark/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-light/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

                {/* Logo + Date */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
                        <span className="text-xl font-bold font-arabic text-primary dark:text-primary-light">هداية</span>
                        <span className="font-bold hidden sm:inline-block">Daily Reminder</span>
                    </Link>
                    {/* Date badge — visible near logo on large screens */}
                    {hijriDate && (
                        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-primary/70 dark:text-primary-light/70 bg-primary/8 dark:bg-primary/15 border border-primary/15 px-2.5 py-1 rounded-full">
                            <Moon className="w-3 h-3 text-secondary" />
                            <span>{hijriDate}</span>
                        </div>
                    )}
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                    {navLinks.map(link => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-2.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                                    active
                                        ? 'text-primary dark:text-primary-light bg-primary/8 dark:bg-primary/15'
                                        : 'hover:text-primary dark:hover:text-primary-light hover:bg-primary/5'
                                }`}
                            >
                                {link.label}
                                {active && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full bg-primary dark:bg-primary-light" />}
                            </Link>
                        );
                    })}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs lg:text-sm font-bold transition-all ${
                                pathname.startsWith('/admin')
                                    ? 'text-white bg-primary'
                                    : 'text-primary dark:text-primary-light bg-primary/10 hover:bg-primary hover:text-white'
                            }`}
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Right side: Theme + Auth + Hamburger */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {status === "authenticated" ? (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/account"
                                className="flex items-center gap-1.5 text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary dark:hover:text-primary-light transition-all"
                                title="My Account"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span className="max-w-[100px] truncate">{session.user?.name}</span>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium hover:text-primary dark:hover:text-primary-light">
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white shadow transition-colors hover:bg-primary-light"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Hamburger – mobile only */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-primary/20 bg-neutral-light dark:bg-neutral-dark shadow-lg">
                    <nav className="flex flex-col px-4 py-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary dark:hover:text-primary-light transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={closeMenu}
                                className="px-3 py-2.5 rounded-lg text-sm font-bold text-primary dark:text-primary-light flex items-center gap-2 hover:bg-primary/5 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Admin CMS
                            </Link>
                        )}
                    </nav>

                    <div className="px-4 pb-4 pt-2 border-t border-primary/10">
                        {status === "authenticated" ? (
                            <div className="space-y-2">
                                <div className="px-3 py-2 text-sm opacity-60 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    {session?.user?.name}
                                </div>
                                <Link
                                    href="/account"
                                    onClick={closeMenu}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary dark:hover:text-primary-light transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    My Account
                                </Link>
                                <button
                                    onClick={() => { signOut(); closeMenu(); }}
                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={closeMenu}
                                    className="px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-medium text-center hover:bg-primary-light transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
