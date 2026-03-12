/**
 * Utility functions for fetching Islamic prayer times and Hijri dates
 * Uses the popular and free Aladhan API (http://aladhan.com)
 */

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface PrayerTimesData {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
}

export interface HijriDate {
    date: string;
    format: string;
    day: string;
    weekday: {
        en: string;
        ar: string;
    };
    month: {
        number: number;
        en: string;
        ar: string;
    };
    year: string;
    designation: {
        abbreviated: string;
        expanded: string;
    };
}

/**
 * Validates if the given coordinates are within valid ranges
 */
const isValidCoordinates = (coords: LocationCoordinates) => {
    return (
        coords.latitude >= -90 &&
        coords.latitude <= 90 &&
        coords.longitude >= -180 &&
        coords.longitude <= 180
    );
};

/**
 * Fetches prayer times for a specific date and location
 */
export async function getPrayerTimesByLocation(
    coords: LocationCoordinates,
    date: Date = new Date()
): Promise<{ timings: PrayerTimesData; hijri: HijriDate } | null> {
    if (!isValidCoordinates(coords)) {
        console.error('Invalid coordinates provided:', coords);
        return null;
    }

    const timestamp = Math.floor(date.getTime() / 1000);

    try {
        // Method 2 corresponds to ISNA (Islamic Society of North America)
        // You can make this configurable based on user preference
        const response = await fetch(
            `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=2`
        );

        if (!response.ok) {
            throw new Error(`Aladhan API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            timings: data.data.timings,
            hijri: data.data.date.hijri
        };
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

/**
 * Calculates the Qibla direction (bearing from true north) for given coordinates
 */
export function calculateQiblaDirection(coords: LocationCoordinates): number {
    // Coordinates of the Kaaba
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;

    // Convert to radians
    const lat1 = coords.latitude * (Math.PI / 180);
    const lng1 = coords.longitude * (Math.PI / 180);
    const lat2 = kaabaLat * (Math.PI / 180);
    const lng2 = kaabaLng * (Math.PI / 180);

    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = qiblaRad * (180 / Math.PI);

    // Normalize to 0-360
    return (qiblaDeg + 360) % 360;
}
