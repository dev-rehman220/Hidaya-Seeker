"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    User, Mail, Lock, Save, RefreshCw,
    CheckCircle2, AlertCircle, Shield, Calendar
} from "lucide-react";

type Msg = { type: 'success' | 'error'; text: string } | null;

export default function AccountPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [nameLoading, setNameLoading] = useState(false);
    const [nameMsg, setNameMsg] = useState<Msg>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNew, setConfirmNew] = useState("");
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState<Msg>(null);

    const [memberSince, setMemberSince] = useState<string>("");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
        if (session?.user?.name) setName(session.user.name);
    }, [status, session, router]);

    // Fetch extra profile data (createdAt)
    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/auth/account")
            .then(r => r.json())
            .then(d => {
                if (d.createdAt) {
                    setMemberSince(new Date(d.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                    }));
                }
            })
            .catch(() => {});
    }, [status]);

    const handleNameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setNameLoading(true);
        setNameMsg(null);
        try {
            const res = await fetch("/api/auth/account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (res.ok) {
                await update({ name });
                setNameMsg({ type: "success", text: "Name updated successfully!" });
            } else {
                setNameMsg({ type: "error", text: data.message || "Failed to update name." });
            }
        } catch {
            setNameMsg({ type: "error", text: "Network error. Please try again." });
        } finally {
            setNameLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassMsg(null);
        if (newPassword !== confirmNew) {
            setPassMsg({ type: "error", text: "New passwords do not match." });
            return;
        }
        if (newPassword.length < 8) {
            setPassMsg({ type: "error", text: "New password must be at least 8 characters." });
            return;
        }
        setPassLoading(true);
        try {
            const res = await fetch("/api/auth/account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setPassMsg({ type: "success", text: "Password changed successfully!" });
                setCurrentPassword(""); setNewPassword(""); setConfirmNew("");
            } else {
                setPassMsg({ type: "error", text: data.message || "Failed to update password." });
            }
        } catch {
            setPassMsg({ type: "error", text: "Network error. Please try again." });
        } finally {
            setPassLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex-grow flex items-center justify-center p-8">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const role = (session?.user as any)?.role || "user";

    return (
        <div className="flex-grow bg-neutral-light/30 dark:bg-black/10 py-12 px-4 md:px-8">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Page Header */}
                <div>
                    <h1 className="text-4xl font-bold text-primary dark:text-primary-light flex items-center gap-3">
                        <User className="w-9 h-9" />
                        My Account
                    </h1>
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70 mt-2">
                        Manage your profile and security settings.
                    </p>
                </div>

                {/* Account Overview Card */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-primary/10 p-6 flex flex-wrap gap-6 items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold text-primary dark:text-primary-light">
                            {session?.user?.name?.[0]?.toUpperCase() || "?"}
                        </span>
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                        <h2 className="text-xl font-bold truncate">{session?.user?.name}</h2>
                        <p className="text-sm opacity-70 truncate flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 shrink-0" /> {session?.user?.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${role === "admin" ? "bg-primary/10 text-primary dark:text-primary-light" : "bg-secondary/10 text-secondary-dark dark:text-secondary-light"}`}>
                                <Shield className="w-3 h-3" />
                                {role === "admin" ? "Administrator" : "Member"}
                            </span>
                            {memberSince && (
                                <span className="text-xs opacity-50 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Joined {memberSince}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Profile */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                    <div className="bg-primary/5 p-5 border-b border-primary/10 flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-neutral-dark rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-primary dark:text-primary-light">Edit Profile</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {nameMsg && (
                            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${nameMsg.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                                {nameMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                {nameMsg.text}
                            </div>
                        )}
                        <form onSubmit={handleNameUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 opacity-80">Display Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 opacity-40" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                        placeholder="Your name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 opacity-80">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 opacity-40" />
                                    <input
                                        type="email"
                                        value={session?.user?.email || ""}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-2 bg-neutral-light/30 dark:bg-black/10 border border-primary/10 rounded-xl opacity-60 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs opacity-50 mt-1">Email address cannot be changed.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={nameLoading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                            >
                                {nameLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {nameLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                    <div className="bg-primary/5 p-5 border-b border-primary/10 flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-neutral-dark rounded-lg shadow-sm">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-primary dark:text-primary-light">Change Password</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {passMsg && (
                            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${passMsg.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                                {passMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                {passMsg.text}
                            </div>
                        )}
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            {[
                                { label: "Current Password", value: currentPassword, setter: setCurrentPassword },
                                { label: "New Password", value: newPassword, setter: setNewPassword },
                                { label: "Confirm New Password", value: confirmNew, setter: setConfirmNew },
                            ].map(({ label, value, setter }) => (
                                <div key={label}>
                                    <label className="block text-sm font-medium mb-1.5 opacity-80">{label}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 opacity-40" />
                                        <input
                                            type="password"
                                            value={value}
                                            onChange={e => setter(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="submit"
                                disabled={passLoading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                            >
                                {passLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                {passLoading ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
