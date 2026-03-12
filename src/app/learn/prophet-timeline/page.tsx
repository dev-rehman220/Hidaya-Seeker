import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Life of Prophet Muhammad ﷺ — Full Timeline | Learn Islam",
    description: "A comprehensive chronological timeline of the life of Prophet Muhammad ﷺ — from birth to the completion of the religion.",
};

const events = [
    {
        year: "570 CE",
        hijri: "Pre-Islam",
        era: "Early Life",
        title: "Birth in Makkah",
        content: "Muhammad ﷺ was born in the city of Makkah into the noble Quraysh tribe, specifically the clan of Banu Hashim. His father Abdullah had died before his birth, and his mother Aminah raised him. He was born in what is known as the 'Year of the Elephant' — when Abraha led an army of elephants toward Makkah to destroy the Kaaba, but Allah sent flocks of birds that destroyed the army. The Prophet's blessed birth into this world was accompanied by propitious signs reported by his mother.",
    },
    {
        year: "576 CE",
        hijri: "Pre-Islam",
        era: "Early Life",
        title: "Death of His Mother, Aminah",
        content: "Muhammad ﷺ was sent to be nursed in the desert under the care of Halimah al-Sa'diyah, the Bedouin woman who noticed extraordinary blessings since taking him into her care. When he was returned to Makkah, his mother Aminah passed away during a journey to Madinah. He was just six years old. He was then raised by his grandfather Abd al-Muttalib, who loved him deeply.",
    },
    {
        year: "578 CE",
        hijri: "Pre-Islam",
        era: "Early Life",
        title: "Death of His Grandfather",
        content: "Abd al-Muttalib passed away when Muhammad ﷺ was eight years old. His uncle Abu Talib, though he never became Muslim, loved and protected him fiercely throughout his life. The young Muhammad ﷺ grew up known for his exceptional honesty, trustworthiness, and noble character — earning him the title 'Al-Amin' (The Trustworthy) among his people.",
    },
    {
        year: "595 CE",
        hijri: "Pre-Islam",
        era: "Pre-Prophethood",
        title: "Marriage to Khadijah (RA)",
        content: "Muhammad ﷺ, now 25 years old, had been working as a trader. His outstanding reputation for honesty and integrity came to the attention of Khadijah bint Khuwaylid, a wealthy and respected businesswoman. She proposed marriage to him through an intermediary. He accepted and their marriage, described by Allah's Messenger as one of the most blessed unions, lasted 25 years. She was 40 at the time. Khadijah became the first person to accept Islam and one of the greatest women in human history.",
    },
    {
        year: "610 CE",
        hijri: "Year 1 of Prophethood",
        era: "Revelation Begins",
        title: "First Revelation in Cave Hira",
        content: "At age 40, while in his customary retreat of prayer and meditation in Cave Hira on the Mountain of Light (Jabal al-Noor), the Angel Jibril appeared to Muhammad ﷺ and squeezed him three times, commanding: 'Read!' He replied: 'I do not know how to read.' Then Jibril recited the first verses ever revealed: 'Read in the name of your Lord who created — Created man from a clinging substance. Read, and your Lord is the most Generous — Who taught by the pen — Taught man that which he knew not.' (96:1-5). Shaken and trembling, the Prophet returned home to Khadijah saying 'Cover me!' She comforted him and took him to her cousin Waraqah ibn Nawfal, a learned Christian who recognized the angel as the same who came to Musa.",
    },
    {
        year: "613 CE",
        hijri: "Year 3 of Prophethood",
        era: "Makkah",
        title: "Public Call to Islam",
        content: "For the first three years, the call to Islam was private. Then the command came: 'And warn, O Muhammad, your closest kindred.' (26:214). He climbed Mount Safa and called the tribes of Quraysh together. He asked them: 'If I told you that an army was coming over this mountain, would you believe me?' They said yes, for he had never lied. He then called them to Islam. His uncle Abu Lahab cursed him — and a Surah was revealed about Abu Lahab's fate (Surah Al-Masad).",
    },
    {
        year: "615 CE",
        hijri: "Year 5 of Prophethood",
        era: "Makkah",
        title: "First Migration to Abyssinia",
        content: "The Quraysh's persecution of the early Muslims intensified. The Prophet ﷺ advised a group of followers to migrate to Abyssinia (Ethiopia), saying: 'There is a king there in whose land no one is treated unjustly.' The Christian King Negus sheltered the Muslims, moved by the recitation of Surah Maryam and the Islamic view of Isa (Jesus). This was the first hijrah in Islam.",
    },
    {
        year: "619 CE",
        hijri: "Year 9 of Prophethood",
        era: "Makkah",
        title: "Year of Grief — Deaths of Khadijah and Abu Talib",
        content: "In a single year, two of the Prophet's most beloved supports passed away. First his devoted wife Khadijah, then his protecting uncle Abu Talib. The Prophet ﷺ called it the 'Year of Grief' (Aam al-Huzn). With Abu Talib's death, the tribal protection he had afforded the Prophet was removed, making the situation in Makkah increasingly dangerous.",
    },
    {
        year: "619 CE",
        hijri: "Year 9 of Prophethood",
        era: "Makkah",
        title: "The Night Journey — Al-Isra wal-Mi'raj",
        content: "In one of the greatest miracles, Allah took the Prophet ﷺ on the Night Journey (Isra) from Makkah to Jerusalem in a single night, riding the heavenly creature Buraq. From there, he ascended through the seven heavens (Mi'raj), meeting the prophets at each level, until he reached the Lote Tree of the Utmost Boundary. Allah spoke to him directly and the five daily prayers were prescribed. Originally fifty, reduced to five through the intercession of Prophet Musa (AS) — yet with the reward of fifty prayers.",
    },
    {
        year: "622 CE",
        hijri: "Year 1 AH",
        era: "Madinah",
        title: "The Hijrah — Migration to Madinah",
        content: "The Quraysh plotted to assassinate the Prophet ﷺ. By divine command, he migrated to Madinah (then known as Yathrib) with his companion Abu Bakr al-Siddiq. They hid in the Cave of Thawr for three nights. This event — the Hijrah — is so significant that the Islamic calendar begins from this year. In Madinah, the Prophet was welcomed with joy; women and children chanted 'Tala'a al-Badru alayna' — The Full Moon has risen upon us.",
    },
    {
        year: "624 CE",
        hijri: "2 AH",
        era: "Madinah",
        title: "Battle of Badr — The Great Victory",
        content: "The first major military engagement between the Muslims and the Quraysh. 313 Muslims faced approximately 1000 Quraysh warriors. Defying all odds, the Muslims achieved a decisive victory, with 70 of the Quraysh killed. The Quran refers to this day as 'Yawm al-Furqan' — The Day of Criterion between truth and falsehood. This battle marked the consolidation of the Muslim state in Madinah.",
    },
    {
        year: "625 CE",
        hijri: "3 AH",
        era: "Madinah",
        title: "Battle of Uhud",
        content: "The Quraysh sought revenge for Badr and marched on Madinah with 3,000 fighters. Initially the Muslims were winning, but a group of archers abandoned their posts seeking war spoils — against the Prophet's explicit command. The Quraysh cavalry exploited this gap, turning the tide. 70 of the Prophet's companions were martyred, including the great Hamza ibn Abdul Muttalib. The Prophet himself was wounded. Yet the Quran turned this into a lesson about obedience and trust.",
    },
    {
        year: "628 CE",
        hijri: "6 AH",
        era: "Madinah",
        title: "Treaty of Hudaybiyyah",
        content: "The Prophet ﷺ led 1,400 Muslims toward Makkah for Umrah. The Quraysh blocked them at Hudaybiyyah. A treaty was signed — seemingly unfavorable to the Muslims, with a 10-year ceasefire. But Allah called it 'a manifest victory' (48:1). The treaty opened the door for widespread peaceful propagation of Islam. Within 2 years, more people entered Islam than in all preceding years combined.",
    },
    {
        year: "630 CE",
        hijri: "8 AH",
        era: "Makkah",
        title: "The Conquest of Makkah — Fath al-Makkah",
        content: "When the Quraysh violated the treaty, the Prophet ﷺ marched on Makkah with 10,000 Muslims. The city surrendered with minimal resistance. The Prophet entered Makkah humbly, on his camel, head bowed. He declared a general amnesty: 'Go — you are free.' The Kaaba was purified of its 360 idols. The Prophet cleansed the House that Ibrahim (AS) and Ismail (AS) had built for the worship of Allah alone.",
    },
    {
        year: "632 CE",
        hijri: "10 AH",
        era: "Final Days",
        title: "The Farewell Hajj and Sermon",
        content: "Over 100,000 Muslims performed Hajj with the Prophet ﷺ — his first and last. On the plain of Arafah, he delivered his Farewell Sermon: establishing the sanctity of life, property, and honor; declaring the equality of all races ('An Arab is no better than a non-Arab except in piety'); abolishing usury; and upholding the rights of women. The revelation came: 'This day I have perfected for you your religion.' (5:3). The Prophet wept, and those around him wept.",
    },
    {
        year: "632 CE",
        hijri: "10 AH",
        era: "Final Days",
        title: "The Prophet's Return to Allah ﷺ",
        content: "Three months after the Farewell Hajj, the Prophet ﷺ passed away in the room of his beloved wife Aishah (RA), with his head in her lap. His last words were: 'To the highest companion, to the highest companion.' He was 63 years old. The Muslim community was shattered. Umar ibn al-Khattab refused to believe he had died, saying he would cut off the hands of anyone who said so. Abu Bakr al-Siddiq calmly recited: 'Muhammad is no more than a messenger. Messengers have passed away before him...' (3:144). The greatest human being to walk this earth had returned to his Lord.",
    },
];

