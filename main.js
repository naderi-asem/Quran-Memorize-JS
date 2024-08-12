import './style.css'
import getAllQuran from './src/components/getAllQuran.js';
import getSurah from './src/components/getSurah.js';
import getVerse from './src/components/getVerse.js';

const reload = document.querySelector('.reload-btn');
const start = document.querySelector('.start-btn');
const appDiv = document.querySelector('#app');
const verse_text = document.querySelector('.verse__text');
const nextBtn = document.querySelector(".ctrlBtn__next");
const prevBtn = document.querySelector(".ctrlBtn__prev");
const surahInfo = document.querySelector(".surahInfo");
const surahNamesTag = document.querySelector(".select_surah");
const submitUserBtn = document.querySelector(".submitBtn");
const verseRangeInput = document.querySelector(".verse-range");
const verseValueTag = document.querySelector(".range-value");

const PATH = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json";

let quran = await getAllQuran(PATH);

const surahNamesArray = allSurahNamesArray(quran);
const randomSurahName = createRandomSurahName(surahNamesArray);
let surah = getSurah(quran, randomSurahName);
let versId = createRandomVerseID(surah);
let verse = getVerse(surah, versId);

// random surah selection
function createRandomSurahName(surahNamesArray) {
    const randomSurah = surahNamesArray[Math.ceil(Math.random() * 113)].name;
    return randomSurah;
}

//random verse ID selection
function createRandomVerseID(surah) {
    const randomVerseID = Math.ceil(Math.random() * surah.verses.length);
    return randomVerseID;
}

console.log(quran);
console.log(surah);
console.log(verse);

window.onload = () => {

    selectSurahNames();
    start.addEventListener("click", () => {
        surah = getSurah(quran, createRandomSurahName(surahNamesArray));
        verse = getVerse(surah, createRandomVerseID(surah));
        startToShowVerse();
    })
    reload.addEventListener('click', () => location.reload());
    submitUserBtn.addEventListener("click", (e) => {
        e.preventDefault();
        startToShowVerse();
    });
}


/* surah names select handler ....................................*/

function selectSurahNames() {
    const surahNames = allSurahNamesArray(quran);
    // console.log("selection tag surah names : ", surahNames);
    for (let key in surahNames) {
        const optionTag = document.createElement("option");
        optionTag.value = surahNames[key].name;
        optionTag.textContent = surahNames[key].name + `__ ${quran[key].transliteration}`;
        surahNamesTag.insertAdjacentElement("beforeend", optionTag);
    }
};


/* execute next verse and surah .........................*/

function findNextVerse(surah) {
    const currentVerse = surah.verses.find(v => v.id === verse.id);
    const nextVerse = surah.verses.find(v => v.id === currentVerse.id + 1);
    return nextVerse;
}

function findNextSurah(quran) {
    const currentSurah = quran.find(s => s.id === surah.id);
    let nextSurah = quran.find(s => s.id === currentSurah.id + 1);
    if (currentSurah.id === 114) nextSurah = quran[0];
    return nextSurah;
}

function nextVerseHandler() {
    const nextVerse = findNextVerse(surah);
    const nextSurah = findNextSurah(quran);

    if (verse.id < surah.verses.length) {
        verse = nextVerse;
        verse_text.textContent = verse.text + ` ${verse.id}`;
    }
    else {
        surah = nextSurah;
        verse = surah.verses[0];
        verse_text.textContent = verse.text + ` ${verse.id}`;
    }
    SetSurahInfo();
}

nextBtn.addEventListener('click', nextVerseHandler);

/* execute previous verse and surah ..............................*/

function findPrevVerse(surah) {
    const currentVerse = surah.verses.find(v => v.id === verse.id);
    const prevVerse = surah.verses.find(v => v.id === currentVerse.id - 1);
    return prevVerse;
}

function findPrevSurah(quran) {
    const currentSurah = quran.find(s => s.id === surah.id);
    let prevSurah = quran.find(s => s.id === currentSurah.id - 1);
    if (currentSurah.id === 1) prevSurah = quran[113];
    return prevSurah;
}

function prevVerseHandler() {
    const prevVerse = findPrevVerse(surah);
    const prevSurah = findPrevSurah(quran);

    if (verse.id > 1) {
        verse = prevVerse;
        verse_text.textContent = verse.text + ` ${verse.id}`;
    }
    else {
        surah = prevSurah;
        verse = surah.verses[surah.verses.length - 1];
        verse_text.textContent = verse.text + ` ${verse.id}`;
    }
    SetSurahInfo();
}

prevBtn.addEventListener('click', prevVerseHandler);

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") prevVerseHandler();
    if (e.key === "ArrowRight") nextVerseHandler();
});


/* other functions ........................................*/

// start to show random or user selection verse
function startToShowVerse() {
    verseChosenByUser();
    console.log("start ....");
    appDiv.style.display = 'block';
    verse_text.textContent = verse.text + ` ${verse.id}`;
    SetSurahInfo();
    setRangeInputProperties(surah);
}

// set surah info in the header functions
function SetSurahInfo() {
    surahInfo.innerHTML = `<h4 class="surahInfo__name">name: ${surah.name}</h4>
          <h4 class="surahInfo__totalVerse">total verses: ${surah.total_verses}</h4>
          <h4 class="surahInfo__verseNumber">verse number: ${verse.id}</h4>`
}

// creating array of all surah names
function allSurahNamesArray(quran) {
    let allSurahNames = [];
    for (let key in quran) {
        const name = quran[key].name;
        const transliteration = quran[key].transliteration;
        allSurahNames = [...allSurahNames, { name, transliteration }];
    }
    // console.log("all surah names :", allSurahNames);
    console.log(allSurahNames);
    return allSurahNames;
}

// Getting the verse chosen by the user
function verseChosenByUser() {
    const userVerseInput = document.querySelector(".verse_num");
    const userSurahInput = document.querySelector(".select_surah");
    let userVerseNum = Number(userVerseInput.value);
    // console.log("user verse: ", userVerseNum);
    let userSurahName = userSurahInput.value;
    // console.log("user surah name : ", userSurahName);

    
    if (userSurahName && userVerseNum <= 0) {
        surah = getSurah(quran, userSurahInput.value);
        verse = getVerse(surah, Math.ceil(Math.random() * surah.verses.length));
    }
    
    if (userSurahName && userVerseNum > 0) {
        surah = getSurah(quran, userSurahName);
        verse = getVerse(surah, userVerseNum);
    }
    
    userVerseInput.max = `\\d{, ${surah.verses.length}}`;
    userVerseInput.value = "";
}


// set the value to range input tag

function setRangeInputProperties(surah) {
    const totalVerses = surah.total_verses;
    verseRangeInput.max = totalVerses;
    verseRangeInput.value = totalVerses;
    verseValueTag.textContent = totalVerses
}




