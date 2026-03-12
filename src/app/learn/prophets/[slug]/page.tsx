import Link from "next/link";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const PROPHETS: Record<string, {
    name: string;
    arabic: string;
    title: string;
    period: string;
    mentioned: string;
    color: string;
    heroVerseAr: string;
    heroVerseEn: string;
    heroVerseRef: string;
    intro: string;
    sections: { title: string; content: string; points?: string[] }[];
    lessons: string[];
}> = {
    "ibrahim-as": {
        name: "Ibrahim (AS)",
        arabic: "إبراهيم عليه السلام",
        title: "Khalilullah — The Friend of Allah",
        period: "~2000 BCE, Mesopotamia",
        mentioned: "69 times in the Quran",
        color: "from-primary to-emerald-800",
        heroVerseAr: "وَاتَّخَذَ اللَّهُ إِبْرَاهِيمَ خَلِيلًا",
        heroVerseEn: "And Allah took Ibrahim as an intimate friend.",
        heroVerseRef: "Quran 4:125",
        intro: "Ibrahim (AS) — known as Abraham in the Abrahamic religious tradition — is regarded as the patriarch of monotheism and is referred to in the Quran as a 'Hanif' (pure monotheist). He was born in a land of idol worshippers, yet through reason and revelation, he arrived at the absolute truth of Tawhid. His life is a timeless testament to unwavering faith, sacrifice, and complete submission to Allah.",
        sections: [
            {
                title: "Early Life: Questioning Idols",
                content: "Ibrahim (AS) grew up in ancient Mesopotamia (modern-day Iraq), in the city of Ur. His father, Azar, was an idol maker and worshipper. From a young age, Ibrahim questioned the logic of worshipping idols carved by human hands.\n\nThrough observation of the stars, the moon, and the sun — and their setting each day — Ibrahim concluded: 'I do not love things that set.' He arrived, through pure intellect and divine guidance, at the worship of the One who does not set: Allah.",
            },
            {
                title: "Confronting the Tyrant Nimrod",
                content: "Ibrahim (AS) openly challenged the polytheism of his society and the authority of the King Nimrod, who claimed divinity. When Nimrod asked Ibrahim to describe his God, Ibrahim said: 'My Lord is He who gives life and causes death.' Nimrod said he could do the same. Ibrahim then said: 'Indeed, Allah causes the sun to rise from the east; so cause it to rise from the west.' Nimrod was confounded.",
            },
            {
                title: "Trial by Fire",
                content: "When Ibrahim (AS) destroyed the idols of his people (sparing the largest to make a point), the people were enraged. They sentenced him to be cast into a great fire. But Allah commanded: 'O fire, be coolness and safety upon Ibrahim.' (21:69)\n\nThe fire did not harm him. This miracle demonstrated that nothing can harm the one whom Allah protects, and that the fires of this world are nothing compared to the fire of the Hereafter.",
            },
            {
                title: "The Ultimate Sacrifice: Ismail",
                content: "Ibrahim (AS) was given one of the most severe trials any parent could face. He saw in a dream that he was sacrificing his beloved son Ismail (AS). Recognizing this as a divine command, both father and son submitted. As the knife was brought to Ismail's throat, Allah called out: 'O Ibrahim! You have fulfilled the vision. Indeed, We thus reward the doers of good.' (37:104-105)\n\nA ram was substituted for Ismail. This sacrifice is commemorated annually by Muslims worldwide during Eid al-Adha.",
            },
            {
                title: "Building the Kaaba",
                content: "Ibrahim (AS) and his son Ismail (AS) built the Kaaba in Makkah — the sacred House of Allah toward which 1.8 billion Muslims pray every day. As they laid the foundations, they made a supplication: 'Our Lord, accept from us. Indeed You are the Hearing, the Knowing.' (2:127)\n\nIbrahim also called humanity to Hajj: 'Proclaim to the people the Hajj; they will come to you on foot and on every lean camel; they will come from every distant pass.' (22:27)",
            },
        ],
        lessons: [
            "Unwavering faith in the face of societal pressure and persecution",
            "Using reason and intellect to arrive at the truth of monotheism",
            "Complete submission to Allah — even in the hardest of trials",
            "The importance of raising children with tawhid and righteousness",
            "That Allah's help is with the patient and sincere believer",
        ],
    },
    "musa-as": {
        name: "Musa (AS)",
        arabic: "موسى عليه السلام",
        title: "Kalimullah — The One Who Spoke to Allah",
        period: "~1300 BCE, Egypt",
        mentioned: "136 times in the Quran",
        color: "from-blue-700 to-indigo-800",
        heroVerseAr: "وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا",
        heroVerseEn: "And Allah spoke to Musa with direct speech.",
        heroVerseRef: "Quran 4:164",
        intro: "Musa (AS) — Moses — is the most mentioned prophet in the Quran, appearing in over 30 surahs. His story is one of dramatic miracles, steadfast faith, and the liberation of an entire people from oppression. He was the receiver of the Tawrah (Torah) and led the Children of Israel out of Egyptian bondage. His story contains timeless lessons about justice, patience, trust in Allah, and the consequences of arrogance and tyranny.",
        sections: [
            {
                title: "Birth and Early Life in Pharaoh's Palace",
                content: "Pharaoh had decreed that all male infants born to the Israelites be killed, fearing a prophecy that a child of Israel would overthrow him. But Allah commanded Musa's mother: 'Cast him into the river, and do not fear and do not grieve.' (28:7)\n\nIn an extraordinary twist of divine planning, the basket carrying baby Musa was found by none other than Pharaoh's wife, who convinced Pharaoh to spare the child. Musa was raised in the very palace of the tyrant who sought to kill him.",
            },
            {
                title: "The Burning Bush: The First Revelation",
                content: "After accidentally killing an Egyptian and fleeing to Madyan, where he lived for years and married Shu'ayb's (AS) daughter, Musa was traveling when he saw a fire in the distance. When he approached it, Allah called to him: 'O Musa, Indeed, I am your Lord, so remove your sandals. Indeed, you are in the sacred valley of Tuwa.' (20:11-12)\n\nThis was Musa's first divine communication — and his appointment as a Prophet.",
            },
            {
                title: "Confronting Pharaoh",
                content: "Allah sent Musa and his brother Harun (AS) to Pharaoh with the message: 'Let the Children of Israel go.' Pharaoh was arrogant and refused. Nine miraculous signs were sent — the staff turning into a serpent, the white hand, years of drought, locusts, lice, frogs, blood in the Nile, and more — but Pharaoh refused each time.\n\nPhraoh declared himself god, saying 'I am your Lord Most High.' (79:24). His arrogance was the ultimate example of the sin of shirk and oppression.",
            },
            {
                title: "The Parting of the Sea",
                content: "When Pharaoh's army finally pursued the Children of Israel to the Red Sea, the people cried out in fear. Musa replied: 'No! Indeed, with me is my Lord; He will guide me.' (26:62)\n\nAllah commanded Musa to strike the sea with his staff. The sea parted into twelve dry pathways. The Israelites crossed safely. Pharaoh and his army followed and were drowned. This miracle is one of the greatest in human history, still commemorated by Muslim fasting on the Day of Ashura.",
            },
            {
                title: "The Torah and Mount Sinai",
                content: "After the crossing, Allah appointed Musa to come to Mount Tur (Sinai) for 30 nights (extended to 40) where he received the Torah. When Musa asked to see Allah directly, Allah caused part of the mountain to crumble with His manifestation, and Musa fell unconscious. Upon waking he said: 'Exalted are You; I have repented to You, and I am the first of the believers.' (7:143)",
            },
        ],
        lessons: [
            "Allah's plan encompasses every detail — even a baby in a basket on a river",
            "Speaking the truth to power, no matter how great the oppressor",
            "Patience in the face of repeated rejection and hardship",
            "That miracles are signs for those willing to believe",
            "Tawakkul (reliance on Allah) even when there seems to be no way out",
        ],
    },
    "isa-as": {
        name: "Isa (AS)",
        arabic: "عيسى عليه السلام",
        title: "Ruhullah — A Spirit from Allah",
        period: "~1st century CE, Palestine",
        mentioned: "25 times in the Quran",
        color: "from-indigo-600 to-purple-700",
        heroVerseAr: "إِنَّمَا الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ رَسُولُ اللَّهِ وَكَلِمَتُهُ",
        heroVerseEn: "The Messiah, Isa son of Maryam, was but a Messenger of Allah and His word.",
        heroVerseRef: "Quran 4:171",
        intro: "Isa (AS) — known as Jesus — holds a unique and honored place in Islam. Muslims love, honor, and believe in him as one of the greatest messengers of Allah. Islam rejects the trinity and divinity attributed to him by later traditions, but affirms his miraculous birth, his prophethood, his miracles, and his second coming before the Day of Judgment. The Quran dedicates an entire surah (Maryam) to his mother and his birth.",
        sections: [
            {
                title: "The Miraculous Birth",
                content: "Maryam (Mary) was a pious, devoted woman who lived in the temple. The Angel Jibril appeared to her in human form and announced that she would conceive a child through the breath of Allah — without any father.\n\n'She said, My Lord, how will I have a child when no man has touched me? He said, Such is Allah; He creates what He wills. When He decrees a matter, He only says to it, Be, and it is.' (3:47)\n\nIsa (AS) is called 'Kalimatullah' — the Word of Allah — because he came into existence through Allah's direct command.",
            },
            {
                title: "Miracles by Allah's Permission",
                content: "Isa (AS) performed extraordinary miracles, all with the explicit permission of Allah:",
                points: [
                    "Spoke as a newborn infant in the cradle to defend his mother's honor",
                    "Created the form of a bird from clay and breathed life into it",
                    "Healed the blind and the leper",
                    "Raised the dead back to life",
                    "Brought down a table spread of food from the heavens (Al-Ma'idah)",
                    "Knew what people hid in their homes",
                ],
            },
            {
                title: "His Message: Tawhid",
                content: "Isa (AS) called his people — the Children of Israel — back to the pure monotheism of Ibrahim (AS) and Musa (AS). He said: 'Indeed, Allah is my Lord and your Lord, so worship Him. That is the straight path.' (3:51)\n\nHe foretold the coming of a final prophet after him: 'O Children of Israel, indeed I am the Messenger of Allah to you, confirming what came before me of the Torah, and bringing good tidings of a messenger to come after me whose name is Ahmad.' (61:6)",
            },
            {
                title: "Was He Crucified? The Islamic View",
                content: "Islam is clear: Isa (AS) was not crucified. Allah raised him to the heavens before the crucifixion could take place. Another was made to resemble him. 'And they did not kill him, nor did they crucify him; but it was made to appear so to them.' (4:157)\n\nIsa (AS) is alive in the heavens and will return before the Day of Judgment as a just ruler. He will pray behind the Imam of the Muslims, break the cross (cancelling his false deification), kill the Dajjal (False Messiah), and establish justice on earth.",
            },
        ],
        lessons: [
            "Allah can create from nothing — the creation of Isa (AS) without a father is proof",
            "Miracles are never performed to show off, but only by Allah's command to guide people to truth",
            "The message of all prophets is the same: worship Allah alone",
            "Honor and love for Isa (AS) is part of Islamic faith",
            "The second coming of Isa (AS) gives hope for ultimate justice in the world",
        ],
    },
    "yusuf-as": {
        name: "Yusuf (AS)",
        arabic: "يوسف عليه السلام",
        title: "The Embodiment of Sabr (Patience)",
        period: "~1700 BCE, Canaan and Egypt",
        mentioned: "Entire Surah 12 dedicated to his story",
        color: "from-violet-600 to-purple-600",
        heroVerseAr: "لَقَدْ كَانَ فِي يُوسُفَ وَإِخْوَتِهِ آيَاتٌ لِّلسَّائِلِينَ",
        heroVerseEn: "There were certainly in the story of Yusuf and his brothers signs for those who ask.",
        heroVerseRef: "Quran 12:7",
        intro: "Surah Yusuf (Chapter 12) is called 'the best of stories' by Allah Himself — and with good reason. The story of Yusuf (AS) covers the full spectrum of human emotion: jealousy, betrayal, temptation, imprisonment, rise to power, forgiveness, and reunion. It is a masterclass in patience, integrity under pressure, and complete trust in Allah's plan even when life seems impossibly unfair.",
        sections: [
            {
                title: "The Dream and Jealous Brothers",
                content: "As a young boy, Yusuf (AS) told his father Yaqub (AS) that he had seen a dream: eleven stars, the sun, and the moon prostrating to him. Yaqub, a prophet himself, recognized this as divine and told Yusuf to share it with no one — lest his brothers' jealousy be provoked.\n\nHis brothers, already jealous of his father's special love for him, conspired to throw him into a well. 'Kill Yusuf or cast him to some land so that your father's attention will be only for you.' (12:9) — Such is the destructive power of jealousy.",
            },
            {
                title: "Slavery, Temptation, and Prison",
                content: "Yusuf (AS) was sold into slavery in Egypt and was bought by the Chief Minister (Aziz). Years later, the Aziz's wife — infatuated with Yusuf's exceptional beauty — attempted to seduce him. Yusuf refused, seeking refuge with Allah: 'He said, I seek the refuge of Allah. Indeed, He is my Lord.' (12:23)\n\nFalsely accused, Yusuf was imprisoned. In prison, he interpreted dreams for fellow inmates and continued to call people to the worship of Allah alone.",
            },
            {
                title: "Interpreting Pharaoh's Dream",
                content: "Years later, Pharaoh had a troubling dream no one could interpret: seven fat cows devoured by seven lean ones, seven green stalks and seven dry ones. Yusuf's fellow inmate, now a court official, remembered Yusuf's gift.\n\nYusuf (AS) interpreted the dream: seven years of abundance followed by seven years of severe famine. He then offered a plan to save Egypt. Pharaoh was amazed: 'Bring him to me.' But Yusuf, with dignity, first cleared his name before accepting release from prison.",
            },
            {
                title: "Rise to Power and the Ultimate Test",
                content: "Yusuf (AS) became the Chief Minister of Egypt, responsible for the entire treasury during the prophesied famine. When his brothers came from Canaan seeking food — not recognizing him — Yusuf recognized them but concealed his identity. Eventually, he revealed himself, and they expected punishment.\n\nBut Yusuf said: 'No blame will there be upon you today. Allah will forgive you; and He is the most merciful of the merciful.' (12:92) — It is one of the most beautiful moments of forgiveness in all of human literature.",
            },
        ],
        lessons: [
            "Sabr (patience) through betrayal, injustice and hardship leads to the greatest outcomes",
            "Chastity and moral integrity are worth protecting even at a personal cost",
            "Never despair of the mercy of Allah — every difficulty has a purpose",
            "True power is exercised with mercy, not vengeance",
            "Allah's plan unfolds perfectly — what seems like the worst day may be the beginning of His greatest gift",
        ],
    },
    "nuh-as": {
        name: "Nuh (AS)",
        arabic: "نوح عليه السلام",
        title: "The Patient Caller to His People",
        period: "Ancient times, Mesopotamia",
        mentioned: "43 times in the Quran",
        color: "from-teal-700 to-cyan-800",
        heroVerseAr: "إِنَّهُ كَانَ عَبْدًا شَكُورًا",
        heroVerseEn: "Indeed, he was a grateful servant.",
        heroVerseRef: "Quran 17:3",
        intro: "Nuh (AS) — Noah — was one of the earliest and most prominent prophets. He was sent to a people who had fallen deeply into polytheism and corruption. What makes his story uniquely powerful is the sheer duration of his mission — 950 years of calling his people to Allah, with only a small number accepting. His story is one of extraordinary patience, the inevitability of divine justice, and the mercy of Allah for those who believe.",
        sections: [
            {
                title: "950 Years of Da'wah",
                content: "Nuh (AS) called his people for an extraordinarily long time — 950 years. He used every method: private counsel, public preaching, day and night, appealing to intellect, to the signs of nature, to the heart. 'My Lord, indeed I invited my people to truth night and day.' (71:5)\n\nYet the leaders of his people blocked their ears and hearts. They mocked him. They taught their children to reject him. They covered themselves with their garments when he spoke. Only a small group believed.",
            },
            {
                title: "Building the Ark",
                content: "When Allah's decree came, He commanded Nuh (AS) to build a great ship — in a place far from any sea. Passersby mocked him constantly. 'And he constructed the ship, and whenever an assembly of the eminent of his people passed by him, they ridiculed him.' (11:38)\n\nNuh accepted their mockery with patience, saying: 'If you ridicule us, then we will ridicule you just as you ridicule.' (11:38) He continued building, trusting completely in Allah's command.",
            },
            {
                title: "The Great Flood",
                content: "When the time came, Allah commanded Nuh to board the Ark with the believers and pairs of all animals. 'And it sailed with them through waves like mountains.' (11:42)\n\nEven Nuh's own son refused to board, thinking he could find safety on a mountain. Nuh called to him: 'Come aboard with us and be not with the disbelievers.' But the son refused, and was drowned with the rest. Nuh cried out to Allah in grief for his son, and Allah reminded him that his son was not of his family in the spiritual sense — because he was an unbeliever.",
            },
            {
                title: "The Ark Rests and a New Beginning",
                content: "When the waters receded, the Ark came to rest on Mount Judi. Allah said: 'O Nuh, disembark in security from Us and blessings upon you and upon nations from those with you.' (11:48)\n\nFrom the small group of believers who survived, the earth was repopulated. Nuh (AS) is thus, after Adam (AS), a father figure to all of humanity. His patience and perseverance over a millennium-long mission stands as one of the greatest examples of servitude to Allah in all of human history.",
            },
        ],
        lessons: [
            "True da'wah (calling to Allah) requires extraordinary patience and persistence",
            "Family ties do not guarantee salvation — belief in Allah and righteous deeds are what matter",
            "Never lose hope in Allah's help, no matter how long the wait",
            "Divine justice is certain — no oppressor or rejecter escapes accountability",
            "A small community of sincere believers is better than a vast crowd of unbelievers",
        ],
    },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const p = PROPHETS[params.slug];
    if (!p) return { title: "Not Found" };
    return {
        title: `${p.name} | Prophet Stories | Learn Islam`,
        description: `${p.title} — ${p.period}`,
    };
}

