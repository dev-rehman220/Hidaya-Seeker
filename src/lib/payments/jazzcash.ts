import crypto from "crypto";

export interface JazzCashCheckoutContext {
    transactionId: string;
    amount: number;
    currency: string;
    country: string;
    cause: "general" | "zakat" | "sadaqah";
    donationType: "one-time" | "monthly";
    paymentMethod: "card" | "bank" | "wallet";
    siteUrl: string;
}

export interface JazzCashVerificationInput {
    payload: Record<string, unknown>;
    rawBody: string;
    signatureHeader: string;
    webhookSecret?: string;
    integritySalt?: string;
}

export interface JazzCashVerificationResult {
    isValid: boolean;
    reason?: string;
}

const DEFAULT_CHECKOUT_URL = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform";
const DEFAULT_TRANSACTION_CURRENCY = "PKR";

function hmacSha256Hex(secret: string, payload: string) {
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function normalizeString(value: unknown) {
    return String(value ?? "").trim();
}

function isoLikeDateTime(date: Date) {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(
        date.getMinutes()
    )}${pad(date.getSeconds())}`;
}

function buildJazzCashSecureHashPayload(params: Record<string, string>) {
    return Object.keys(params)
        .filter((key) => key !== "pp_SecureHash" && normalizeString(params[key]) !== "")
        .sort((a, b) => a.localeCompare(b))
        .map((key) => `${key}=${normalizeString(params[key])}`)
        .join("&");
}

function asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }
    return value as Record<string, unknown>;
}

export function toJazzCashTransactionCurrency(currency: string) {
    const configured = normalizeString(process.env.JAZZCASH_TRANSACTION_CURRENCY || DEFAULT_TRANSACTION_CURRENCY).toUpperCase();
    const normalizedIncoming = normalizeString(currency).toUpperCase();
    return configured || normalizedIncoming || DEFAULT_TRANSACTION_CURRENCY;
}

export function mapJazzCashTxnType(paymentMethod: JazzCashCheckoutContext["paymentMethod"]) {
    if (paymentMethod === "wallet") return "MWALLET";
    if (paymentMethod === "bank") return "MIGS";
    return "MPAY";
}

export function buildJazzCashCheckoutPayload(context: JazzCashCheckoutContext) {
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 60 * 1000);

    const transactionCurrency = toJazzCashTransactionCurrency(context.currency);
    const minorAmount = String(Math.max(1, Math.round(context.amount * 100)));

    const merchantId = normalizeString(process.env.JAZZCASH_MERCHANT_ID);
    const password = normalizeString(process.env.JAZZCASH_PASSWORD);
    const integritySalt = normalizeString(process.env.JAZZCASH_INTEGRITY_SALT);
    const returnUrl = normalizeString(process.env.JAZZCASH_RETURN_URL) || `${context.siteUrl}/api/payments/webhook`;

    const params: Record<string, string> = {
        pp_Version: normalizeString(process.env.JAZZCASH_API_VERSION || "1.1"),
        pp_TxnType: mapJazzCashTxnType(context.paymentMethod),
        pp_Language: normalizeString(process.env.JAZZCASH_LANGUAGE || "EN"),
        pp_MerchantID: merchantId,
        pp_SubMerchantID: normalizeString(process.env.JAZZCASH_SUB_MERCHANT_ID),
        pp_Password: password,
        pp_BankID: normalizeString(process.env.JAZZCASH_BANK_ID),
        pp_ProductID: normalizeString(process.env.JAZZCASH_PRODUCT_ID),
        pp_TxnRefNo: context.transactionId,
        pp_Amount: minorAmount,
        pp_TxnCurrency: transactionCurrency,
        pp_TxnDateTime: isoLikeDateTime(now),
        pp_TxnExpiryDateTime: isoLikeDateTime(expiry),
        pp_BillReference: `HS-${context.cause.toUpperCase()}`,
        pp_Description: `Hidaya donation (${context.donationType})`,
        pp_ReturnURL: returnUrl,
        ppmpf_1: context.cause,
        ppmpf_2: context.donationType,
        ppmpf_3: context.country,
    };

    if (integritySalt) {
        const payload = buildJazzCashSecureHashPayload(params);
        params.pp_SecureHash = hmacSha256Hex(integritySalt, payload).toUpperCase();
    }

    const checkoutUrl = normalizeString(process.env.JAZZCASH_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL;

    return {
        checkoutUrl,
        params,
    };
}

export function buildJazzCashCheckoutQueryUrl(baseUrl: string, params: Record<string, string>) {
    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(params)) {
        if (!normalizeString(value)) continue;
        url.searchParams.set(key, value);
    }
    return url.toString();
}

export function verifyJazzCashWebhook(input: JazzCashVerificationInput): JazzCashVerificationResult {
    const payload = asRecord(input.payload);

    const webhookSecret = normalizeString(input.webhookSecret);
    const signatureHeader = normalizeString(input.signatureHeader);
    if (webhookSecret) {
        const expected = hmacSha256Hex(webhookSecret, input.rawBody);
        if (signatureHeader.toLowerCase() !== expected.toLowerCase()) {
            return { isValid: false, reason: "Webhook signature mismatch" };
        }
    }

    const integritySalt = normalizeString(input.integritySalt);
    const secureHash = normalizeString(payload.pp_SecureHash || payload.secureHash || payload.signature);
    if (integritySalt && secureHash) {
        const normalizedPayload: Record<string, string> = {};
        for (const [key, value] of Object.entries(payload)) {
            if (key === "pp_SecureHash" || key === "secureHash" || key === "signature") continue;
            normalizedPayload[key] = normalizeString(value);
        }
        const hashPayload = buildJazzCashSecureHashPayload(normalizedPayload);
        const expectedHash = hmacSha256Hex(integritySalt, hashPayload).toUpperCase();
        if (secureHash.toUpperCase() !== expectedHash) {
            return { isValid: false, reason: "JazzCash secure hash mismatch" };
        }
    }

    return { isValid: true };
}

export function parseJazzCashPaymentStatus(payload: Record<string, unknown>): "succeeded" | "pending" | "failed" {
    const explicitStatus = normalizeString(payload.paymentStatus || payload.status).toLowerCase();
    if (explicitStatus === "succeeded" || explicitStatus === "failed" || explicitStatus === "pending") {
        return explicitStatus;
    }

    const responseCode = normalizeString(payload.pp_ResponseCode || payload.responseCode);
    if (responseCode === "000") return "succeeded";
    if (responseCode) return "failed";

    const txnStatus = normalizeString(payload.pp_TxnStatus || payload.txnStatus).toLowerCase();
    if (txnStatus.includes("success")) return "succeeded";
    if (txnStatus.includes("fail") || txnStatus.includes("cancel")) return "failed";

    return "pending";
}
