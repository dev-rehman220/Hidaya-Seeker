import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://hidaya-seeker.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const routes = [
        "",
        "/learn",
        "/posts",
        "/tools",
        "/calendar",
        "/dashboard",
        "/donate",
        "/login",
        "/register",
        "/forgot-password",
        "/about",
        "/contact",
        "/privacy",
    ];

    return routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.7,
    }));
}
