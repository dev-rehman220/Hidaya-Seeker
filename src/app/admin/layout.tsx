"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    PlusCircle,
    Newspaper,
    Settings,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Eye,
    Menu,
    X,
    Home,
    BookOpen,
    BarChart3,
    LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navSections = [
    {
        label: "Dashboard",
        items: [
            { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
            { href: "/admin?tab=cms", label: "Daily Content", icon: BookOpen },
            { href: "/admin?tab=posts", label: "Manage Posts", icon: Newspaper },
        ],
    },
    {
        label: "Create",
        items: [
            { href: "/admin/posts/new", label: "New Post", icon: PlusCircle },
        ],
    },
    {
        label: "View",
        items: [
            { href: "/posts", label: "Public Posts", icon: Eye },
            { href: "/", label: "Back to Site", icon: Home },
        ],
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const userName = typeof session?.user?.name === "string" ? session.user.name : "Admin";
    const userInitial = userName.charAt(0).toUpperCase() || "A";

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
        else if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/");
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="flex-grow flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") return null;

    const isActive = (href: string, exact?: boolean) => {
        const path = href.split("?")[0];
        if (exact) return pathname === path;
        return pathname.startsWith(path) && path !== "/";
    };

    const SidebarContent = () => (
        <>
            {/* Logo / Header */}
            <div className={`flex items-center border-b border-white/10 ${collapsed ? "justify-center p-3" : "justify-between p-4"}`}>
                {!collapsed && (
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-arabic text-lg text-white">هداية</span>
                            <span className="text-sm font-bold text-white">Admin</span>
                        </div>
                        <p className="text-xs text-white/50 truncate max-w-[160px] mt-0.5">{session?.user?.email}</p>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0 hidden md:flex"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0 md:hidden"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                {navSections.map(({ label, items }) => (
                    <div key={label}>
                        {!collapsed && (
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-1">{label}</p>
                        )}
                        <div className="space-y-0.5">
                            {items.map(({ href, label: itemLabel, icon: Icon, exact }) => {
                                const active = isActive(href, exact);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        title={collapsed ? itemLabel : undefined}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                                            active
                                                ? "bg-white/20 text-white shadow-sm"
                                                : "text-white/65 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-white/65 group-hover:text-white"}`} />
                                        {!collapsed && <span className="truncate">{itemLabel}</span>}
                                        {active && !collapsed && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-3 border-t border-white/10">
                {!collapsed ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 px-2 py-1">
                            <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-sm font-bold shrink-0 text-primary">
                                {userInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold truncate text-white">{userName}</p>
                                <p className="text-[10px] text-white/40">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signOut()}
                        className="w-full flex justify-center p-2 rounded-xl text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className="flex-grow flex overflow-hidden">
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                className={`
                    hidden md:flex flex-col shrink-0
                    sticky top-16 self-start h-[calc(100vh-4rem)]
                    bg-primary dark:bg-primary shadow-xl
                    transition-all duration-300 ease-in-out
                    ${collapsed ? "w-16" : "w-64"}
                `}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (drawer) */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 flex flex-col
                    bg-primary shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                    md:hidden
                `}
            >
                <SidebarContent />
            </aside>

            {/* Mobile fab to open sidebar */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed bottom-6 left-4 z-30 md:hidden bg-primary text-white p-3.5 rounded-full shadow-2xl hover:bg-primary-light transition-colors"
                aria-label="Open admin menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Main content */}
            <main className="flex-1 min-w-0 overflow-auto">
                {children}
            </main>
        </div>
    );
}
