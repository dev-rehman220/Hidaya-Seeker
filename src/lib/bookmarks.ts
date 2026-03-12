/**
 * A simple bookmarking utility using localStorage for the frontend demo
 * In a full backend app, this would use an API to save to a database.
 */

export interface Bookmark {
    id: string; // Unique identifier (e.g., Ayah reference like "2:255")
    type: 'ayah' | 'article' | 'dua' | 'hadith';
    title: string;
    subtitle?: string;
    url: string;
}

const BOOKMARK_KEY = 'daily_reminder_bookmarks';

export function getBookmarks(): Bookmark[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(BOOKMARK_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading bookmarks:', error);
        return [];
    }
}

export function isBookmarked(id: string): boolean {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.id === id);
}

export function toggleBookmark(bookmark: Bookmark): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const bookmarks = getBookmarks();
        const isCurrentlyBookmarked = bookmarks.some(b => b.id === bookmark.id);

        let newBookmarks;
        if (isCurrentlyBookmarked) {
            newBookmarks = bookmarks.filter(b => b.id !== bookmark.id);
        } else {
            newBookmarks = [...bookmarks, bookmark];
        }

        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(newBookmarks));
        return !isCurrentlyBookmarked; // Returns new state (true if added, false if removed)
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return false;
    }
}
