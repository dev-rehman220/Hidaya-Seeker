"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Save,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    FileText,
    ImagePlus,
    Eye,
    FilePen,
} from "lucide-react";

const CATEGORIES = ["general", "reminder", "quran", "hadith", "dua", "announcement"] as const;

async function compressImageToDataUrl(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
    const imageBitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / imageBitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(imageBitmap.width * scale));
    canvas.height = Math.max(1, Math.round(imageBitmap.height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Canvas is not available");
    }

    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    imageBitmap.close();
    return canvas.toDataURL("image/jpeg", quality);
}

export default function EditPostPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [form, setForm] = useState({
        title: "",
        type: "post" as "post" | "image" | "video",
        content: "",
        videoUrl: "",
        mediaUrl: "",
        thumbnail: "",
        category: "general" as typeof CATEGORIES[number],
        status: "draft" as "draft" | "published",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            if ((session?.user as any)?.role !== "admin") {
                router.push("/");
                return;
            }
            fetchPost();
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, session]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${postId}`);
            if (res.ok) {
                const post = await res.json();
                setForm({
                    title: post.title || "",
                    type: post.type || "post",
                    content: post.content || "",
                    videoUrl: post.videoUrl || "",
                    mediaUrl: post.mediaUrl || post.thumbnail || "",
                    thumbnail: post.thumbnail || "",
                    category: post.category || "general",
                    status: post.status || "draft",
                });
            } else {
                setMessage({ type: "error", text: "Post not found." });
            }
        } catch {
            setMessage({ type: "error", text: "Failed to load post." });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleMediaSelect = async (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please select an image file." });
            return;
        }

        try {
            const dataUrl = await compressImageToDataUrl(file);
            setForm((prev) => ({ ...prev, mediaUrl: dataUrl, thumbnail: dataUrl, videoUrl: "" }));
        } catch {
            setMessage({ type: "error", text: "Failed to process image file." });
        }
    };

    const handleSubmit = async (publishStatus: "draft" | "published") => {
        if (!form.title.trim()) {
            setMessage({ type: "error", text: "Title is required." });
            return;
        }
        if (!form.content.trim()) {
            setMessage({ type: "error", text: "Content is required." });
            return;
        }
        if (form.type === "video" && !form.videoUrl.trim()) {
            setMessage({ type: "error", text: "Video URL is required for video posts." });
            return;
        }

        if (form.type === "image" && !form.mediaUrl.trim() && !form.thumbnail.trim()) {
            setMessage({ type: "error", text: "Image is required for image posts." });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, status: publishStatus }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: `Post ${publishStatus === "published" ? "published" : "saved as draft"}!` });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update post." });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-grow bg-neutral-light/30 dark:bg-black/10 py-8 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin?tab=posts"
                        className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light">
                            Edit Post
                        </h1>
                        <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
                            Update the post content and settings
                        </p>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === "success"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}>
                        {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">

                        {/* Post Type Toggle */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold opacity-70">Post Type</label>
                            <div className="flex gap-3">
                                {[
                                    { value: "post", icon: FileText, label: "Text Post" },
                                    { value: "image", icon: ImagePlus, label: "Image Post" },
                                ].map(({ value, icon: Icon, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                type: value as "post" | "image",
                                                videoUrl: value === "image" ? "" : prev.videoUrl,
                                                mediaUrl: value === "post" ? "" : prev.mediaUrl,
                                                thumbnail: value === "post" ? "" : prev.thumbnail,
                                            }))
                                        }
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.type === value
                                            ? "border-primary bg-primary text-white"
                                            : "border-primary/20 hover:border-primary/40 text-neutral-dark/70 dark:text-neutral-light/70"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold opacity-70">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Enter a clear, engaging title..."
                                className="w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-base font-medium"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold opacity-70">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                className="w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat} className="capitalize">
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        {form.type === "image" && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold opacity-70">
                                    Upload Image <span className="text-red-500">*</span>
                                    <span className="font-normal ml-2 text-xs opacity-60">(from your device)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleMediaSelect(e.target.files?.[0] || null)}
                                    className="w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                                {(form.mediaUrl || form.thumbnail) && (
                                    <div className="rounded-xl border border-primary/15 overflow-hidden bg-neutral-light/40 dark:bg-black/20">
                                        <img src={form.mediaUrl || form.thumbnail} alt="Selected upload preview" className="w-full max-h-80 object-cover" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold opacity-70">
                                {form.type === "image" ? "Caption" : "Content"} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={form.content}
                                onChange={(e) => handleChange("content", e.target.value)}
                                placeholder={form.type === "image" ? "Write a caption for this image..." : "Write your post content here..."}
                                rows={10}
                                className="w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y min-h-[200px] leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 border-t border-primary/10 bg-neutral-light/30 dark:bg-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <Link
                            href="/admin?tab=posts"
                            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
                        >
                            ← Back to Posts
                        </Link>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleSubmit("draft")}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 border-primary/30 hover:border-primary/60 text-primary dark:text-primary-light transition-all disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FilePen className="w-4 h-4" />}
                                Save as Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit("published")}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-primary hover:bg-primary-light text-white transition-all disabled:opacity-50 shadow-sm"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                Publish Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
