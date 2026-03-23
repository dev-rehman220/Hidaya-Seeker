# هداية — Hidaya Seeker

A modern full-stack Islamic web application built with **Next.js 14**, **MongoDB Atlas**, **NextAuth.js**, and **Tailwind CSS**. The app provides daily Qur'an Ayahs, Hadiths, Duas, Islamic reminders, prayer times, a Hijri calendar, educational resources, and a full blog/post system — all in a beautiful, fully-responsive dark/light UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌙 **Daily Guidance** | Daily Qur'an Ayah, Hadith, Dua, and Islamic Reminder managed via Admin CMS |
| 📚 **Learn Islam** | Prophet timeline, topic library, individual prophet pages |
| 📰 **Posts & Videos** | Blog-style posts and YouTube-embedded video posts |
| 🕌 **Islamic Tools** | Prayer times (by GPS), Qibla direction, Zakat calculator |
| 📅 **Hijri Calendar** | Gregorian ↔ Hijri date converter via Aladhan API |
| 💚 **Donate Page** | Multi-currency donation UI with IP-based currency detection and JazzCash payment routing |
| 🔐 **Auth System** | Register, login, forgot password (email reset), account settings |
| 🛡️ **Admin Dashboard** | Full CMS: manage daily content, create/edit/delete/publish posts |
| 🌗 **Dark / Light Mode** | System-aware with manual toggle |
| 📱 **Fully Responsive** | Mobile-first, works on all screen sizes |

---

## 🚀 Getting Started (Local)

### 1. Clone the repository
```bash
git clone https://github.com/dev-rehman220/Hidaya-Seeker.git
cd Hidaya-Seeker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in all required values (see [Environment Variables](#environment-variables) below).

### 4. Seed the admin user
```bash
node scripts/seed-admin.mjs
```
Default credentials: `admin@dailyreminder.com` / `Admin@12345`  
**Change the password immediately after first login.**

### 5. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import `Hidaya-Seeker`.
3. Under **Settings → Environment Variables**, add every variable from `.env.example` with your real production values.
4. Set `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://hidaya-seeker.vercel.app`).
5. Click **Deploy**. Vercel will auto-build and deploy.

> On re-deploys, environment variables in Vercel override those in `vercel.json` — manage them in the Vercel dashboard.

---

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ char string for JWT signing |
| `NEXTAUTH_URL` | ✅ | Full URL of the site (`http://localhost:3000` locally) |
| `EMAIL_SERVER_HOST` | ✅ | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_SERVER_PORT` | ✅ | SMTP port (e.g. `587`) |
| `EMAIL_SERVER_USER` | ✅ | SMTP username / Gmail address |
| `EMAIL_SERVER_PASSWORD` | ✅ | SMTP password / Gmail App Password |
| `EMAIL_FROM` | ✅ | From name + address for emails |
| `PAYMENT_PROVIDER` | ⚠️ | Payment gateway key. Default: `jazzcash` |
| `JAZZCASH_CHECKOUT_URL` | ⚠️ | JazzCash checkout endpoint URL |
| `JAZZCASH_MERCHANT_ID` | ⚠️ | JazzCash merchant ID |
| `JAZZCASH_PASSWORD` | ⚠️ | JazzCash merchant password |
| `JAZZCASH_INTEGRITY_SALT` | ⚠️ | JazzCash integrity salt for secure hashing |
| `JAZZCASH_SUB_MERCHANT_ID` | ⚠️ | Optional sub-merchant ID |
| `JAZZCASH_BANK_ID` | ⚠️ | Optional bank ID |
| `JAZZCASH_PRODUCT_ID` | ⚠️ | Optional product ID |
| `JAZZCASH_API_VERSION` | ⚠️ | JazzCash API version (default `1.1`) |
| `JAZZCASH_LANGUAGE` | ⚠️ | Request language (default `EN`) |
| `JAZZCASH_TRANSACTION_CURRENCY` | ⚠️ | Settlement currency (default `PKR`) |
| `JAZZCASH_RETURN_URL` | ⚠️ | Return/callback endpoint URL |
| `PAYMENT_WEBHOOK_SECRET` | ⚠️ | Shared secret to protect payment webhook route |
| `JAZZCASH_WEBHOOK_SECRET` | ⚠️ | JazzCash-specific webhook secret (overrides `PAYMENT_WEBHOOK_SECRET`) |

## JazzCash Integration Steps (After Code Integration)

1. Copy env template and set real credentials:
	- `cp .env.local.example .env.local`
	- Fill all `JAZZCASH_*` values from JazzCash merchant dashboard.
2. Set callback URL in JazzCash portal to:
	- `https://your-domain.com/api/payments/webhook`
3. Set webhook/signature secret headers:
	- If you send `x-jazzcash-signature` (HMAC SHA-256 of raw JSON body), set `JAZZCASH_WEBHOOK_SECRET`.
	- If you rely on secure hash in payload (`pp_SecureHash`), set `JAZZCASH_INTEGRITY_SALT`.
4. For local testing, expose localhost with a tunnel (e.g. ngrok) and set:
	- `JAZZCASH_RETURN_URL=https://<your-ngrok>/api/payments/webhook`
5. Start app and test hosted checkout flow:
	- `npm run dev`
	- Submit donation on `/donate`, confirm redirect to JazzCash page.
6. Verify webhook writes status updates:
	- Confirm donation row in admin finance updates from `pending` to final state.
7. Go live safely:
	- Switch `JAZZCASH_CHECKOUT_URL` from sandbox to production endpoint.
	- Rotate secrets and re-test one live low-value transaction.

> Generate `NEXTAUTH_SECRET`:  
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 🗂️ Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── admin/            # Admin dashboard (CMS + post manager)
│   ├── api/              # REST API routes (auth, posts, content, etc.)
│   ├── learn/            # Islamic learning section
│   ├── tools/            # Prayer times, Qibla, Zakat calculator
│   ├── dashboard/        # Authenticated user dashboard
│   └── ...               # Other pages (donate, calendar, posts, etc.)
├── components/           # Reusable UI components
├── lib/                  # Utilities (auth, mongodb, prayer times, bookmarks)
├── models/               # Mongoose schemas (User, Post, DailyContent)
└── types/                # TypeScript type augmentations
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) via [Mongoose](https://mongoosejs.com)
- **Auth**: [NextAuth.js v4](https://next-auth.js.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + custom Islamic color palette
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: Inter + Amiri (Arabic) via Google Fonts
- **Email**: [Nodemailer](https://nodemailer.com)
- **External APIs**: [Aladhan](https://aladhan.com/prayer-times-api) (prayer times & Hijri calendar)
- **Deployment**: [Vercel](https://vercel.com)

---

## 🔐 Security Notes

- `.env.local` is in `.gitignore` and never committed.
- All admin routes are protected server-side via `getServerSession`.
- Passwords are hashed with `bcrypt` (10 rounds).
- Password reset tokens are hashed (SHA-256) before storage.
- Client input is validated on both client and server.

---

## 📜 License

MIT — feel free to use, modify, and share with attribution.
