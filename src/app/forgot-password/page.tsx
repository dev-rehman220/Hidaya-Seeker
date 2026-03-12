"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "If an account exists with this email, you will receive a password reset link shortly.");
            } else {
                setStatus("error");
                setMessage(data.message || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setMessage("A network error occurred. Please try again.");
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 bg-neutral-light dark:bg-neutral-dark/50">
            <div className="w-full max-w-md bg-white dark:bg-neutral-dark rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
                <div className="p-8">
                    <Link href="/login" className="inline-flex items-center text-sm text-primary mb-6 hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-2">Reset Password</h1>
                        <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {status === "success" || status === "error" ? (
                        <div className={`p-4 rounded-lg text-sm text-center ${status === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 opacity-80" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 opacity-40" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-transparent border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full flex items-center justify-center py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-70 mt-4"
                            >
                                {status === "loading" ? "Sending..." : "Send Reset Link"}
                                {!status && <Send className="ml-2 w-4 h-4" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
