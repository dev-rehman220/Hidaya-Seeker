import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Islamic Calendar",
    description: "View key Islamic dates and calendar guidance.",
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return children;
}
