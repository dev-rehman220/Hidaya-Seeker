import { buildJazzCashCheckoutPayload, buildJazzCashCheckoutQueryUrl } from "@/lib/payments/jazzcash";

export type PaymentProvider = "jazzcash";
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
    checkoutFields?: Record<string, string>;
}

interface PaymentGateway {
    key: PaymentProvider;
    createIntent: (input: CreatePaymentIntentInput) => PaymentIntentResult;
}

function makeId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function createJazzCashIntent(input: CreatePaymentIntentInput): PaymentIntentResult {
    const transactionId = makeId("JC");
    const gatewayReference = `jazzcash-${transactionId}`;
    const checkoutPayload = buildJazzCashCheckoutPayload({
        transactionId,
        amount: input.amount,
        currency: input.currency,
        country: input.country,
        cause: input.cause,
        donationType: input.donationType,
        paymentMethod: input.paymentMethod,
        siteUrl: input.siteUrl,
    });
    const checkoutUrl = buildJazzCashCheckoutQueryUrl(checkoutPayload.checkoutUrl, checkoutPayload.params);

    return {
        provider: "jazzcash",
        transactionId,
        paymentStatus: "pending",
        checkoutUrl,
        gatewayReference,
        checkoutFields: checkoutPayload.params,
    };
}

const gateways: Record<PaymentProvider, PaymentGateway> = {
    jazzcash: {
        key: "jazzcash",
        createIntent: createJazzCashIntent,
    },
};

function pickProvider(): PaymentProvider {
    const configuredProvider = String(process.env.PAYMENT_PROVIDER || "jazzcash").trim().toLowerCase();
    if (configuredProvider in gateways) {
        return configuredProvider as PaymentProvider;
    }
    return "jazzcash";
}

export function createPaymentIntent(input: CreatePaymentIntentInput): PaymentIntentResult {
    const provider = pickProvider();
    return gateways[provider].createIntent(input);
}
