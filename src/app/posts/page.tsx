import { Newspaper } from "lucide-react";
import { Metadata } from "next";
import PostsClient from "./PostsClient";

export const metadata: Metadata = {
    title: "Posts & Videos | Islamic Daily Reminder",
    description: "Read articles and watch videos from the Islamic Daily Reminder team.",
};

export default function PostsPage() {
    return (
        <div className="flex-grow bg-neutral-light/30 dark:bg-black/10 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Newspaper className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light">
                        Posts & Videos
                    </h1>
                    <p className="text-lg text-neutral-dark/80 dark:text-neutral-light/80 max-w-2xl mx-auto">
                        Spiritual reminders, knowledge, and guidance from our team
                    </p>
                </div>

                <PostsClient />
            </div>
        </div>
    );
}
