import { promises as fs } from "fs";
import path from "path";

export type DailyJsonType = "ayah" | "hadith" | "dua" | "reminder";

export interface DailyJsonItem {
  id: number;
  arabic?: string;
  english: string;
  translation?: string;
  reference?: string;
  subtitle?: string;
}

const DATA_FILE_BY_TYPE: Record<DailyJsonType, string> = {
  ayah: "daily-ayah.json",
  hadith: "daily-hadith.json",
  dua: "daily-dua.json",
  reminder: "daily-reminder.json",
};

function getDataFilePath(type: DailyJsonType): string {
  return path.join(process.cwd(), "src", "data", DATA_FILE_BY_TYPE[type]);
}

function getUtcDayNumber(date: Date = new Date()): number {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor(utcMidnight / 86400000);
}

function getDateIndex(totalItems: number, date: Date = new Date()): number {
  if (totalItems <= 0) {
    return 0;
  }

  return getUtcDayNumber(date) % totalItems;
}

export async function readDailyItems(type: DailyJsonType): Promise<DailyJsonItem[]> {
  const raw = await fs.readFile(getDataFilePath(type), "utf-8");
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));

  if (!Array.isArray(parsed)) {
    throw new Error(`Invalid JSON structure for ${type}: expected an array`);
  }

  return parsed as DailyJsonItem[];
}

export async function writeDailyItems(type: DailyJsonType, items: DailyJsonItem[]): Promise<void> {
  await fs.writeFile(getDataFilePath(type), `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

export async function getTodayDailyItem(type: DailyJsonType): Promise<DailyJsonItem & { type: DailyJsonType }> {
  return getDailyItemForDate(type);
}

export async function getDailyItemForDate(
  type: DailyJsonType,
  date: Date = new Date()
): Promise<DailyJsonItem & { type: DailyJsonType }> {
  const items = await readDailyItems(type);

  if (!items.length) {
    throw new Error(`No entries found for type: ${type}`);
  }

  const index = getDateIndex(items.length, date);
  return {
    type,
    ...items[index],
  };
}

export async function saveTodayDailyItem(
  type: DailyJsonType,
  payload: Omit<DailyJsonItem, "id">
): Promise<DailyJsonItem & { type: DailyJsonType }> {
  const items = await readDailyItems(type);

  if (!items.length) {
    throw new Error(`No entries found for type: ${type}`);
  }

  const index = getDateIndex(items.length);
  const current = items[index];

  const updated: DailyJsonItem = {
    id: current?.id ?? index + 1,
    arabic: payload.arabic ?? "",
    english: payload.english,
    translation: payload.translation ?? "",
    reference: payload.reference ?? "",
    subtitle: payload.subtitle ?? "",
  };

  items[index] = updated;
  await writeDailyItems(type, items);

  return {
    type,
    ...updated,
  };
}

export async function getDailyJsonEntryCount(): Promise<number> {
  const [ayahs, hadiths, duas, reminders] = await Promise.all([
    readDailyItems("ayah"),
    readDailyItems("hadith"),
    readDailyItems("dua"),
    readDailyItems("reminder"),
  ]);

  return ayahs.length + hadiths.length + duas.length + reminders.length;
}
