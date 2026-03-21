import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { readDailyItems, writeDailyItems, type DailyJsonType, type DailyJsonItem } from '@/lib/dailyJsonStore';

// GET all items of a specific type
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') as DailyJsonType | null;

        if (!type || !['ayah', 'hadith', 'dua', 'reminder'].includes(type)) {
            return NextResponse.json({ message: 'Invalid or missing type parameter. Use: ayah, hadith, dua, or reminder' }, { status: 400 });
        }

        const items = await readDailyItems(type);
        return NextResponse.json({
            type,
            count: items.length,
            items,
        });
    } catch (error) {
        console.error('Items GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch items' }, { status: 500 });
    }
}

// POST to add a new item to the collection
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { type, item } = data;

        if (!type || !['ayah', 'hadith', 'dua', 'reminder'].includes(type)) {
            return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
        }

        if (!item || typeof item !== 'object') {
            return NextResponse.json({ message: 'Item is required and must be an object' }, { status: 400 });
        }

        if (!item.english || typeof item.english !== 'string') {
            return NextResponse.json({ message: 'Item must have an english field' }, { status: 400 });
        }

        const items = await readDailyItems(type as DailyJsonType);

        // Append new item with next ID
        const nextId = Math.max(...items.map((i) => i.id), 0) + 1;
        const newItem: DailyJsonItem = {
            id: nextId,
            arabic: item.arabic ?? '',
            english: item.english,
            translation: item.translation ?? '',
            reference: item.reference ?? '',
            subtitle: item.subtitle ?? '',
        };

        items.push(newItem);
        await writeDailyItems(type as DailyJsonType, items);

        return NextResponse.json({
            type,
            message: 'Item added successfully',
            item: newItem,
            totalItems: items.length,
        });
    } catch (error) {
        console.error('Items POST Error:', error);
        return NextResponse.json({ message: 'Failed to add item' }, { status: 500 });
    }
}

// PUT to update a specific item by ID
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { type, id, item } = data;

        if (!type || !['ayah', 'hadith', 'dua', 'reminder'].includes(type)) {
            return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
        }

        if (typeof id !== 'number' || id < 1) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const items = await readDailyItems(type as DailyJsonType);
        const itemIndex = items.findIndex((i) => i.id === id);

        if (itemIndex === -1) {
            return NextResponse.json({ message: `Item with ID ${id} not found` }, { status: 404 });
        }

        // Update fields
        items[itemIndex] = {
            id,
            arabic: item?.arabic ?? items[itemIndex].arabic,
            english: item?.english ?? items[itemIndex].english,
            translation: item?.translation ?? items[itemIndex].translation,
            reference: item?.reference ?? items[itemIndex].reference,
            subtitle: item?.subtitle ?? items[itemIndex].subtitle,
        };

        await writeDailyItems(type as DailyJsonType, items);

        return NextResponse.json({
            type,
            message: 'Item updated successfully',
            item: items[itemIndex],
        });
    } catch (error) {
        console.error('Items PUT Error:', error);
        return NextResponse.json({ message: 'Failed to update item' }, { status: 500 });
    }
}

// DELETE to remove a specific item by ID
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') as DailyJsonType | null;
        const idParam = searchParams.get('id');

        if (!type || !['ayah', 'hadith', 'dua', 'reminder'].includes(type)) {
            return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
        }

        const id = parseInt(idParam || '', 10);
        if (isNaN(id) || id < 1) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const items = await readDailyItems(type);
        const itemIndex = items.findIndex((i) => i.id === id);

        if (itemIndex === -1) {
            return NextResponse.json({ message: `Item with ID ${id} not found` }, { status: 404 });
        }

        const deletedItem = items.splice(itemIndex, 1)[0];
        await writeDailyItems(type, items);

        return NextResponse.json({
            type,
            message: 'Item deleted successfully',
            deletedItem,
            remainingCount: items.length,
        });
    } catch (error) {
        console.error('Items DELETE Error:', error);
        return NextResponse.json({ message: 'Failed to delete item' }, { status: 500 });
    }
}
