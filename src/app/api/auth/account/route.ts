import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('Account GET error:', error);
        return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, currentPassword, newPassword } = body;

        await dbConnect();

        // Update display name
        if (name !== undefined) {
            if (!name.trim()) {
                return NextResponse.json({ message: 'Name cannot be empty.' }, { status: 400 });
            }
            await User.findOneAndUpdate(
                { email: session.user.email },
                { name: name.trim() }
            );
            return NextResponse.json({ message: 'Name updated successfully.' });
        }

        // Change password
        if (currentPassword !== undefined && newPassword !== undefined) {
            if (newPassword.length < 8) {
                return NextResponse.json({ message: 'New password must be at least 8 characters.' }, { status: 400 });
            }
            const user = await User.findOne({ email: session.user.email }).select('+password');
            if (!user) {
                return NextResponse.json({ message: 'User not found.' }, { status: 404 });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ message: 'Current password is incorrect.' }, { status: 400 });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            return NextResponse.json({ message: 'Password changed successfully.' });
        }

        return NextResponse.json({ message: 'No valid fields to update.' }, { status: 400 });
    } catch (error) {
        console.error('Account PUT error:', error);
        return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
    }
}
