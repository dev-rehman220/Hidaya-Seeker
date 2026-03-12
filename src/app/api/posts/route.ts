import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET all published posts (public) or all posts (admin)
export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const isAdmin = session && (session.user as any)?.role === 'admin';

        const filter = isAdmin ? {} : { status: 'published' };
        const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Posts GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST create new post (admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { title, type, content, videoUrl, thumbnail, category, status } = data;

        if (!title || !content) {
            return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
        }

        if (type === 'video' && !videoUrl) {
            return NextResponse.json({ message: 'Video URL is required for video posts' }, { status: 400 });
        }

        await dbConnect();

        const post = await Post.create({
            title,
            type: type || 'post',
            content,
            videoUrl: videoUrl || '',
            thumbnail: thumbnail || '',
            category: category || 'general',
            status: status || 'draft',
            author: session.user?.name || 'Admin',
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Posts POST Error:', error);
        return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
    }
}
