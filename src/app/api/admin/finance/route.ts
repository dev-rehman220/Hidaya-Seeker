import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PaymentMethodKey = "card" | "bank" | "wallet";

function getHealthLabel(successRate: number) {
    if (successRate >= 0.98) return "healthy";
    if (successRate >= 0.9) return "monitor";
    return "critical";
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, Number(searchParams.get("page") || 1));
        const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit") || 20)));
        const skip = (page - 1) * limit;

        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const [summaryRows, recentDonations, methodRows] = await Promise.all([
            Donation.aggregate([
                {
                    $group: {
                        _id: null,
                        totalDonationsUsd: { $sum: "$amountUsd" },
                        totalRecords: { $sum: 1 },
                        succeeded: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "succeeded"] }, 1, 0],
                            },
                        },
                        pending: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0],
                            },
                        },
                        failed: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "failed"] }, 1, 0],
                            },
                        },
                    },
                },
            ]),
            Donation.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("donorName amount currency currencySymbol cause donationType paymentMethod paymentStatus transactionId createdAt")
                .lean(),
            Donation.aggregate([
                {
                    $group: {
                        _id: "$paymentMethod",
                        total: { $sum: 1 },
                        succeeded: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "succeeded"] }, 1, 0],
                            },
                        },
                        pending: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0],
                            },
                        },
                        failed: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "failed"] }, 1, 0],
                            },
                        },
                    },
                },
            ]),
        ]);

        const summary = summaryRows[0] || {
            totalDonationsUsd: 0,
            totalRecords: 0,
            succeeded: 0,
            pending: 0,
            failed: 0,
        };

        const defaults: Record<PaymentMethodKey, { total: number; succeeded: number; pending: number; failed: number }> = {
            card: { total: 0, succeeded: 0, pending: 0, failed: 0 },
            bank: { total: 0, succeeded: 0, pending: 0, failed: 0 },
            wallet: { total: 0, succeeded: 0, pending: 0, failed: 0 },
        };

        for (const row of methodRows) {
            const method = row._id as PaymentMethodKey;
            if (!defaults[method]) continue;
            defaults[method] = {
                total: Number(row.total || 0),
                succeeded: Number(row.succeeded || 0),
                pending: Number(row.pending || 0),
                failed: Number(row.failed || 0),
            };
        }

        const methods = (Object.keys(defaults) as PaymentMethodKey[]).map((method) => {
            const row = defaults[method];
            const successRate = row.total > 0 ? row.succeeded / row.total : 1;
            return {
                method,
                ...row,
                successRate,
                health: getHealthLabel(successRate),
            };
        });

        const overallSuccessRate = summary.totalRecords > 0 ? summary.succeeded / summary.totalRecords : 1;
        const totalRecords = Number(summary.totalRecords || 0);
        const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

        return NextResponse.json({
            totals: {
                totalDonationsUsd: Number(summary.totalDonationsUsd || 0),
                totalRecords,
                succeeded: Number(summary.succeeded || 0),
                pending: Number(summary.pending || 0),
                failed: Number(summary.failed || 0),
                overallSuccessRate,
                overallHealth: getHealthLabel(overallSuccessRate),
            },
            methods,
            recentDonations,
            pagination: {
                page,
                limit,
                totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages,
            },
        });
    } catch (error) {
        console.error("Admin Finance GET Error:", error);
        return NextResponse.json({ message: "Failed to fetch finance stats" }, { status: 500 });
    }
}
