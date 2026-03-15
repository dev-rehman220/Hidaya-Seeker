import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your Hidaya Seeker account to save reminders and personalize your learning journey.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
