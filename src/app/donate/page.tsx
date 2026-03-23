"use client";

import { useState, useEffect } from "react";
import { Heart, CreditCard, RefreshCw, Lock, Globe, ChevronDown, X, Check, Landmark, Wallet } from "lucide-react";

interface CurrencyInfo {
    country: string;
    code: string;
    symbol: string;
    name: string;
    rate: number;
    flag: string;
    presets: number[];
}

type PaymentProvider = "jazzcash";

const ALL_COUNTRIES: { code: string; name: string; flag: string; currency: string }[] = [
    { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
    { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR" },
    { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
    { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
    { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD" },
    { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR" },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
    { code: "AE", name: "UAE", flag: "🇦🇪", currency: "AED" },
    { code: "QA", name: "Qatar", flag: "🇶🇦", currency: "QAR" },
    { code: "KW", name: "Kuwait", flag: "🇰🇼", currency: "KWD" },
    { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT" },
    { code: "IN", name: "India", flag: "🇮🇳", currency: "INR" },
    { code: "MY", name: "Malaysia", flag: "🇲🇾", currency: "MYR" },
    { code: "ID", name: "Indonesia", flag: "🇮🇩", currency: "IDR" },
    { code: "TR", name: "Turkey", flag: "🇹🇷", currency: "TRY" },
    { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN" },
    { code: "MA", name: "Morocco", flag: "🇲🇦", currency: "MAD" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR" },
    { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN" },
];

const DEFAULT_CURRENCY: CurrencyInfo = {
    country: "US", code: "USD", symbol: "$", name: "US Dollar",
    rate: 1, flag: "🇺🇸", presets: [10, 25, 50, 100, 500],
};

function formatAmount(amount: number, symbol: string): string {
    if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`;
    return `${symbol}${amount.toLocaleString()}`;
}

export default function DonatePage() {
    const [currency, setCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
    const [currencyLoading, setCurrencyLoading] = useState(true);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");

    const [amount, setAmount] = useState<number | "custom">(50);
    const [customAmount, setCustomAmount] = useState("");
    const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
    const [cause, setCause] = useState<"general" | "zakat" | "sadaqah">("general");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "wallet">("card");
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "succeeded" | "failed">("pending");

    useEffect(() => {
        fetch("/api/currency")
            .then(r => r.json())
            .then((data: CurrencyInfo) => {
                if (data?.code) {
                    setCurrency(data);
                    setAmount(data.presets[2] ?? 50);
                }
            })
            .catch(() => {})
            .finally(() => setCurrencyLoading(false));
    }, []);

    const handleCountrySelect = async (countryCode: string) => {
        setShowCountryPicker(false);
        setCountrySearch("");
        setCurrencyLoading(true);
        try {
            const r = await fetch(`/api/currency?country=${countryCode}`);
            const data: CurrencyInfo = await r.json();
            if (data?.code) {
                setCurrency(data);
                setAmount(data.presets[2]);
                setCustomAmount("");
            }
        } catch { /* fallback silently */ }
        finally { setCurrencyLoading(false); }
    };

    const displayAmount = amount === "custom"
        ? (customAmount ? `${currency.symbol}${customAmount}` : "")
        : formatAmount(amount as number, currency.symbol);

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const numericAmount = amount === "custom" ? Number(customAmount) : Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setLoading(false);
            setError("Please enter a valid donation amount.");
            return;
        }

        try {
            const intentRes = await fetch("/api/payments/create-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: numericAmount,
                    currency: currency.code,
                    country: currency.country,
                    cause,
                    donationType,
                    paymentMethod,
                    donorName: donorName.trim() || "Anonymous",
                    donorEmail: donorEmail.trim(),
                }),
            });

            const intentData = await intentRes.json().catch(() => ({}));
            if (!intentRes.ok || !intentData?.intent) {
                throw new Error(intentData?.message || "Failed to initialize payment");
            }

            const intent = intentData.intent as {
                provider: PaymentProvider;
                transactionId: string;
                paymentStatus: "pending" | "succeeded" | "failed";
                checkoutUrl?: string;
                gatewayReference?: string;
            };

            const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    donorName: donorName.trim() || "Anonymous",
                    donorEmail: donorEmail.trim(),
                    amount: numericAmount,
                    currency: currency.code,
                    currencySymbol: currency.symbol,
                    rate: currency.rate,
                    cause,
                    donationType,
                    paymentMethod,
                    provider: intent.provider,
                    transactionId: intent.transactionId,
                    gatewayReference: intent.gatewayReference || "",
                    paymentStatus: intent.paymentStatus,
                    country: currency.country,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || "Failed to process donation");
            }

            setSelectedProvider(intent.provider);
            setPaymentStatus(intent.paymentStatus);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.message || "Donation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCountries = ALL_COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.currency.toLowerCase().includes(countrySearch.toLowerCase())
    );

    if (success) {
        return (
            <div className="flex-grow flex items-center justify-center p-8 bg-neutral-light/50 dark:bg-black/10">
                <div className="bg-white dark:bg-neutral-dark rounded-3xl border border-primary/10 shadow-xl p-12 max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-2">JazakAllah Khayran!</h2>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                            {paymentStatus === "pending"
                                ? <>Your donation of <strong>{displayAmount}</strong> has been initiated and is pending confirmation.</>
                                : <>Your donation of <strong>{displayAmount}</strong> has been received.</>}
                            {" "}May Allah accept it as Sadaqah Jariyah.
                        </p>
                        {selectedProvider && (
                            <p className="text-xs opacity-60">
                                Routed via JazzCash
                            </p>
                        )}
                    </div>
                    <p className="font-arabic text-xl text-secondary" dir="rtl">اللَّهُمَّ تَقَبَّلْ مِنَّا</p>
                    <button onClick={() => { setSuccess(false); setAmount(currency.presets[2]); setCustomAmount(""); setError(""); setSelectedProvider(null); }} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">
                        Donate Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col items-center py-12 px-4 md:px-8 bg-neutral-light/50 dark:bg-black/10 relative">

            {/* Country Picker Modal */}
            {showCountryPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCountryPicker(false)}>
                    <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-2xl border border-primary/10 w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-primary/10">
                            <h3 className="font-bold text-primary dark:text-primary-light">Select Your Country</h3>
                            <button onClick={() => setShowCountryPicker(false)} className="p-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-3 border-b border-primary/10">
                            <input
                                type="text"
                                value={countrySearch}
                                onChange={e => setCountrySearch(e.target.value)}
                                placeholder="Search country or currency..."
                                autoFocus
                                className="w-full px-3 py-2 text-sm bg-neutral-light/50 dark:bg-black/20 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="overflow-y-auto max-h-72">
                            {filteredCountries.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => handleCountrySelect(c.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left ${currency.country === c.code ? "bg-primary/5" : ""}`}
                                >
                                    <span className="text-xl">{c.flag}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{c.name}</p>
                                        <p className="text-xs text-neutral-dark/50 dark:text-neutral-light/50">{c.currency}</p>
                                    </div>
                                    {currency.country === c.code && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-10 space-y-3">
                    <div className="flex justify-center">
                        <Heart className="w-12 h-12 text-red-500 fill-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light">Support Our Mission</h1>
                    <p className="text-lg text-neutral-dark/80 dark:text-neutral-light/80 max-w-2xl mx-auto">
                        "The believer's shade on the Day of Resurrection will be his charity." (Tirmidhi)
                    </p>
                </div>

                {/* Currency Detection Bar */}
                <div className="mb-6 flex items-center justify-between bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-primary/50 shrink-0" />
                        {currencyLoading ? (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-3 h-3 animate-spin text-primary/50" />
                                <span className="text-xs text-neutral-dark/50 dark:text-neutral-light/50">Detecting your location...</span>
                            </div>
                        ) : (
                            <p className="text-sm font-medium">
                                <span className="text-lg mr-1">{currency.flag}</span>
                                Showing prices in <strong>{currency.code}</strong> ({currency.name})
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowCountryPicker(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-primary-light bg-primary/8 dark:bg-primary/15 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-3"
                    >
                        Change <ChevronDown className="w-3 h-3" />
                    </button>
                </div>

                <div className="bg-white dark:bg-neutral-dark rounded-3xl shadow-xl border border-primary/10 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* Left side: Information */}
                        <div className="p-8 md:p-12 bg-primary/5 dark:bg-primary/10 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Where your donation goes</h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">🌍</div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-neutral-dark dark:text-neutral-light">Global reach</h3>
                                        <p className="opacity-70 text-sm mt-1">Providing free Islamic education to millions worldwide without ads.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-secondary">🤲</div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-neutral-dark dark:text-neutral-light">Sadaqah Jariyah</h3>
                                        <p className="opacity-70 text-sm mt-1">Continuous charity that benefits you even after this life.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 text-green-600">💯</div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-neutral-dark dark:text-neutral-light">100% Transparency</h3>
                                        <p className="opacity-70 text-sm mt-1">Your Zakat and Sadaqah are distributed to verified eligible recipients.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Right side: Form */}
                        <div className="p-8 md:p-12">
                            <form onSubmit={handleDonate} className="space-y-7">

                                {/* Donor Details */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm">Donor Details (optional)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={donorName}
                                            onChange={(e) => setDonorName(e.target.value)}
                                            placeholder="Full name"
                                            className="w-full px-3 py-2.5 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                                        />
                                        <input
                                            type="email"
                                            value={donorEmail}
                                            onChange={(e) => setDonorEmail(e.target.value)}
                                            placeholder="Email address"
                                            className="w-full px-3 py-2.5 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Cause Selection */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm">Donation Type</h3>
                                    <div className="flex bg-neutral-light/50 dark:bg-black/20 p-1 rounded-xl">
                                        {(["general", "zakat", "sadaqah"] as const).map(c => (
                                            <button key={c} type="button" onClick={() => setCause(c)}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${cause === c ? "bg-white dark:bg-neutral-dark shadow text-primary" : "text-neutral-dark/70 dark:text-neutral-light/70"}`}>
                                                {c === "general" ? "General" : c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Frequency */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm">Frequency</h3>
                                    <div className="flex gap-3">
                                        {(["one-time", "monthly"] as const).map(f => (
                                            <label key={f} className={`flex-1 border-2 rounded-xl p-3 cursor-pointer transition-all ${donationType === f ? "border-primary bg-primary/5" : "border-transparent bg-neutral-light/50 dark:bg-black/20"}`}>
                                                <input type="radio" className="hidden" name="frequency" onClick={() => setDonationType(f)} />
                                                <div className="text-center font-bold text-sm">{f === "one-time" ? "One Time" : "Monthly"}</div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm">Payment Method</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {([
                                            { value: "card", label: "Card", icon: CreditCard },
                                            { value: "bank", label: "Bank", icon: Landmark },
                                            { value: "wallet", label: "Wallet", icon: Wallet },
                                        ] as const).map((method) => (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.value)}
                                                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm border-2 transition-all ${paymentMethod === method.value
                                                    ? "border-primary text-primary bg-primary/5"
                                                    : "border-transparent bg-neutral-light/50 dark:bg-black/20 hover:bg-neutral-light dark:hover:bg-black/40"
                                                    }`}
                                            >
                                                <method.icon className="w-4 h-4" />
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs opacity-60">
                                        Bank payments are recorded as pending until settlement.
                                    </p>
                                </div>

                                {/* Amount */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm">
                                        Amount
                                        {!currencyLoading && <span className="ml-2 text-[11px] text-primary/60 font-normal">({currency.code})</span>}
                                    </h3>
                                    {currencyLoading ? (
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-10 bg-neutral-light/70 dark:bg-white/5 rounded-xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {currency.presets.map((a) => (
                                                <button key={a} type="button" onClick={() => setAmount(a)}
                                                    className={`py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${amount === a ? "border-primary text-primary bg-primary/5" : "border-transparent bg-neutral-light/50 dark:bg-black/20 hover:bg-neutral-light dark:hover:bg-black/40"}`}>
                                                    {formatAmount(a, currency.symbol)}
                                                </button>
                                            ))}
                                            <button type="button" onClick={() => setAmount("custom")}
                                                className={`py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${amount === "custom" ? "border-primary text-primary bg-primary/5" : "border-transparent bg-neutral-light/50 dark:bg-black/20 hover:bg-neutral-light dark:hover:bg-black/40"}`}>
                                                Custom
                                            </button>
                                        </div>
                                    )}
                                    {amount === "custom" && (
                                        <div className="relative mt-2">
                                            <span className="absolute left-4 top-3.5 text-sm font-bold opacity-50">{currency.symbol}</span>
                                            <input type="number" min="1" value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                                                className="w-full pl-9 pr-4 py-3 bg-white dark:bg-neutral-dark border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary text-lg font-bold"
                                                placeholder="0.00" required />
                                        </div>
                                    )}
                                </div>

                                {/* Submit Action */}
                                <div className="pt-4 border-t border-primary/10">
                                    {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={loading || (amount === "custom" && !customAmount) || currencyLoading}
                                        className="w-full flex justify-center items-center py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-light transition-all disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Donate {displayAmount}{donationType === "monthly" ? " Monthly" : ""}
                                            </>
                                        )}
                                    </button>
                                    <p className="col-span-2 text-center text-xs opacity-60 mt-4 flex items-center justify-center gap-1">
                                        <Lock className="w-3 h-3" /> Secure payment routed via JazzCash
                                    </p>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
