import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await dbConnect();

        const cards = await PaymentCard.find({ isActive: true })
            .sort({ sortOrder: 1, createdAt: -1 })
            .select("label accountTitle accountNumber bankName iban instructions")
            .lean();

        return NextResponse.json(cards);
    } catch (error) {
        console.error("Payment Cards GET Error:", error);
        return NextResponse.json({ message: "Failed to fetch payment cards" }, { status: 500 });
    }
}
