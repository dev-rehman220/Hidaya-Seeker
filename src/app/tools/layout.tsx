import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Islamic Tools",
    description: "Use practical Islamic tools including Zakat calculator, prayer times, and Qibla direction.",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
