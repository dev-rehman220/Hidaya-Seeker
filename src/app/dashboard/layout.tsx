import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Dashboard | Bookmarks & Saved Items",
    description: "Access your personalized Islamic dashboard. View your saved Quran Ayahs, Hadiths, Duas, and Islamic learning articles.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