export default function ProphetDetailPage({ params }: { params: { slug: string } }) {
    const p = PROPHETS[params.slug];
    if (!p) notFound();

    const prophetSlugs = Object.keys(PROPHETS);
    const currentIdx = prophetSlugs.indexOf(params.slug);
    const prev = currentIdx > 0 ? prophetSlugs[currentIdx - 1] : null;
    const next = currentIdx < prophetSlugs.length - 1 ? prophetSlugs[currentIdx + 1] : null;

    return (
        <div className="flex-grow bg-neutral-light/20 dark:bg-black/5">
            {/* Hero */}
            <div className={`relative bg-gradient-to-br ${p.color} overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="pp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="0.8" />
                                <circle cx="30" cy="30" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#pp)" />
                    </svg>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
                    <Link href="/learn#prophets" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Prophets
                    </Link>
                    <div className="text-center">
                        <p className="font-arabic text-3xl text-white/70 mb-2" dir="rtl">{p.arabic}</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{p.name}</h1>
                        <p className="text-white/70 text-lg mb-2">{p.title}</p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/50 mb-8">
                            <span>📅 {p.period}</span>
                            <span>•</span>
                            <span>📖 {p.mentioned}</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 max-w-2xl mx-auto">
                            <p className="font-arabic text-2xl text-white mb-3 leading-relaxed" dir="rtl">{p.heroVerseAr}</p>
                            <p className="text-white/80 text-sm italic mb-1">"{p.heroVerseEn}"</p>
                            <p className="text-white/50 text-xs">{p.heroVerseRef}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
                {/* Intro */}
                <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 p-6 md:p-8 shadow-sm">
                    <p className="text-neutral-dark/80 dark:text-neutral-light/80 text-lg leading-relaxed">{p.intro}</p>
                </div>

                {/* Story Sections */}
                {p.sections.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-dark rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
                        <div className="bg-primary/5 dark:bg-primary/10 px-6 py-4 border-b border-primary/10">
                            <h2 className="text-xl font-bold text-primary dark:text-primary-light">{s.title}</h2>
                        </div>
                        <div className="p-6 md:p-8 space-y-4">
                            <p className="text-neutral-dark/80 dark:text-neutral-light/80 leading-relaxed whitespace-pre-wrap">{s.content}</p>
                            {s.points && (
                                <ul className="space-y-2 mt-4">
                                    {s.points.map((pt, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-neutral-dark/80 dark:text-neutral-light/80">
                                            <Star className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}

                {/* Lessons */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl border border-primary/10 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-4">Lessons for Today</h2>
                    <ul className="space-y-3">
                        {p.lessons.map((lesson, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                                <p className="text-sm text-neutral-dark/80 dark:text-neutral-light/80">{lesson}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Prev/Next navigation */}
                <div className="flex items-center justify-between gap-4 pt-4">
                    {prev ? (
                        <Link href={`/learn/prophets/${prev}`} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-dark rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all text-sm font-semibold">
                            <ArrowLeft className="w-4 h-4 text-primary" />
                            <span>Previous Prophet</span>
                        </Link>
                    ) : <div />}
                    {next ? (
                        <Link href={`/learn/prophets/${next}`} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-dark rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all text-sm font-semibold">
                            <span>Next Prophet</span>
                            <ChevronRight className="w-4 h-4 text-primary" />
                        </Link>
                    ) : <div />}
                </div>

                <div className="text-center">
                    <Link href="/learn#prophets" className="text-sm text-primary dark:text-primary-light hover:underline font-medium">
                        ← All Prophet Stories
                    </Link>
                </div>
            </div>
        </div>
    );
}
