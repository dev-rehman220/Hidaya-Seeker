import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const TOPICS: Record<string, {
    title: string;
    arabicTitle: string;
    subtitle: string;
    color: string;
    heroVerse: { arabic: string; translation: string; reference: string };
    intro: string;
    sections: { title: string; content: string; points?: string[] }[];
    relatedTopics: { slug: string; title: string }[];
}> = {
    basics: {
        title: "Basics of Islam",
        arabicTitle: "أساسيات الإسلام",
        subtitle: "Understanding the foundation of the Islamic faith",
        color: "from-primary to-emerald-700",
        heroVerse: {
            arabic: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ",
            translation: "Indeed, the religion in the sight of Allah is Islam.",
            reference: "Quran 3:19",
        },
        intro: "Islam is not merely a religion in the conventional sense — it is a complete way of life (Deen). The word 'Islam' itself comes from the Arabic root S-L-M, meaning peace, submission, and surrender. A Muslim is one who surrenders their will to the Will of Allah (God), the One and Only Creator.",
        sections: [
            {
                title: "What is Islam?",
                content: "Islam is the monotheistic religion founded on the absolute oneness of Allah. It is the final, complete, and preserved revelation sent to all of humanity through the Prophet Muhammad ﷺ. Allah says in the Quran: 'This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion.' (5:3)\n\nIslam emerged from the same Abrahamic tradition as Judaism and Christianity, affirming the prophethood of Ibrahim, Musa, Isa and all other messengers, while maintaining that the Quran is the final, unchanged word of Allah.",
            },
            {
                title: "The Shahada — Declaration of Faith",
                content: "The entry point into Islam is the Shahada: لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ\n\n'There is no god but Allah, and Muhammad is the Messenger of Allah.'\n\nThis declaration has two parts:\n1. Testimony that there is no deity worthy of worship except Allah (Tawhid)\n2. Testimony that Muhammad ﷺ is His final messenger\n\nSaying this with sincere belief in one's heart is how a person enters Islam.",
            },
            {
                title: "Tawhid — The Oneness of Allah",
                content: "Tawhid is the core concept of Islam — the absolute and uncompromising belief in the Oneness of Allah. It has three dimensions:",
                points: [
                    "Tawhid al-Rububiyyah: Oneness of Lordship — Allah alone creates, sustains, and controls all things",
                    "Tawhid al-Uluhiyyah: Oneness of Worship — only Allah deserves to be worshipped",
                    "Tawhid al-Asma wa al-Sifat: Oneness of Names and Attributes — Allah's names and attributes are unique to Him",
                ],
            },
            {
                title: "Core Teachings of Islam",
                content: "Islam teaches that every human being is born pure (fitra), with a natural predisposition toward goodness and belief in the Creator. Key teachings include:",
                points: [
                    "Accountability: Every person is responsible for their deeds before Allah",
                    "Justice: Treating all people equitably regardless of race, gender, or status",
                    "Compassion: The Quran begins with Bismillah ir-Rahman ir-Rahim — In the name of Allah, the Most Gracious, the Most Merciful",
                    "Balance: Islam calls for balance (Wasatiyyah) in all aspects of life",
                    "Knowledge: Seeking knowledge is obligatory upon every Muslim (Ibn Majah)",
                ],
            },
            {
                title: "How to Become Muslim",
                content: "Accepting Islam requires sincere belief from the heart and the verbal declaration of the Shahada. There is no intermediary, clergy, or ritual required. A person simply needs to:\n\n1. Sincerely believe that Allah alone is the Creator and deserves worship\n2. Believe that Muhammad ﷺ is the final Prophet\n3. Pronounce the Shahada with sincere intention\n\nAfter accepting Islam, it is recommended to perform a full ritual bath (Ghusl), learn the basics of prayer (Salah), and connect with the local Muslim community.",
            },
        ],
        relatedTopics: [
            { slug: "pillars", title: "Five Pillars of Islam" },
            { slug: "faith", title: "Six Articles of Faith" },
        ],
    },
    pillars: {
        title: "Five Pillars of Islam",
        arabicTitle: "أركان الإسلام الخمسة",
        subtitle: "The five essential acts of worship that form the foundation of Muslim practice",
        color: "from-amber-600 to-yellow-500",
        heroVerse: {
            arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ",
            translation: "Islam has been built on five pillars.",
            reference: "Sahih al-Bukhari 8",
        },
        intro: "The Prophet Muhammad ﷺ said: 'Islam is built upon five pillars: testifying that there is no god worthy of worship except Allah and that Muhammad is the Messenger of Allah, performing the prayer, paying the Zakat, making the pilgrimage to the House, and fasting in Ramadan.' (Bukhari & Muslim). These five pillars are the practical framework around which every Muslim's life is structured.",
        sections: [
            {
                title: "1. Shahada — The Declaration of Faith",
                content: "لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ\n\nThe Shahada is the foundational pillar. It is not merely a statement — it is a commitment to living by the belief that Allah alone is worthy of worship and that the Prophet ﷺ is the perfect example to follow. Every other pillar flows from this declaration.",
            },
            {
                title: "2. Salah — The Five Daily Prayers",
                content: "Salah is the most regular act of worship, performed five times each day: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). Prayer is the direct connection between the servant and Allah — no intermediaries needed.\n\nAllah says: 'Recite what has been revealed to you of the Book, and establish prayer. Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.' (29:45)\n\nPrayer involves physical positions (standing, bowing, prostrating) and specific recitations, combining mind, body and soul in worship.",
            },
            {
                title: "3. Zakat — Obligatory Charity",
                content: "Zakat is the mandatory almsgiving — 2.5% of accumulated wealth above a minimum threshold (nisab) paid annually to those in need. It is not voluntary charity; it is a right of the poor over the wealthy.\n\nZakat purifies wealth and the soul, reduces inequality, and fosters social solidarity. The Quran frequently pairs Salah and Zakat together, indicating the inseparable relationship between worship of Allah and service to others.",
                points: [
                    "Nisab: The minimum amount of wealth before Zakat becomes obligatory",
                    "Rate: 2.5% of savings held for one lunar year",
                    "Recipients: Eight categories including the poor, debt-burdened, and travellers in need (Quran 9:60)",
                ],
            },
            {
                title: "4. Sawm — Fasting in Ramadan",
                content: "Every year during the month of Ramadan, Muslims fast from Fajr (dawn) to Maghrib (sunset) — abstaining from food, drink, and marital relations. Ramadan is the month in which the Quran was first revealed.\n\nThe Prophet ﷺ said: 'Whoever fasts Ramadan with faith and seeking reward, his previous sins will be forgiven.' (Bukhari). Fasting is a means of developing Taqwa (God-consciousness), gratitude, and empathy for those who go without.",
            },
            {
                title: "5. Hajj — Pilgrimage to Makkah",
                content: "Hajj is the annual pilgrimage to the Sacred Mosque in Makkah, obligatory once in a lifetime for every Muslim who is physically and financially able. It takes place during the first ten days of Dhul Hijjah.\n\nHajj commemorates the legacy of Ibrahim (AS), Hajar, and Ismail (AS). It is the largest annual gathering of people on Earth — a powerful demonstration of the equality and unity of all Muslims regardless of race, nationality, or wealth. Everyone wears the same simple white garments (ihram).",
            },
        ],
        relatedTopics: [
            { slug: "basics", title: "Basics of Islam" },
            { slug: "faith", title: "Six Articles of Faith" },
        ],
    },
    faith: {
        title: "Six Articles of Faith",
        arabicTitle: "أركان الإيمان الستة",
        subtitle: "The core beliefs every Muslim must hold in their heart",
        color: "from-rose-600 to-red-500",
        heroVerse: {
            arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ",
            translation: "The Messenger has believed in what was revealed to him from his Lord, and so have the believers.",
            reference: "Quran 2:285",
        },
        intro: "The Angel Jibril (Gabriel) once approached the Prophet ﷺ in human form and asked about Iman (faith). The Prophet ﷺ replied: 'Iman is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine decree (Qadar) — both the good and the bad of it.' (Muslim). These six articles form the intellectual and spiritual core of Islamic belief.",
        sections: [
            {
                title: "1. Belief in Allah",
                content: "The first and most fundamental article is belief in Allah — the One, the Unique, the Self-Sufficient Creator of all existence. This encompasses Tawhid: Allah has no partners, no children, no equals. He is Al-Hayy (the Ever-Living), Al-Qayyum (the Self-Sustaining), Al-'Alim (the All-Knowing), Al-Qadir (the All-Powerful).\n\nAllah has 99 Beautiful Names (Asma ul-Husna), each revealing an aspect of His divine attributes. The Quran says: 'He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.' (59:22)",
            },
            {
                title: "2. Belief in Angels",
                content: "Muslims believe in the angels (Mala'ika) — beings created from light who worship Allah without ceasing and carry out His commands. They have no free will and do not sin.\n\nAmong the greatest angels are:\n• Jibril (Gabriel): Conveyor of divine revelation to the Prophets\n• Mikail (Michael): Responsible for rain and provision\n• Israfil: Will blow the trumpet on the Day of Judgment\n• Izrail (Malak al-Mawt): The Angel of Death\n\nEvery person has two guardian angels recording their deeds (Kiraman Katibin).",
            },
            {
                title: "3. Belief in Divine Books",
                content: "Allah sent revealed scriptures to guide humanity at different times:",
                points: [
                    "Suhuf: Scrolls sent to Ibrahim (AS) and Musa (AS)",
                    "Tawrah (Torah): Revealed to Musa (AS) / Moses",
                    "Zabur (Psalms): Revealed to Dawud (AS) / David",
                    "Injeel (Gospel): Revealed in its original form to Isa (AS) / Jesus",
                    "Al-Quran: The final, complete, and perfectly preserved revelation to Muhammad ﷺ",
                ],
            },
            {
                title: "4. Belief in Prophets and Messengers",
                content: "Muslims believe in all prophets and messengers sent by Allah, from Adam (AS) to the final prophet Muhammad ﷺ. The Quran mentions 25 prophets by name, though Islamic tradition holds there were 124,000 total.\n\nAll prophets shared the same core message: worship Allah alone, avoid shirk (associating partners with Allah), and live according to His guidance. We must believe in all of them without distinction. The Prophet Muhammad ﷺ is the Seal of the Prophets — there will be no prophet after him.",
            },
            {
                title: "5. Belief in the Day of Judgment",
                content: "Yawm al-Qiyamah (the Day of Resurrection and Judgment) is a certainty that every soul will face. On that day, all of creation will be resurrected, and every person will be held fully accountable for their deeds.\n\nThe scales of justice (Mizan) will weigh every action, no matter how small. Some will enter Jannah (Paradise) — a state of eternal bliss beyond imagination. Others will face Jahannam (Hellfire). The belief in accountability gives weight to every choice a Muslim makes in this life.",
            },
            {
                title: "6. Belief in Divine Decree (Al-Qadar)",
                content: "Al-Qadar means to believe that Allah, in His infinite wisdom, has preordained all things. Nothing happens except by His knowledge and will. This does not negate human free will — people make genuine choices, and those choices matter.\n\nBelieving in Qadar brings profound peace: knowing that whatever befalls you was written, and that from hardship comes wisdom. The Prophet ﷺ said: 'Wondrous is the affair of the believer — everything is good for him. If good comes to him he is grateful, and if harm comes he is patient — and that is good for him.' (Muslim)",
            },
        ],
        relatedTopics: [
            { slug: "basics", title: "Basics of Islam" },
            { slug: "pillars", title: "Five Pillars of Islam" },
        ],
    },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const topic = TOPICS[params.slug];
    if (!topic) return { title: "Not Found" };
    return {
        title: `${topic.title} | Learn Islam`,
        description: topic.subtitle,
    };
}

