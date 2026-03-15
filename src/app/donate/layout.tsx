import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Donate",
    description: "Support Hidaya Seeker and help expand beneficial Islamic content.",
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
    return children;
}
