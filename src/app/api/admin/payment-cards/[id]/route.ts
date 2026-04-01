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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

        const updated = await PaymentCard.findByIdAndUpdate(
            params.id,
            {
                label,
                accountTitle,
                accountNumber,
                bankName: normalizeText(body?.bankName),
                iban: normalizeText(body?.iban),
                instructions: normalizeText(body?.instructions),
                sortOrder: Number(body?.sortOrder || 0),
                isActive: Boolean(body?.isActive ?? true),
                updatedAt: new Date(),
            },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ message: "Payment card not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, card: updated });
    } catch (error) {
        console.error("Admin Payment Card PUT Error:", error);
        return NextResponse.json({ message: "Failed to update payment card" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await requireAdmin();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const deleted = await PaymentCard.findByIdAndDelete(params.id).lean();
        if (!deleted) {
            return NextResponse.json({ message: "Payment card not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Payment Card DELETE Error:", error);
        return NextResponse.json({ message: "Failed to delete payment card" }, { status: 500 });
    }
}
