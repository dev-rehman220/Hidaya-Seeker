import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration attacks
        if (!user) {
            return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
        await user.save();

        // Send email if SMTP is configured
        if (process.env.EMAIL_SERVER_HOST) {
            try {
                const nodemailer = await import('nodemailer');
                const transporter = nodemailer.default.createTransport({
                    host: process.env.EMAIL_SERVER_HOST,
                    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
                    secure: process.env.EMAIL_SERVER_PORT === '465',
                    auth: {
                        user: process.env.EMAIL_SERVER_USER,
                        pass: process.env.EMAIL_SERVER_PASSWORD,
                    },
                });

                const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
                    to: email,
                    subject: 'Password Reset Request – Daily Reminder',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #0f4c3a;">Reset Your Password</h2>
                            <p>You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
                            <a href="${resetUrl}" style="display: inline-block; background: #0f4c3a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                                Reset Password
                            </a>
                            <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error('Failed to send reset email:', emailError);
                // Don't expose email errors to the client
            }
        }

        return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'An error occurred. Please try again.' }, { status: 500 });
    }
}
