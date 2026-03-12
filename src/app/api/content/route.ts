import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import DailyContent from '@/models/DailyContent';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all daily content
export async function GET() {
    try {
        await dbConnect();
        const content = await DailyContent.find({});
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch content" }, { status: 500 });
    }
}

// POST/PUT update daily content (Protected)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { type, ...updateData } = data;

        if (!type) {
            return NextResponse.json({ message: "Type is required" }, { status: 400 });
        }

        await dbConnect();
        
        const updatedContent = await DailyContent.findOneAndUpdate(
            { type },
            { ...updateData, lastUpdated: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json(updatedContent);
    } catch (error) {
        console.error("Content API Error:", error);
        return NextResponse.json({ message: "Failed to update content" }, { status: 500 });
    }
}
