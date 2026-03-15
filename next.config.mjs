/** @type {import('next').NextConfig} */
const cspHeader = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https: data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "connect-src 'self' https://api.aladhan.com https://www.google-analytics.com",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
].join('; ');

const nextConfig = {
    // Allow images from common external sources used in the app
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        remotePatterns: [
            { protocol: 'https', hostname: 'i.ytimg.com' },
            { protocol: 'https', hostname: 'img.youtube.com' },
        ],
    },

    // Silence harmless hydration warnings from date-fns / next-auth
    reactStrictMode: true,

    // Suppress noisy build warnings for optional peer deps in mongoose
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            // mongoose optionally requires these but we don't need them
            'aws4': false,
            'mongodb-client-encryption': false,
            'snappy': false,
            'kerberos': false,
            '@mongodb-js/zstd': false,
            '@aws-sdk/credential-providers': false,
            'gcp-metadata': false,
            'socks': false,
        };
        return config;
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Content-Security-Policy', value: cspHeader },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
                ],
            },
        ];
    },
};

export default nextConfig;

