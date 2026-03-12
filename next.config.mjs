/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow images from common external sources used in the app
    images: {
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
};

export default nextConfig;

