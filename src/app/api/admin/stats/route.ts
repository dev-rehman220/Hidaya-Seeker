import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getDailyJsonEntryCount } from '@/lib/dailyJsonStore';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const [totalUsers, totalPosts, publishedPosts, draftPosts, contentItems] = await Promise.all([
            User.countDocuments({}),
            Post.countDocuments({}),
            Post.countDocuments({ status: 'published' }),
            Post.countDocuments({ status: 'draft' }),
            getDailyJsonEntryCount(),
        ]);

        const recentPosts = await Post.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title type status createdAt')
            .lean();

        return NextResponse.json({
            totalUsers,
            totalPosts,
            publishedPosts,
            draftPosts,
            contentItems: contentItems.total,
            contentItemCounts: contentItems,
            recentPosts,
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 });
    }
}
