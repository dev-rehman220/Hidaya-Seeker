import { NextResponse } from "next/server";

import { createPaymentIntent } from "@/lib/payments/router";

export const dynamic = "force-dynamic";

const VALID_CAUSES = new Set(["general", "zakat", "sadaqah"]);
const VALID_DONATION_TYPES = new Set(["one-time", "monthly"]);
const VALID_PAYMENT_METHODS = new Set(["card", "bank", "wallet"]);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const amount = Number(body?.amount);
        const currency = String(body?.currency || "USD").toUpperCase();
        const country = String(body?.country || "").toUpperCase();
        const cause = String(body?.cause || "general");
        const donationType = String(body?.donationType || "one-time");
        const paymentMethod = String(body?.paymentMethod || "card");

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
        }

        if (!VALID_CAUSES.has(cause)) {
            return NextResponse.json({ message: "Invalid donation cause" }, { status: 400 });
        }

        if (!VALID_DONATION_TYPES.has(donationType)) {
            return NextResponse.json({ message: "Invalid donation type" }, { status: 400 });
        }

        if (!VALID_PAYMENT_METHODS.has(paymentMethod)) {
            return NextResponse.json({ message: "Invalid payment method" }, { status: 400 });
        }

        const origin = new URL(req.url).origin;

        const intent = createPaymentIntent({
            amount,
            currency,
            country,
            cause: cause as "general" | "zakat" | "sadaqah",
            donationType: donationType as "one-time" | "monthly",
            paymentMethod: paymentMethod as "card" | "bank" | "wallet",
            donorName: String(body?.donorName || ""),
            donorEmail: String(body?.donorEmail || ""),
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL || origin,
        });

        return NextResponse.json({ success: true, intent });
    } catch (error) {
        console.error("Create Intent Error:", error);
        return NextResponse.json({ message: "Failed to create payment intent" }, { status: 500 });
    }
}
