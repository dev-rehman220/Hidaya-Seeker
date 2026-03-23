"use client";

import { useState, useEffect } from "react";
import { Calculator, Compass, Clock, RefreshCw } from "lucide-react";
import {
    getPrayerTimesByCityCountry,
    getCityCountryFromCoordinates,
    calculateQiblaDirection,
    PrayerTimesData
} from "@/lib/prayerTimes";

const COUNTRY_CITY_OPTIONS: Record<string, string[]> = {
    "Pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar"],
    "Saudi Arabia": ["Makkah", "Madinah", "Riyadh", "Jeddah", "Dammam"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
    "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa"],
    "United Kingdom": ["London", "Birmingham", "Manchester", "Leeds"],
    "United States": ["New York", "Chicago", "Los Angeles", "Houston"],
    "Malaysia": ["Kuala Lumpur", "Shah Alam", "Johor Bahru", "Penang"],
    "Indonesia": ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"],
    "India": ["Mumbai", "Delhi", "Hyderabad", "Bengaluru"],
    "Bangladesh": ["Dhaka", "Chittagong", "Sylhet", "Khulna"],
    "Qatar": ["Doha", "Al Rayyan", "Al Wakrah"],
    "Kuwait": ["Kuwait City", "Hawalli", "Farwaniya"],
};

const COUNTRY_ALIASES: Record<string, string> = {
    "United States of America": "United States",
    "UAE": "United Arab Emirates",
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
    "Pakistan": "PKR",
    "Saudi Arabia": "SAR",
    "United Arab Emirates": "AED",
    "Turkey": "TRY",
    "United Kingdom": "GBP",
    "United States": "USD",
    "Malaysia": "MYR",
    "Indonesia": "IDR",
    "India": "INR",
    "Bangladesh": "BDT",
    "Qatar": "QAR",
    "Kuwait": "KWD",
};

const normalizeCountryName = (countryName: string) => COUNTRY_ALIASES[countryName] || countryName;

