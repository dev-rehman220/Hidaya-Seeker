import Hero from "@/components/Hero";
import DailyAyah from "@/components/DailyAyah";
import DailyHadith from "@/components/DailyHadith";
import DailyDua from "@/components/DailyDua";
import DailyReminder from "@/components/DailyReminder";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Daily Islamic Guidance | Home",
    description: "Start your day with spiritual guidance. Read the daily Quran Ayah, Hadith from Sahih Bukhari and Muslim, and beautiful authentic Duas.",
};

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            <Hero />
            <DailyAyah />
            <DailyHadith />
            <DailyDua />
            <DailyReminder />
        </div>
    );
}
