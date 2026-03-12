import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// GET single post
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
        }

        await dbConnect();
        const post = await Post.findById(id).lean();

        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
    }
}

// PUT update post (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
        }

        const data = await req.json();
        await dbConnect();

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Posts PUT Error:', error);
        return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE post (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
        }

        await dbConnect();

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Posts DELETE Error:', error);
        return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
    }
}
