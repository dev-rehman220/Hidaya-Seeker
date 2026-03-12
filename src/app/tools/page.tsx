"use client";

import { useState, useEffect } from "react";
import { Calculator, Compass, Clock, RefreshCw } from "lucide-react";
import { getPrayerTimesByLocation, calculateQiblaDirection, PrayerTimesData } from "@/lib/prayerTimes";

export default function ToolsPage() {
    // Zakat Calculator State
    const [zakatData, setZakatData] = useState({
        gold: 0,
        silver: 0,
        cash: 0,
        savings: 0,
        business: 0,
        debts: 0,
    });

    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    try {
                        const data = await getPrayerTimesByLocation(coords);
                        if (data) {
                            setPrayerTimes(data.timings);
                        }
                        const qibla = calculateQiblaDirection(coords);
                        setQiblaDirection(Math.round(qibla));
                    } catch (error) {
                        setLocationError("Failed to fetch location data.");
                    }
                },
                (error) => {
                    console.warn("Geolocation denied or unavailable.", error);
                    setLocationError("Enable location to see local prayer times.");
                }
            );
        } else {
            setLocationError("Geolocation not supported by this browser.");
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setZakatData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleResetZakat = () => {
        setZakatData({ gold: 0, silver: 0, cash: 0, savings: 0, business: 0, debts: 0 });
    };

    const totalWealth =
        zakatData.gold +
        zakatData.silver +
        zakatData.cash +
        zakatData.savings +
        zakatData.business -
        zakatData.debts;

    // Assuming Nisab is met for simplicity in this demo, usually it's ~85g of gold equivalent
    const zakatAmount = totalWealth > 0 ? totalWealth * 0.025 : 0;

    return (
        <div className="flex-grow bg-neutral-light/30 dark:bg-black/10 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light">
                        Islamic Tools
                    </h1>
                    <p className="text-lg text-neutral-dark/80 dark:text-neutral-light/80 max-w-2xl mx-auto">
                        Practical utilities to help fulfill your daily Islamic duties.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Tool: Zakat Calculator (Takes up 2 columns on lg) */}
                    <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-3">
                            <Calculator className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold text-primary dark:text-primary-light">Zakat Calculator</h2>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Form Variables */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b border-neutral-light dark:border-white/10 pb-2 mb-4">
                                    Enter Assets (in your currency)
                                </h3>

                                {[
                                    { label: "Gold Value", name: "gold", type: "asset" },
                                    { label: "Silver Value", name: "silver", type: "asset" },
                                    { label: "Cash at Hand", name: "cash", type: "asset" },
                                    { label: "Bank Savings", name: "savings", type: "asset" },
                                    { label: "Business Assets", name: "business", type: "asset" },
                                    { label: "Total Debts/Loans", name: "debts", type: "liability" },
                                ].map((input) => (
                                    <div key={input.name} className="flex flex-col">
                                        <label className="text-sm font-medium opacity-80 mb-1 flex justify-between">
                                            {input.label}
                                            {input.type === 'liability' && <span className="text-red-500 text-xs">(Minus)</span>}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 opacity-50">$</span>
                                            <input
                                                type="number"
                                                name={input.name}
                                                min="0"
                                                value={zakatData[input.name as keyof typeof zakatData] || ''}
                                                onChange={handleInputChange}
                                                className="w-full pl-8 pr-4 py-2 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Results */}
                            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 flex flex-col justify-center space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Calculator className="w-32 h-32" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium opacity-80 mb-1">Total Eligible Wealth</p>
                                    <p className="text-3xl font-bold text-neutral-dark dark:text-neutral-light">
                                        ${totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-primary/20">
                                    <p className="text-sm font-medium text-primary dark:text-primary-light mb-1">
                                        Your Zakat Amount (2.5%)
                                    </p>
                                    <p className="text-5xl font-bold text-primary dark:text-secondary-light">
                                        ${zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors mt-4 relative z-10 shadow-md flex justify-center items-center" onClick={handleResetZakat}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reset Calculator
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Side Tools */}
                    <div className="space-y-8">
                        {/* Prayer Times Card */}
                        <div className="bg-white dark:bg-neutral-dark p-6 rounded-2xl shadow-sm border border-primary/10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold text-primary dark:text-primary-light">Prayer Times</h3>
                            </div>

                            {locationError ? (
                                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex-grow flex items-center justify-center">
                                    {locationError}
                                </p>
                            ) : !prayerTimes ? (
                                <div className="flex items-center justify-center py-6 flex-grow">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="space-y-3 flex-grow">
                                    {[
                                        { name: "Fajr", key: "Fajr" },
                                        { name: "Sunrise", key: "Sunrise" },
                                        { name: "Dhuhr", key: "Dhuhr" },
                                        { name: "Asr", key: "Asr" },
                                        { name: "Maghrib", key: "Maghrib" },
                                        { name: "Isha", key: "Isha" },
                                    ].map((prayer) => (
                                        <div key={prayer.name} className="flex justify-between items-center p-3 rounded-lg bg-neutral-light/50 dark:bg-black/20 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                                            <span className="font-medium z-10">{prayer.name}</span>
                                            <span className="font-bold text-primary dark:text-secondary-light z-10">
                                                {(prayerTimes as any)[prayer.key]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Qibla Finder Card */}
                        <div className="bg-white dark:bg-neutral-dark p-6 rounded-2xl shadow-sm border border-primary/10 flex flex-col items-center justify-center text-center py-10">
                            <div className="relative mb-6">
                                <Compass className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                                <div
                                    className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
                                    style={{ transform: qiblaDirection !== null ? `rotate(${qiblaDirection}deg)` : 'none' }}
                                >
                                    <div className="w-1 h-12 bg-secondary rounded-full transform -translate-y-4 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-primary dark:text-primary-light mb-2">Qibla Direction</h3>

                            {qiblaDirection !== null ? (
                                <div>
                                    <p className="text-3xl font-bold text-secondary dark:text-secondary-light mb-1">
                                        {qiblaDirection}°
                                    </p>
                                    <p className="text-sm opacity-70">From True North</p>
                                </div>
                            ) : locationError ? (
                                <p className="text-sm text-amber-600 dark:text-amber-400">Location required</p>
                            ) : (
                                <p className="text-sm opacity-70">Calculating...</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
