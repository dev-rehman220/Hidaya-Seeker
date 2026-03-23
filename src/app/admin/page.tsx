"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    BookOpen,
    Library,
    Heart,
    Star,
    Save,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Users,
    FileText,
    Video,
    Eye,
    FilePen,
    TrendingUp,
    Settings,
    PlusCircle,
    Newspaper,
    ChevronRight,
    Wallet,
    ShieldCheck,
    AlertTriangle,
    Image as ImageIcon,
} from "lucide-react";
import { Suspense } from "react";

type ContentType = "ayah" | "hadith" | "dua" | "reminder";

interface ContentItem {
    type: ContentType;
    arabic?: string;
    english: string;
    translation?: string;
    reference?: string;
    subtitle?: string;
}

interface Stats {
    totalUsers: number;
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    contentItems: number;
    recentPosts: { _id: string; title: string; type: string; status: string; createdAt: string }[];
}

interface FinanceData {
    totals: {
        totalDonationsUsd: number;
        totalRecords: number;
        succeeded: number;
        pending: number;
        failed: number;
        overallSuccessRate: number;
        overallHealth: "healthy" | "monitor" | "critical";
    };
    methods: {
        method: "card" | "bank" | "wallet";
        total: number;
        succeeded: number;
        pending: number;
        failed: number;
        successRate: number;
        health: "healthy" | "monitor" | "critical";
    }[];
    recentDonations: {
        _id: string;
        donorName: string;
        amount: number;
        currency: string;
        currencySymbol: string;
        cause: string;
        donationType: string;
        paymentMethod: string;
        paymentStatus: "succeeded" | "pending" | "failed";
        transactionId: string;
        createdAt: string;
    }[];
}

