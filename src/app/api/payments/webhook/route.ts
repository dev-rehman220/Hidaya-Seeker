import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import { parseJazzCashPaymentStatus, verifyJazzCashWebhook } from "@/lib/payments/jazzcash";
import Donation from "@/models/Donation";

export const dynamic = "force-dynamic";

function parseWebhookPayload(rawBody: string) {
    if (!rawBody.trim()) return {};

    try {
        return JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
        const form = new URLSearchParams(rawBody);
        const parsed: Record<string, string> = {};
        form.forEach((value, key) => {
            parsed[key] = value;
        });
        return parsed;
    }
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const body = parseWebhookPayload(rawBody);

        const verification = verifyJazzCashWebhook({
            payload: body,
            rawBody,
            signatureHeader:
                req.headers.get("x-jazzcash-signature") ||
                req.headers.get("x-webhook-signature") ||
                req.headers.get("x-webhook-secret") ||
                "",
            webhookSecret: process.env.JAZZCASH_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET,
            integritySalt: process.env.JAZZCASH_INTEGRITY_SALT,
        });

        if (!verification.isValid) {
            return NextResponse.json({ message: verification.reason || "Unauthorized webhook" }, { status: 401 });
        }

        const transactionId = String(body?.transactionId || body?.pp_TxnRefNo || "").trim();
        const paymentStatus = parseJazzCashPaymentStatus(body);
        const gatewayReference = String(
            body?.gatewayReference || body?.pp_RetreivalReferenceNo || body?.pp_RetrievalReferenceNo || body?.pp_TxnRefNo || ""
        ).trim();

        if (!transactionId) {
            return NextResponse.json({ message: "transactionId is required" }, { status: 400 });
        }

        await dbConnect();

        const donation = await Donation.findOneAndUpdate(
            { transactionId },
            {
                paymentStatus,
                gatewayReference,
                updatedAt: new Date(),
            },
            { new: true }
        ).lean();

        if (!donation) {
            return NextResponse.json({ message: "Donation record not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, donation });
    } catch (error) {
        console.error("Payment Webhook Error:", error);
        return NextResponse.json({ message: "Failed to process webhook" }, { status: 500 });
    }
}