export default function TopicDetailPage({ params }: { params: { slug: string } }) {
    const topic = TOPICS[params.slug];
    if (!topic) notFound();

    return (
        <div className="flex-grow bg-neutral-light/20 dark:bg-black/5">
            {/* Hero */}
            <div className={`relative bg-gradient-to-br ${topic.color} overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="tp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="0.8" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#tp)" />
                    </svg>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
                    <Link href="/learn" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Learn Islam
                    </Link>
                    <div className="text-center">
                        <p className="font-arabic text-3xl text-white/60 mb-3" dir="rtl">{topic.arabicTitle}</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{topic.title}</h1>
                        <p className="text-white/70 text-lg mb-8">{topic.subtitle}</p>
                        {/* Hero Verse */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 max-w-2xl mx-auto">
                            <p className="font-arabic text-2xl text-white mb-3 leading-relaxed" dir="rtl">{topic.heroVerse.arabic}</p>
                            <p className="text-white/80 text-sm italic mb-1">"{topic.heroVerse.translation}"</p>
                            <p className="text-white/50 text-xs">{topic.heroVerse.reference}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
                {/* Introduction */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 p-6 md:p-8 shadow-sm">
                    <p className="text-neutral-dark/80 dark:text-neutral-light/80 text-lg leading-relaxed">{topic.intro}</p>
                </div>

                {/* Sections */}
                {topic.sections.map((section, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
                        <div className="bg-primary/5 dark:bg-primary/10 px-6 py-4 border-b border-primary/10">
                            <h2 className="text-xl font-bold text-primary dark:text-primary-light">{section.title}</h2>
                        </div>
                        <div className="p-6 md:p-8 space-y-4">
                            <p className="text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                            {section.points && (
                                <ul className="space-y-2 mt-4">
                                    {section.points.map((point, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-neutral-dark/80 dark:text-neutral-light/80">
                                            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}

                {/* Related Topics */}
                <div className="pt-4">
                    <h3 className="text-lg font-bold text-primary dark:text-primary-light mb-4">Continue Learning</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {topic.relatedTopics.map(({ slug, title }) => (
                            <Link key={slug} href={`/learn/topics/${slug}`} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-dark rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all group">
                                <span className="font-semibold text-sm">{title}</span>
                                <ChevronRight className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                        <Link href="/learn" className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all group">
                            <span className="font-semibold text-sm text-primary dark:text-primary-light">← Back to All Topics</span>
                            <ArrowLeft className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-all" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
