import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";

export const dynamic = "force-dynamic";

const VALID_PAYMENT_STATUS = new Set(["succeeded", "pending", "failed"]);

export async function POST(req: Request) {
    try {
        const configuredSecret = process.env.PAYMENT_WEBHOOK_SECRET;
        const incomingSecret = req.headers.get("x-webhook-secret") || "";

        if (configuredSecret && incomingSecret !== configuredSecret) {
            return NextResponse.json({ message: "Unauthorized webhook" }, { status: 401 });
        }

        const body = await req.json();
        const transactionId = String(body?.transactionId || "").trim();
        const paymentStatus = String(body?.paymentStatus || "").trim();
        const gatewayReference = String(body?.gatewayReference || "").trim();

        if (!transactionId) {
            return NextResponse.json({ message: "transactionId is required" }, { status: 400 });
        }

        if (!VALID_PAYMENT_STATUS.has(paymentStatus)) {
            return NextResponse.json({ message: "Invalid paymentStatus" }, { status: 400 });
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
