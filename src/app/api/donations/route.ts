import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_CAUSES = new Set(["general", "zakat", "sadaqah"]);
const VALID_DONATION_TYPES = new Set(["one-time", "monthly"]);
const VALID_PAYMENT_METHODS = new Set(["card", "bank", "wallet"]);
const VALID_PAYMENT_STATUS = new Set(["succeeded", "pending", "failed"]);
const VALID_PROVIDERS = new Set(["payfast", "twocheckout", "manual"]);

function toUsd(amount: number, rate: number) {
    if (!Number.isFinite(rate) || rate <= 0) return amount;
    return amount / rate;
}

function makeTransactionId() {
    return `DON-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const amount = Number(data?.amount);
        const currency = String(data?.currency || "USD").toUpperCase();
        const currencySymbol = String(data?.currencySymbol || "$");
        const rate = Number(data?.rate || 1);
        const cause = String(data?.cause || "general");
        const donationType = String(data?.donationType || "one-time");
        const paymentMethod = String(data?.paymentMethod || "card");
        const paymentStatus = String(data?.paymentStatus || "succeeded");
        const provider = String(data?.provider || "manual");
        const transactionId = String(data?.transactionId || "").trim() || makeTransactionId();
        const gatewayReference = String(data?.gatewayReference || "").trim();

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ message: "Invalid donation amount" }, { status: 400 });
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

        if (!VALID_PAYMENT_STATUS.has(paymentStatus)) {
            return NextResponse.json({ message: "Invalid payment status" }, { status: 400 });
        }

        if (!VALID_PROVIDERS.has(provider)) {
            return NextResponse.json({ message: "Invalid payment provider" }, { status: 400 });
        }

        await dbConnect();

        const created = await Donation.create({
            donorName: String(data?.donorName || "Anonymous"),
            donorEmail: String(data?.donorEmail || ""),
            amount,
            currency,
            currencySymbol,
            amountUsd: toUsd(amount, rate),
            cause,
            donationType,
            paymentMethod,
            provider,
            paymentStatus,
            transactionId,
            gatewayReference,
            meta: {
                country: String(data?.country || "").toUpperCase(),
                source: "donate-page",
            },
        });

        return NextResponse.json({ success: true, donation: created }, { status: 201 });
    } catch (error) {
        if ((error as any)?.code === 11000) {
            return NextResponse.json({ message: "Duplicate transaction ID" }, { status: 409 });
        }
        console.error("Donations POST Error:", error);
        return NextResponse.json({ message: "Failed to record donation" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const donations = await Donation.find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return NextResponse.json(donations);
    } catch (error) {
        console.error("Donations GET Error:", error);
        return NextResponse.json({ message: "Failed to fetch donations" }, { status: 500 });
    }
}
