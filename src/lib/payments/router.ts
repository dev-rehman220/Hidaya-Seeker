export type PaymentProvider = "payfast" | "twocheckout";
export type PaymentStatus = "pending" | "succeeded" | "failed";

export interface CreatePaymentIntentInput {
    amount: number;
    currency: string;
    country: string;
    paymentMethod: "card" | "bank" | "wallet";
    donationType: "one-time" | "monthly";
    cause: "general" | "zakat" | "sadaqah";
    donorName?: string;
    donorEmail?: string;
    siteUrl: string;
}

export interface PaymentIntentResult {
    provider: PaymentProvider;
    transactionId: string;
    paymentStatus: PaymentStatus;
    checkoutUrl: string;
    gatewayReference: string;
}

function makeId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function normalizeCountry(country: string) {
    return String(country || "").trim().toUpperCase();
}

function normalizeCurrency(currency: string) {
    return String(currency || "").trim().toUpperCase();
}

function pickProvider(country: string, currency: string): PaymentProvider {
    const normalizedCountry = normalizeCountry(country);
    const normalizedCurrency = normalizeCurrency(currency);

    if (normalizedCountry === "PK" || normalizedCurrency === "PKR") {
        return "payfast";
    }

    return "twocheckout";
}

function createPayFastIntent(input: CreatePaymentIntentInput): PaymentIntentResult {
    const transactionId = makeId("PF");
    const gatewayReference = `payfast-${transactionId}`;

    const baseCheckoutUrl = process.env.PAYFAST_CHECKOUT_URL || `${input.siteUrl}/donate`;
    const checkoutUrl = `${baseCheckoutUrl}?provider=payfast&txn=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(
        String(input.amount)
    )}&currency=${encodeURIComponent(input.currency)}`;

    return {
        provider: "payfast",
        transactionId,
        paymentStatus: "pending",
        checkoutUrl,
        gatewayReference,
    };
}

function createTwoCheckoutIntent(input: CreatePaymentIntentInput): PaymentIntentResult {
    const transactionId = makeId("2CO");
    const gatewayReference = `twocheckout-${transactionId}`;

    const baseCheckoutUrl = process.env.TWOCHECKOUT_CHECKOUT_URL || `${input.siteUrl}/donate`;
    const checkoutUrl = `${baseCheckoutUrl}?provider=twocheckout&txn=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(
        String(input.amount)
    )}&currency=${encodeURIComponent(input.currency)}`;

    return {
        provider: "twocheckout",
        transactionId,
        paymentStatus: "pending",
        checkoutUrl,
        gatewayReference,
    };
}

export function createPaymentIntent(input: CreatePaymentIntentInput): PaymentIntentResult {
    const provider = pickProvider(input.country, input.currency);

    if (provider === "payfast") {
        return createPayFastIntent(input);
    }

    return createTwoCheckoutIntent(input);
}