const eras = Array.from(new Set(events.map(e => e.era)));
const eraColors: Record<string, string> = {
    "Early Life": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Pre-Prophethood": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "Revelation Begins": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    "Makkah": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    "Madinah": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "Final Days": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function ProphetTimelinePage() {
    return (
        <div className="flex-grow bg-neutral-light/20 dark:bg-black/5">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-primary to-emerald-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="tp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="0.8" />
                                <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#tp)" />
                    </svg>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
                    <Link href="/learn#timeline" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Learn Islam
                    </Link>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Life of Prophet Muhammad ﷺ</h1>
                        <p className="font-arabic text-3xl text-yellow-300 mb-4" dir="rtl">السيرة النبوية الشريفة</p>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">A comprehensive chronological journey through the life of the final and greatest Messenger of Allah ﷺ</p>
                    </div>
                </div>
            </div>

            {/* Era Legend */}
            <div className="sticky top-16 z-10 bg-neutral-light/95 dark:bg-neutral-dark/95 backdrop-blur-sm border-b border-primary/10">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 flex flex-wrap gap-2">
                    {eras.map(era => (
                        <span key={era} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${eraColors[era] || "bg-gray-100 text-gray-700"}`}>{era}</span>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-primary/15 rounded-full" />

                    <div className="space-y-8">
                        {events.map((event, i) => (
                            <div key={i} className="relative pl-20 md:pl-28">
                                {/* Dot */}
                                <div className="absolute left-5 md:left-9 top-4 w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-neutral-dark shadow-md flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-secondary" />
                                </div>

                                <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-primary/5 dark:bg-primary/10 px-5 py-3 border-b border-primary/8 flex items-center justify-between flex-wrap gap-2">
                                        <h2 className="font-bold text-primary dark:text-primary-light">{event.title}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${eraColors[event.era] || "bg-gray-100 text-gray-700"}`}>
                                                {event.era}
                                            </span>
                                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary-dark dark:text-secondary-light">
                                                {event.year}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-sm text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed">{event.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center space-y-4">
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 p-6">
                        <p className="font-arabic text-2xl text-primary dark:text-primary-light mb-2" dir="rtl">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّد</p>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm italic">
                            "O Allah, send blessings upon Muhammad and upon the family of Muhammad."
                        </p>
                    </div>
                    <Link href="/learn#prophets" className="inline-flex items-center gap-2 text-primary dark:text-primary-light hover:underline text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Explore Prophet Stories
                    </Link>
                </div>
            </div>
        </div>
    );
}
