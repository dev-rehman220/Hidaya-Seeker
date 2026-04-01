import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

export const dynamic = "force-dynamic";

function normalizeText(value: unknown) {
    return String(value || "").trim();
}

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
        return null;
    }
    return session;
}

export async function GET() {
    try {
        const session = await requireAdmin();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const cards = await PaymentCard.find({})
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();

        return NextResponse.json(cards);
    } catch (error) {
        console.error("Admin Payment Cards GET Error:", error);
        return NextResponse.json({ message: "Failed to fetch payment cards" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await requireAdmin();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const label = normalizeText(body?.label);
        const accountTitle = normalizeText(body?.accountTitle);
        const accountNumber = normalizeText(body?.accountNumber);

        if (!label || !accountTitle || !accountNumber) {
            return NextResponse.json({ message: "label, accountTitle and accountNumber are required" }, { status: 400 });
        }

        await dbConnect();

        const created = await PaymentCard.create({
            label,
            accountTitle,
            accountNumber,
            bankName: normalizeText(body?.bankName),
            iban: normalizeText(body?.iban),
            instructions: normalizeText(body?.instructions),
            sortOrder: Number(body?.sortOrder || 0),
            isActive: Boolean(body?.isActive ?? true),
        });

        return NextResponse.json({ success: true, card: created }, { status: 201 });
    } catch (error) {
        console.error("Admin Payment Cards POST Error:", error);
        return NextResponse.json({ message: "Failed to create payment card" }, { status: 500 });
    }
}
