/**
 * Run with: node scripts/seed-admin.mjs
 * Creates (or updates) an admin user in MongoDB.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { fileURLToPath } from 'url';

// Override DNS to use Google (8.8.8.8) — local router can't resolve Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { dirname, join } from 'path';
import fs from 'fs';

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [key, ...rest] = trimmed.split('=');
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI not found in .env.local');
    process.exit(1);
}

// ── Admin credentials ──────────────────────────────────────
const ADMIN_NAME     = 'Admin';
const ADMIN_EMAIL    = 'admin@dailyreminder.com';
const ADMIN_PASSWORD = 'Admin@12345';
// ──────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const result = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        {
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('\n🎉 Admin user ready!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   Role    :', result.role);
    console.log('\n👉 Sign in at http://localhost:3000/login\n');

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
