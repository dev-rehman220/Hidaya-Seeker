import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COUNTRY_CURRENCIES: Record<string, {
    code: string;
    symbol: string;
    name: string;
    rate: number;
    flag: string;
    presets: number[];
}> = {
    US: { code: "USD", symbol: "$", name: "US Dollar", rate: 1, flag: "🇺🇸", presets: [10, 25, 50, 100, 500] },
    GB: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79, flag: "🇬🇧", presets: [5, 10, 25, 50, 250] },
    DE: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, flag: "🇩🇪", presets: [10, 20, 50, 100, 250] },
    FR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, flag: "🇫🇷", presets: [10, 20, 50, 100, 250] },
    PK: { code: "PKR", symbol: "₨", name: "Pakistani Rupee", rate: 278, flag: "🇵🇰", presets: [500, 1000, 2500, 5000, 10000] },
    SA: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75, flag: "🇸🇦", presets: [20, 50, 100, 200, 500] },
    AE: { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67, flag: "🇦🇪", presets: [20, 50, 100, 250, 500] },
    BD: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", rate: 110, flag: "🇧🇩", presets: [500, 1000, 2500, 5000, 10000] },
    MY: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", rate: 4.72, flag: "🇲🇾", presets: [20, 50, 100, 250, 500] },
    ID: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", rate: 15600, flag: "🇮🇩", presets: [50000, 100000, 250000, 500000, 1000000] },
    TR: { code: "TRY", symbol: "₺", name: "Turkish Lira", rate: 32.5, flag: "🇹🇷", presets: [100, 250, 500, 1000, 2500] },
    EG: { code: "EGP", symbol: "ج.م", name: "Egyptian Pound", rate: 48.5, flag: "🇪🇬", presets: [100, 250, 500, 1000, 2500] },
    NG: { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1540, flag: "🇳🇬", presets: [5000, 10000, 25000, 50000, 100000] },
    MA: { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham", rate: 10.1, flag: "🇲🇦", presets: [50, 100, 250, 500, 1000] },
    CA: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36, flag: "🇨🇦", presets: [10, 25, 50, 100, 500] },
    AU: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53, flag: "🇦🇺", presets: [10, 25, 50, 100, 500] },
    IN: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.3, flag: "🇮🇳", presets: [500, 1000, 2500, 5000, 10000] },
    QA: { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal", rate: 3.64, flag: "🇶🇦", presets: [25, 50, 100, 250, 500] },
    KW: { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", rate: 0.31, flag: "🇰🇼", presets: [5, 10, 25, 50, 100] },
    MX: { code: "MXN", symbol: "MX$", name: "Mexican Peso", rate: 17.2, flag: "🇲🇽", presets: [100, 250, 500, 1000, 2500] },
    ZA: { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.6, flag: "🇿🇦", presets: [100, 250, 500, 1000, 2500] },
};

function getDefaultCurrency() {
    return { country: "US", ...COUNTRY_CURRENCIES["US"] };
}

export async function GET(req: NextRequest) {
    // Allow manual country override via query param
    const { searchParams } = new URL(req.url);
    const countryOverride = searchParams.get("country")?.toUpperCase();

    if (countryOverride && COUNTRY_CURRENCIES[countryOverride]) {
        return NextResponse.json({ country: countryOverride, ...COUNTRY_CURRENCIES[countryOverride] });
    }

    // Detect from IP
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || "";

    // Basic IP validation - only attempt lookup for non-private IPs
    const privatePatterns = [/^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^::1$/];
    const isPrivate = !ip || privatePatterns.some(p => p.test(ip));

    if (!isPrivate) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            const geoRes = await fetch(
                `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
                {
                    signal: controller.signal,
                    headers: { "User-Agent": "IslamicDailyReminder/1.0 (currency detection)" },
                }
            );
            clearTimeout(timeout);

            if (geoRes.ok) {
                const geo = await geoRes.json();
                const countryCode: string = geo?.country_code || "";
                if (countryCode && COUNTRY_CURRENCIES[countryCode]) {
                    return NextResponse.json({ country: countryCode, ...COUNTRY_CURRENCIES[countryCode] });
                }
            }
        } catch {
            // Fall through to default
        }
    }

    return NextResponse.json(getDefaultCurrency());
}