function AdminPageInner() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<ContentType | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [finance, setFinance] = useState<FinanceData | null>(null);
    const [financeLoading, setFinanceLoading] = useState(true);

    const [content, setContent] = useState<Record<ContentType, ContentItem>>({
        ayah: { type: "ayah", arabic: "", english: "", translation: "", reference: "" },
        hadith: { type: "hadith", arabic: "", english: "", reference: "", subtitle: "" },
        dua: { type: "dua", arabic: "", english: "", translation: "", reference: "" },
        reminder: { type: "reminder", english: "" },
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if ((session?.user as any)?.role !== "admin") {
                router.push("/");
                return;
            }
            Promise.all([fetchContent(), fetchStats(), fetchFinance()]).finally(() => setLoading(false));
        }
    }, [status, session]);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/content");
            if (res.ok) {
                const data = await res.json();
                const newContent = { ...content };
                data.forEach((item: ContentItem) => {
                    newContent[item.type] = item;
                });
                setContent(newContent);
            }
        } catch (error) {
            console.error("Failed to fetch content", error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const fetchFinance = async () => {
        setFinanceLoading(true);
        try {
            const res = await fetch("/api/admin/finance");
            if (res.ok) {
                const data = await res.json();
                setFinance(data);
            }
        } catch (error) {
            console.error("Failed to fetch finance", error);
        } finally {
            setFinanceLoading(false);
        }
    };

    const handleSave = async (type: ContentType) => {
        setSaving(type);
        setMessage(null);
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content[type]),
            });
            if (res.ok) {
                setMessage({ type: "success", text: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!` });
                setTimeout(() => setMessage(null), 4000);
            } else {
                setMessage({ type: "error", text: `Failed to update ${type}.` });
            }
        } catch {
            setMessage({ type: "error", text: "A network error occurred." });
        } finally {
            setSaving(null);
        }
    };

    const handleChange = (type: ContentType, field: keyof ContentItem, value: string) => {
        setContent((prev) => ({
            ...prev,
            [type]: { ...prev[type], [field]: value },
        }));
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex-grow flex items-center justify-center p-8">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
        return (
            <div className="flex-grow flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70">You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "cms", label: "Daily Content", icon: Settings },
        { id: "posts", label: "Manage Posts", icon: Newspaper },
        { id: "finance", label: "Finance", icon: Wallet },
    ];

    return (
        <div className="flex-grow bg-neutral-light/30 dark:bg-black/10 py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-light flex items-center gap-3">
                            <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10" />
                            Admin Dashboard
                        </h1>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 mt-1 text-sm">
                            Welcome back, {session?.user?.name}
                        </p>
                    </div>
                    <Link
                        href="/admin/posts/new"
                        className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm w-fit"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Post
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white dark:bg-neutral-dark rounded-xl p-1 border border-primary/10 overflow-x-auto">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <Link
                            key={id}
                            href={`/admin?tab=${id}`}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                                activeTab === id
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-neutral-dark/70 dark:text-neutral-light/70 hover:bg-primary/5 hover:text-primary dark:hover:text-primary-light"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Global Message */}
                {message && (
                    <div
                        className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                            message.type === "success"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}
                    >
                        {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        {message.text}
                    </div>
                )}

                {/* TAB: OVERVIEW */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} icon={<Users className="w-5 h-5" />} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
                            <StatCard title="Published Posts" value={stats?.publishedPosts ?? "—"} icon={<Eye className="w-5 h-5" />} color="text-green-600 bg-green-50 dark:bg-green-900/20" />
                            <StatCard title="Draft Posts" value={stats?.draftPosts ?? "—"} icon={<FilePen className="w-5 h-5" />} color="text-amber-600 bg-amber-50 dark:bg-amber-900/20" />
                            <StatCard title="Daily Content" value={stats?.contentItems ?? "—"} icon={<TrendingUp className="w-5 h-5" />} color="text-primary bg-primary/5" />
                            <StatCard title="Donations (USD)" value={finance ? `$${finance.totals.totalDonationsUsd.toFixed(2)}` : "—"} icon={<Wallet className="w-5 h-5" />} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                                    <h2 className="font-bold text-primary dark:text-primary-light text-lg">Quick Actions</h2>
                                </div>
                                <div className="p-4 space-y-1">
                                    {[
                                        { href: "/admin/posts/new", icon: PlusCircle, label: "Create New Post", desc: "Write a text or image post", color: "text-primary bg-primary/10" },
                                        { href: "/admin?tab=cms", icon: Settings, label: "Update Daily Content", desc: "Ayah, Hadith, Dua & Reminder", color: "text-secondary-dark bg-secondary/10" },
                                        { href: "/admin?tab=posts", icon: Newspaper, label: "Manage All Posts", desc: "Edit, publish or delete posts", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                                        { href: "/posts", icon: Eye, label: "View Public Posts", desc: "See what users see", color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
                                    ].map(({ href, icon: Icon, label, desc, color }) => (
                                        <Link key={href} href={href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-colors group">
                                            <div className={`p-2.5 rounded-lg ${color}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm">{label}</p>
                                                <p className="text-xs opacity-60">{desc}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-70 shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex items-center justify-between">
                                    <h2 className="font-bold text-primary dark:text-primary-light text-lg">Recent Posts</h2>
                                    <Link href="/admin?tab=posts" className="text-xs text-primary hover:underline font-medium">View all</Link>
                                </div>
                                <div className="p-4">
                                    {!stats?.recentPosts?.length ? (
                                        <div className="text-center py-8">
                                            <FileText className="w-10 h-10 mx-auto opacity-20 mb-2" />
                                            <p className="text-sm opacity-60">No posts yet</p>
                                            <Link href="/admin/posts/new" className="text-xs text-primary hover:underline mt-1 inline-block">Create your first post</Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {stats.recentPosts.map((post) => (
                                                <div key={post._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                                                    <div className={`p-1.5 rounded-md ${post.type === "video" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : post.type === "image" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                                                        {post.type === "video" ? <Video className="w-3.5 h-3.5" /> : post.type === "image" ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{post.title}</p>
                                                        <p className="text-xs opacity-50">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                                    </div>
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                                        {post.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Status */}
                        <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                                <h2 className="font-bold text-primary dark:text-primary-light text-lg">Daily Content Status</h2>
                            </div>
                            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Daily Ayah", icon: BookOpen, color: "text-primary", filled: !!content.ayah?.english },
                                    { label: "Daily Hadith", icon: Library, color: "text-secondary-dark dark:text-secondary-light", filled: !!content.hadith?.english },
                                    { label: "Dua of Day", icon: Heart, color: "text-red-500", filled: !!content.dua?.english },
                                    { label: "Reminder", icon: Star, color: "text-amber-500", filled: !!content.reminder?.english },
                                ].map(({ label, icon: Icon, color, filled }) => (
                                    <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-light/30 dark:bg-black/10 text-center">
                                        <Icon className={`w-6 h-6 ${color}`} />
                                        <p className="text-sm font-semibold">{label}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${filled ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                                            {filled ? "Set" : "Empty"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: CMS */}
                {activeTab === "cms" && (
                    <div className="space-y-8">
                        <AdminSection title="Daily Qur'an Ayah" icon={<BookOpen className="text-primary" />} type="ayah" data={content.ayah} onSave={() => handleSave("ayah")} onChange={handleChange} saving={saving === "ayah"} fields={[{ label: "Arabic Text", name: "arabic", type: "textarea", dir: "rtl" }, { label: "English Translation", name: "english", type: "textarea" }, { label: "Urdu/Secondary Translation", name: "translation", type: "textarea", dir: "rtl" }, { label: "Reference (e.g. Surah Ash-Sharh, Ayah 5)", name: "reference", type: "input" }]} />
                        <AdminSection title="Daily Hadith" icon={<Library className="text-secondary-dark dark:text-secondary-light" />} type="hadith" data={content.hadith} onSave={() => handleSave("hadith")} onChange={handleChange} saving={saving === "hadith"} fields={[{ label: "Arabic Text", name: "arabic", type: "textarea", dir: "rtl" }, { label: "English Translation", name: "english", type: "textarea" }, { label: "Reference (e.g. Sahih al-Bukhari 1)", name: "reference", type: "input" }, { label: "Subtitle/Book", name: "subtitle", type: "input" }]} />
                        <AdminSection title="Dua of the Day" icon={<Heart className="text-red-500" />} type="dua" data={content.dua} onSave={() => handleSave("dua")} onChange={handleChange} saving={saving === "dua"} fields={[{ label: "Arabic Text", name: "arabic", type: "textarea", dir: "rtl" }, { label: "English Translation", name: "english", type: "textarea" }, { label: "Transliteration", name: "translation", type: "textarea" }, { label: "Reference", name: "reference", type: "input" }]} />
                        <AdminSection title="Islamic Reminder" icon={<Star className="text-amber-500" />} type="reminder" data={content.reminder} onSave={() => handleSave("reminder")} onChange={handleChange} saving={saving === "reminder"} fields={[{ label: "Reminder Quote/Text", name: "english", type: "textarea" }]} />
                    </div>
                )}

                {/* TAB: POSTS */}
                {activeTab === "posts" && <PostsManager />}

                {/* TAB: FINANCE */}
                {activeTab === "finance" && <FinanceManager finance={finance} loading={financeLoading} />}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs opacity-60 font-medium mt-0.5">{title}</p>
            </div>
        </div>
    );
}

function PostsManager() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts");
            if (res.ok) setPosts(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (post: any) => {
        const newStatus = post.status === "published" ? "draft" : "published";
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setMessage({ type: "success", text: `Post ${newStatus === "published" ? "published" : "unpublished"}.` });
                setTimeout(() => setMessage(null), 3000);
                fetchPosts();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMessage({ type: "success", text: "Post deleted successfully." });
                setTimeout(() => setMessage(null), 3000);
                fetchPosts();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {message && (
                <div className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    {message.text}
                </div>
            )}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary dark:text-primary-light">All Posts</h2>
                <Link href="/admin/posts/new" className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                    <PlusCircle className="w-4 h-4" />
                    New Post
                </Link>
            </div>
            {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>
            ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm p-12 text-center">
                    <Newspaper className="w-14 h-14 mx-auto opacity-20 mb-3" />
                    <h3 className="text-lg font-semibold mb-1">No posts yet</h3>
                    <p className="text-sm opacity-60 mb-4">Create your first post to share with users.</p>
                    <Link href="/admin/posts/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary-light transition-colors">
                        <PlusCircle className="w-4 h-4" />Create Post
                    </Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-primary/10 bg-primary/5">
                                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Title</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60 hidden sm:table-cell">Type</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60 hidden md:table-cell">Category</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60 hidden lg:table-cell">Date</th>
                                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {posts.map((post) => (
                                    <tr key={post._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-4 py-3"><p className="font-semibold text-sm line-clamp-1">{post.title}</p></td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${post.type === "video" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : post.type === "image" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                                                {post.type === "video" ? <Video className="w-3 h-3" /> : post.type === "image" ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs capitalize opacity-70">{post.category}</span></td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggleStatus(post)} title="Click to toggle" className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${post.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                                {post.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs opacity-60">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/posts/${post._id}/edit`} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Edit</Link>
                                                <button onClick={() => handleDelete(post._id)} disabled={deletingId === post._id} className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                                                    {deletingId === post._id ? "..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function FinanceManager({ finance, loading }: { finance: FinanceData | null; loading: boolean }) {
    const healthColor = (health: "healthy" | "monitor" | "critical") => {
        if (health === "healthy") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        if (health === "monitor") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    };

    if (loading) {
        return <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>;
    }

    if (!finance) {
        return (
            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm p-10 text-center">
                <AlertCircle className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-sm opacity-60">Finance data is not available right now.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Donations (USD)" value={`$${finance.totals.totalDonationsUsd.toFixed(2)}`} icon={<Wallet className="w-5 h-5" />} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" />
                <StatCard title="Records" value={finance.totals.totalRecords} icon={<FileText className="w-5 h-5" />} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
                <StatCard title="Succeeded" value={finance.totals.succeeded} icon={<ShieldCheck className="w-5 h-5" />} color="text-green-600 bg-green-50 dark:bg-green-900/20" />
                <StatCard title="Failed" value={finance.totals.failed} icon={<AlertTriangle className="w-5 h-5" />} color="text-red-600 bg-red-50 dark:bg-red-900/20" />
            </div>

            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                    <h2 className="font-bold text-primary dark:text-primary-light text-lg">Payment Method Health</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {finance.methods.map((method) => (
                        <div key={method.method} className="rounded-xl border border-primary/10 p-4 bg-neutral-light/20 dark:bg-black/10">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold capitalize">{method.method}</h3>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${healthColor(method.health)}`}>
                                    {method.health}
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{(method.successRate * 100).toFixed(1)}%</p>
                            <p className="text-xs opacity-60">Success Rate</p>
                            <div className="mt-3 text-xs opacity-70 space-y-1">
                                <p>Total: {method.total}</p>
                                <p>Succeeded: {method.succeeded}</p>
                                <p>Pending: {method.pending}</p>
                                <p>Failed: {method.failed}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex items-center justify-between">
                    <h2 className="font-bold text-primary dark:text-primary-light text-lg">Recent Donations</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${healthColor(finance.totals.overallHealth)}`}>
                        Overall: {(finance.totals.overallSuccessRate * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-primary/10 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Donor</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Method</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60 hidden md:table-cell">Details</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide opacity-60 hidden lg:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {finance.recentDonations.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-8 text-center text-sm opacity-60" colSpan={6}>No donations recorded yet.</td>
                                </tr>
                            ) : finance.recentDonations.map((donation) => (
                                <tr key={donation._id} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-4 py-3 text-sm font-semibold">{donation.donorName || "Anonymous"}</td>
                                    <td className="px-4 py-3 text-sm">{donation.currencySymbol}{donation.amount.toLocaleString()} {donation.currency}</td>
                                    <td className="px-4 py-3 text-xs capitalize">{donation.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${donation.paymentStatus === "succeeded"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : donation.paymentStatus === "pending"
                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {donation.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs opacity-70 hidden md:table-cell">{donation.cause} / {donation.donationType} / {donation.transactionId}</td>
                                    <td className="px-4 py-3 text-xs opacity-60 hidden lg:table-cell">{new Date(donation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

interface AdminSectionProps {
    title: string;
    icon: React.ReactNode;
    type: ContentType;
    data: ContentItem;
    onSave: () => void;
    onChange: (type: ContentType, field: keyof ContentItem, value: string) => void;
    saving: boolean;
    fields: { label: string; name: keyof ContentItem; type: "input" | "textarea"; dir?: "rtl" | "ltr" }[];
}

function AdminSection({ title, icon, type, data, onSave, onChange, saving, fields }: AdminSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
            <div className="bg-primary/5 p-5 border-b border-primary/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-white dark:bg-neutral-dark rounded-lg shadow-sm shrink-0">{icon}</div>
                    <h2 className="text-lg font-bold text-primary dark:text-primary-light truncate">{title}</h2>
                </div>
                <button onClick={onSave} disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 shrink-0">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
                </button>
            </div>
            <div className="p-5 space-y-5">
                {fields.map((field) => (
                    <div key={field.name as string} className="space-y-1.5">
                        <label className="text-sm font-semibold opacity-70">{field.label}</label>
                        {field.type === "textarea" ? (
                            <textarea value={data[field.name] || ""} onChange={(e) => onChange(type, field.name, e.target.value)} className={`w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[100px] resize-y ${field.dir === "rtl" ? "text-right font-arabic text-xl leading-loose" : "text-left"}`} dir={field.dir} />
                        ) : (
                            <input type="text" value={data[field.name] || ""} onChange={(e) => onChange(type, field.name, e.target.value)} className="w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="flex-grow flex items-center justify-center p-8"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>}>
            <AdminPageInner />
        </Suspense>
    );
}
