"use client";

import { useState, useEffect } from "react";
import { FileText, Video, RefreshCw, Search } from "lucide-react";
import Image from "next/image";

interface Post {
    _id: string;
    title: string;
    type: "post" | "video";
    content: string;
    videoUrl?: string;
    thumbnail?: string;
    category: string;
    author: string;
    createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    general: "General",
    reminder: "Reminder",
    quran: "Qur'an",
    hadith: "Hadith",
    dua: "Dua",
    announcement: "Announcement",
};

function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com")) {
            const videoId = parsed.searchParams.get("v");
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        if (parsed.hostname === "youtu.be") {
            const videoId = parsed.pathname.slice(1);
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        return null;
    } catch {
        return null;
    }
}

function PostCard({ post }: { post: Post }) {
    const [expanded, setExpanded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const isLong = post.content.length > 300;
    const embedUrl = post.type === "video" && post.videoUrl ? getYouTubeEmbedUrl(post.videoUrl) : null;

    return (
        <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail for text posts */}
            {post.type === "post" && post.thumbnail && !imageError && (
                <div className="relative aspect-video w-full overflow-hidden bg-primary/5">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>
            )}

            {/* Video embed */}
            {post.type === "video" && (
                <div className="aspect-video w-full bg-black">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={post.title}
                            className="w-full h-full"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : post.videoUrl ? (
                        <video
                            src={post.videoUrl}
                            controls
                            preload="metadata"
                            className="w-full h-full"
                            poster={post.thumbnail || undefined}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 opacity-30 text-white" />
                        </div>
                    )}
                </div>
            )}

            <div className="p-5 md:p-6 space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${post.type === "video"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                        {post.type === "video" ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {post.type === "video" ? "Video" : "Post"}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-light capitalize">
                        {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                    <span className="text-xs opacity-50 ml-auto">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-primary dark:text-primary-light leading-snug">
                    {post.title}
                </h2>

                {/* Content */}
                <div className="text-neutral-dark/80 dark:text-neutral-light/80 text-sm leading-relaxed">
                    {isLong && !expanded ? (
                        <>
                            <p className="whitespace-pre-wrap">{post.content.slice(0, 300)}…</p>
                            <button
                                onClick={() => setExpanded(true)}
                                className="mt-2 text-primary dark:text-primary-light font-semibold text-xs hover:underline"
                            >
                                Read more
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="whitespace-pre-wrap">{post.content}</p>
                            {isLong && (
                                <button
                                    onClick={() => setExpanded(false)}
                                    className="mt-2 text-primary dark:text-primary-light font-semibold text-xs hover:underline"
                                >
                                    Show less
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Author */}
                <div className="pt-2 border-t border-primary/5 text-xs opacity-50 flex items-center gap-1">
                    Posted by {post.author}
                </div>
            </div>
        </div>
    );
}

export default function PostsClient() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"all" | "post" | "video">("all");
    const [filterCategory, setFilterCategory] = useState("all");

    useEffect(() => {
        fetch("/api/posts")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setPosts(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = posts.filter((p) => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === "all" || p.type === filterType;
        const matchCat = filterCategory === "all" || p.category === filterCategory;
        return matchSearch && matchType && matchCat;
    });

    const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category)))];

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            {posts.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-4 h-4 opacity-40" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-dark border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                        />
                    </div>

                    {/* Type filter */}
                    <div className="flex gap-1 bg-white dark:bg-neutral-dark rounded-xl p-1 border border-primary/10">
                        {(["all", "post", "video"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filterType === t
                                    ? "bg-primary text-white"
                                    : "hover:bg-primary/5 text-neutral-dark/70 dark:text-neutral-light/70"
                                    }`}
                            >
                                {t === "all" ? "All" : t === "post" ? "Posts" : "Videos"}
                            </button>
                        ))}
                    </div>

                    {/* Category filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2.5 bg-white dark:bg-neutral-dark border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c === "all" ? "All Categories" : CATEGORY_LABELS[c] || c}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Posts Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <FileText className="w-16 h-16 mx-auto opacity-20" />
                    <h3 className="text-xl font-semibold opacity-60">
                        {posts.length === 0 ? "No posts yet" : "No posts match your search"}
                    </h3>
                    <p className="text-sm opacity-50">
                        {posts.length === 0
                            ? "Check back soon for new content!"
                            : "Try adjusting your filters or search term."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
