import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_PAYMENT_STATUS = new Set(["succeeded", "pending", "failed"]);

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const transactionId = String(body?.transactionId || "").trim();
        const paymentStatus = String(body?.paymentStatus || "").trim();
        const gatewayReference = String(body?.gatewayReference || `sim-${Date.now()}`).trim();

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
        console.error("Admin Test Webhook Error:", error);
        return NextResponse.json({ message: "Failed to simulate webhook" }, { status: 500 });
    }
}
