import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Learn Islam | Core Beliefs & History",
    description: "Explore the beautiful teachings of Islam, the five pillars, articles of faith, the life of Prophet Muhammad (PBUH), and stories of the Prophets.",
};

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
