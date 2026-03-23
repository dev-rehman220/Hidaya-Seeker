"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export default function NewPostPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        type: "post" as "post" | "image",
        content: "",
        mediaUrl: "",
        thumbnail: "",
        category: "general" as typeof CATEGORIES[number],
        status: "draft" as "draft" | "published",
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    if (status === "loading") {
        return (
            <div className="flex-grow flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
        router.push("/");
        return null;
    }

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleMediaSelect = async (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please select an image file." });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || "");
            setForm((prev) => ({ ...prev, mediaUrl: dataUrl, thumbnail: dataUrl }));
        };
        reader.onerror = () => setMessage({ type: "error", text: "Failed to read image file." });
        reader.readAsDataURL(file);
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
        if (form.type === "image" && !form.mediaUrl.trim()) {
            setMessage({ type: "error", text: "Image is required for image posts." });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, status: publishStatus }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: `Post ${publishStatus === "published" ? "published" : "saved as draft"}!` });
                setTimeout(() => router.push("/admin?tab=posts"), 1500);
            } else {
                setMessage({ type: "error", text: data.message || "Failed to create post." });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setSaving(false);
        }
    };

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
                            Create New Post
                        </h1>
                        <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
                            Share text or image posts with your community
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
                            <label className="text-sm font-semibold opacity-70" htmlFor="post-title">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="post-title"
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
                                className="w-full p-3 bg-neutral-light/20 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 capitalize"
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
                                {form.mediaUrl && (
                                    <div className="rounded-xl border border-primary/15 overflow-hidden bg-neutral-light/40 dark:bg-black/20">
                                        <img src={form.mediaUrl} alt="Selected upload preview" className="w-full max-h-80 object-cover" />
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
                            Cancel
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
