export default function getSurah(quran, surahName) {
    return getSurahData(quran, surahName);
}

function getSurahData(quran, surahName) {
    const [surah] = quran.filter(s => s.name === surahName);
    return surah;
}