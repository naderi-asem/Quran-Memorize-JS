export default function getVerse(surah, verseID) {
    return getVerseData(surah, verseID);
}

function getVerseData(surah, verseID) {
    const [verse] = surah.verses.filter(v => v.id === verseID);
    return verse;
}