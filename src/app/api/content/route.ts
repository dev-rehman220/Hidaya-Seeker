import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTodayDailyItem, saveTodayDailyItem, type DailyJsonType } from '@/lib/dailyJsonStore';

const JSON_DAILY_TYPES: DailyJsonType[] = ['ayah', 'hadith', 'dua', 'reminder'];

// GET all daily content
export async function GET() {
    try {
        const dailyJsonContent = await Promise.all([
            getTodayDailyItem('ayah'),
            getTodayDailyItem('hadith'),
            getTodayDailyItem('dua'),
            getTodayDailyItem('reminder'),
        ]);
        return NextResponse.json(dailyJsonContent);
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

        if (JSON_DAILY_TYPES.includes(type as DailyJsonType)) {
            if (!updateData.english || typeof updateData.english !== 'string') {
                return NextResponse.json({ message: 'English text is required' }, { status: 400 });
            }

            const updatedJsonContent = await saveTodayDailyItem(type as DailyJsonType, {
                arabic: updateData.arabic,
                english: updateData.english,
                translation: updateData.translation,
                reference: updateData.reference,
                subtitle: updateData.subtitle,
            });

            return NextResponse.json(updatedJsonContent);
        }

        return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error("Content API Error:", error);
        return NextResponse.json({ message: "Failed to update content" }, { status: 500 });
    }
}