const ZAKAT_CURRENCY_OPTIONS = [
    { code: "PKR", label: "Pakistan - PKR" },
    { code: "SAR", label: "Saudi Arabia - SAR" },
    { code: "AED", label: "UAE - AED" },
    { code: "USD", label: "United States - USD" },
    { code: "GBP", label: "United Kingdom - GBP" },
    { code: "EUR", label: "Eurozone - EUR" },
    { code: "TRY", label: "Turkey - TRY" },
    { code: "MYR", label: "Malaysia - MYR" },
    { code: "IDR", label: "Indonesia - IDR" },
    { code: "INR", label: "India - INR" },
    { code: "BDT", label: "Bangladesh - BDT" },
    { code: "QAR", label: "Qatar - QAR" },
    { code: "KWD", label: "Kuwait - KWD" },
] as const;

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
    const [prayerError, setPrayerError] = useState("");
    const [qiblaError, setQiblaError] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("Pakistan");
    const [selectedCity, setSelectedCity] = useState("Karachi");
    const [detectedCity, setDetectedCity] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("PKR");

    const countryOptions = Object.keys(COUNTRY_CITY_OPTIONS);
    const defaultCities = COUNTRY_CITY_OPTIONS[selectedCountry] || [];
    const cityOptions = detectedCity && !defaultCities.includes(detectedCity)
        ? [detectedCity, ...defaultCities]
        : defaultCities;

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    const qibla = calculateQiblaDirection(coords);
                    setQiblaDirection(Math.round(qibla));
                    setQiblaError("");

                    // Auto-detect city/country from geolocation and use it as default selection.
                    const detected = await getCityCountryFromCoordinates(coords);
                    if (detected?.country && detected.city) {
                        const normalizedCountry = normalizeCountryName(detected.country);
                        if (COUNTRY_CITY_OPTIONS[normalizedCountry]) {
                            setSelectedCountry(normalizedCountry);
                            setDetectedCity(detected.city);
                            setSelectedCity(detected.city);
                        }
                    }
                },
                (error) => {
                    console.warn("Geolocation denied or unavailable.", error);
                    setQiblaError("Enable location to calculate Qibla direction.");
                }
            );
        } else {
            setQiblaError("Geolocation not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        const fetchByCityCountry = async () => {
            if (!selectedCity || !selectedCountry) return;

            try {
                const data = await getPrayerTimesByCityCountry({
                    city: selectedCity,
                    country: selectedCountry
                });
                if (data) {
                    setPrayerTimes(data.timings);
                    setPrayerError("");
                } else {
                    setPrayerError("Could not load prayer times for selected city.");
                }
            } catch (error) {
                console.error("Failed to fetch prayer times by city/country", error);
                setPrayerError("Could not load prayer times for selected city.");
            }
        };

        fetchByCityCountry();
    }, [selectedCountry, selectedCity]);

    useEffect(() => {
        const availableCities = COUNTRY_CITY_OPTIONS[selectedCountry] || [];
        if (availableCities.length > 0 && !availableCities.includes(selectedCity) && selectedCity !== detectedCity) {
            setSelectedCity(availableCities[0]);
        }
    }, [selectedCountry, selectedCity, detectedCity]);

    useEffect(() => {
        const nextCurrency = COUNTRY_TO_CURRENCY[selectedCountry] || "PKR";
        setSelectedCurrency(nextCurrency);
    }, [selectedCountry]);

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
    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

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
                                    Enter Assets
                                </h3>

                                <div className="flex flex-col">
                                    <label htmlFor="zakat-currency" className="text-sm font-medium opacity-80 mb-1">
                                        Currency
                                    </label>
                                    <select
                                        id="zakat-currency"
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        className="w-full px-3 py-2 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        {ZAKAT_CURRENCY_OPTIONS.map((currency) => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-neutral-dark/60 dark:text-neutral-light/60">
                                        All values and results are in {selectedCurrency}.
                                    </p>
                                </div>

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
                                            <span className="absolute left-3 top-2.5 opacity-50 text-xs font-semibold">{selectedCurrency}</span>
                                            <input
                                                type="number"
                                                name={input.name}
                                                min="0"
                                                value={zakatData[input.name as keyof typeof zakatData] || ''}
                                                onChange={handleInputChange}
                                                className="w-full pl-14 pr-4 py-2 bg-neutral-light/50 dark:bg-black/20 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                        {currencyFormatter.format(totalWealth)}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-primary/20">
                                    <p className="text-sm font-medium text-primary dark:text-primary-light mb-1">
                                        Your Zakat Amount (2.5%)
                                    </p>
                                    <p className="text-5xl font-bold text-primary dark:text-secondary-light">
                                        {currencyFormatter.format(zakatAmount)}
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

                            <div className="mb-4 space-y-2">
                                <label htmlFor="country" className="text-sm font-medium text-neutral-dark/80 dark:text-neutral-light/80">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full rounded-lg border border-primary/20 bg-neutral-light/60 dark:bg-black/20 px-3 py-2 text-sm text-neutral-dark dark:text-neutral-light outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {countryOptions.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="city" className="pt-2 text-sm font-medium text-neutral-dark/80 dark:text-neutral-light/80">
                                    City (searchable)
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    list="city-options"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    placeholder="Start typing city name"
                                    className="w-full rounded-lg border border-primary/20 bg-neutral-light/60 dark:bg-black/20 px-3 py-2 text-sm text-neutral-dark dark:text-neutral-light outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <datalist id="city-options">
                                    {cityOptions.map((city) => (
                                        <option key={city} value={city} />
                                    ))}
                                </datalist>

                                <p className="text-xs text-neutral-dark/60 dark:text-neutral-light/60">
                                    Showing times for {selectedCity}, {selectedCountry}
                                </p>
                            </div>

                            {prayerError ? (
                                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex-grow flex items-center justify-center">
                                    {prayerError}
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
                        <div className="bg-white dark:bg-neutral-dark p-6 rounded-2xl shadow-sm border border-primary/10 flex flex-col items-center justify-center text-center min-h-[360px]">
                            <div className="relative w-56 h-56 mb-6 grid place-items-center">
                                <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
                                <div className="absolute inset-3 rounded-full border border-primary/10" />
                                <div className="absolute top-3 text-xs font-semibold tracking-wide text-primary/80">N</div>
                                <Compass className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
                                <div
                                    className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
                                    style={{ transform: qiblaDirection !== null ? `rotate(${qiblaDirection}deg)` : "none" }}
                                >
                                    <div className="w-1 h-24 bg-secondary rounded-full origin-bottom -translate-y-8 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                                </div>
                                <div className="absolute w-3 h-3 rounded-full bg-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary dark:text-primary-light mb-2">Qibla Direction</h3>

                            {qiblaDirection !== null ? (
                                <div>
                                    <p className="text-3xl font-bold text-secondary dark:text-secondary-light mb-1">
                                        {qiblaDirection}°
                                    </p>
                                    <p className="text-sm opacity-70">From True North</p>
                                </div>
                            ) : qiblaError ? (
                                <p className="text-sm text-amber-600 dark:text-amber-400">{qiblaError}</p>
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
