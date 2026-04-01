import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown) {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
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
            .select("donorName donorEmail amount currency currencySymbol cause donationType paymentMethod paymentStatus verificationStatus transactionId gatewayReference paymentProofUrl meta createdAt")
            .lean();

        const header = [
            "date",
            "transaction_id",
            "donor_name",
            "donor_email",
            "amount",
            "currency",
            "currency_symbol",
            "cause",
            "donation_type",
            "payment_method",
            "payment_status",
            "verification_status",
            "gateway_reference",
            "payment_card_label",
            "payment_proof_url",
        ];

        const rows = donations.map((d: any) => [
            new Date(d.createdAt).toISOString(),
            d.transactionId,
            d.donorName,
            d.donorEmail,
            d.amount,
            d.currency,
            d.currencySymbol,
            d.cause,
            d.donationType,
            d.paymentMethod,
            d.paymentStatus,
            d.verificationStatus || "",
            d.gatewayReference || "",
            d.meta?.paymentCardLabel || "",
            d.paymentProofUrl || "",
        ]);

        const csv = [header, ...rows]
            .map((line) => line.map(csvEscape).join(","))
            .join("\n");

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename=donations-${new Date().toISOString().slice(0, 10)}.csv`,
            },
        });
    } catch (error) {
        console.error("Admin Finance Export Error:", error);
        return NextResponse.json({ message: "Failed to export finance data" }, { status: 500 });
    }
}
