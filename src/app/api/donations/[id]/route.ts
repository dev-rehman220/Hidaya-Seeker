import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid donation ID" }, { status: 400 });
        }

        await dbConnect();

        const result = await Donation.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Donation deleted successfully" });
    } catch (error) {
        console.error("Donation DELETE Error:", error);
        return NextResponse.json({ message: "Failed to delete donation" }, { status: 500 });
    }
}
