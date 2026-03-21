import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDailyItemForDate, saveTodayDailyItem, type DailyJsonType } from '@/lib/dailyJsonStore';

const JSON_DAILY_TYPES: DailyJsonType[] = ['ayah', 'hadith', 'dua', 'reminder'];

// GET all daily content
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');
        let targetDate: Date | undefined;

        if (dateParam) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
                return NextResponse.json({ message: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
            }

            const parsedDate = new Date(`${dateParam}T00:00:00.000Z`);
            if (Number.isNaN(parsedDate.getTime())) {
                return NextResponse.json({ message: 'Invalid date value' }, { status: 400 });
            }

            targetDate = parsedDate;
        }

        const dailyJsonContent = await Promise.all([
            getDailyItemForDate('ayah', targetDate),
            getDailyItemForDate('hadith', targetDate),
            getDailyItemForDate('dua', targetDate),
            getDailyItemForDate('reminder', targetDate),
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
