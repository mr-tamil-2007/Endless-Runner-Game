
"use strict";

// ==========================================
// MY DEAR JERRY ❤️
// ==========================================

const SECRET_CODE = "iruag";

const messages = [
    "ജെറി, എനിക്ക് നിന്നെ ഇഷ്ടമാണ്! ❤️",
    "ജെറി, നിങ്ങൾ വളരെ സുന്ദരിയാണ്! 🌸",
    "നിങ്ങളുടെ പുഞ്ചിരി വളരെ മനോഹരമാണ്! 💗",
    "നിങ്ങൾ എനിക്ക് വളരെ പ്രിയപ്പെട്ടവരാണ്! 🌹",
    "ജെറി, നിങ്ങൾ വളരെ സ്പെഷ്യലാണ്! 💝"
];

const tomMessage = "ജെറി, ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു! ❤️";
const finalMalayalamMessage =
    "എന്റെ വെബ്സൈറ്റ് സന്ദർശിച്ചതിന് നന്ദി, ജെറി.";

const welcome = document.getElementById("welcome");
const surprise = document.getElementById("surprise");
const secretCode = document.getElementById("secretCode");
const enterButton = document.getElementById("enterButton");
const errorMessage = document.getElementById("error");

const tom = document.getElementById("tom");
const tomCaption = document.getElementById("tomCaption");
const repeatVoice = document.getElementById("repeatVoice");

const giftLayer = document.getElementById("giftLayer");
const giftCount = document.getElementById("giftCount");
const finalArea = document.getElementById("finalArea");
const bigGift = document.getElementById("bigGift");
const finalText = document.getElementById("finalMessage");

const flowerLayer = document.getElementById("flowerLayer");
const effectLayer = document.getElementById("effectLayer");
const closingScreen = document.getElementById("closingScreen");

let openedGifts = 0;
let websiteStarted = false;
let finalGiftOpened = false;
let audioContext = null;
let flowerTimer = null;

// ==========================================
// MALE VOICE SELECTION
// ==========================================

// Browsers do not expose a reliable gender property for voices.
// This searches voice names for likely male voices first.

function getMaleVoice(language) {
    const voices = window.speechSynthesis.getVoices();

    const matchingLanguage = voices.filter(voice =>
        voice.lang.toLowerCase().startsWith(language.toLowerCase())
    );

    const maleHints = [
        "male",
        "man",
        "masculine",
        "ravi",
        "arjun",
        "kiran",
        "rahul",
        "hari",
        "vijay"
    ];

    const maleVoice = matchingLanguage.find(voice => {
        const name = voice.name.toLowerCase();
        return maleHints.some(hint => name.includes(hint));
    });

    return maleVoice || matchingLanguage[0] || null;
}

// ==========================================
// SPEECH
// ==========================================

function speakText(message, language = "ml-IN") {
    if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis is not supported.");
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = language;

    // Lower pitch for a deeper-sounding voice.
    // This does not turn a female voice into a real male voice.
    speech.rate = 0.88;
    speech.pitch = 0.72;
    speech.volume = 1;

    const selectedVoice = getMaleVoice(language);

    if (selectedVoice) {
        speech.voice = selectedVoice;
    }

    window.speechSynthesis.speak(speech);
}

// Load voices when browser makes them available.
if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

// ==========================================
// SOUND EFFECTS
// ==========================================

function playEffect(frequency = 600, duration = 0.18) {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(80, frequency / 2),
            audioContext.currentTime + duration
        );

        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.16,
            audioContext.currentTime + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.warn("Sound effect unavailable:", error);
    }
}

// ==========================================
// LOGIN
// ==========================================

enterButton.addEventListener("click", openSurprise);

secretCode.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        openSurprise();
    }
});

function openSurprise() {
    if (websiteStarted) return;

    if (secretCode.value.trim() !== SECRET_CODE) {
        errorMessage.textContent = "Wrong password! Try again ❤️";
        playEffect(180, 0.15);
        return;
    }

    websiteStarted = true;
    errorMessage.textContent = "";

    playEffect(500, 0.25);

    welcome.classList.add("hidden");
    surprise.classList.remove("hidden");

    startParticles();

    setTimeout(() => {
        tom.classList.add("tom-enter");
        tomCaption.classList.add("show");

        playEffect(700, 0.3);
        speakText(tomMessage, "ml-IN");
    }, 450);

    setTimeout(() => {
        tom.style.transition =
            "opacity 1.2s ease, transform 1.2s ease";

        tom.style.opacity = "0";
        tom.style.transform = "translateX(110vw)";

        tomCaption.style.transition = "opacity 1s ease";
        tomCaption.style.opacity = "0";

        repeatVoice.classList.add("hidden");
    }, 6000);

    setTimeout(createFiveGifts, 1800);
}

repeatVoice.addEventListener("click", () => {
    speakText(tomMessage, "ml-IN");
});

// ==========================================
// BACKGROUND PARTICLES
// ==========================================

function startParticles() {
    const particleLayer = document.getElementById("particles");

    for (let i = 0; i < 55; i++) {
        const particle = document.createElement("div");

        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration =
            (5 + Math.random() * 8) + "s";

        particle.style.animationDelay =
            (Math.random() * 5) + "s";

        particleLayer.appendChild(particle);
    }
}

// ==========================================
// FIVE GIFTS
// ==========================================

function createFiveGifts() {
    const positions = [
        { left: "10%", top: "22%" },
        { left: "72%", top: "20%" },
        { left: "43%", top: "42%" },
        { left: "16%", top: "66%" },
        { left: "76%", top: "65%" }
    ];

    positions.forEach((position, index) => {
        const gift = document.createElement("button");

        gift.type = "button";
        gift.className = "small-gift";
        gift.setAttribute("aria-label", `Open gift ${index + 1}`);
        gift.innerHTML = "<span>🎁</span>";

        gift.style.left = position.left;
        gift.style.top = position.top;
        gift.style.animationDelay = (index * 0.2) + "s";

        gift.addEventListener("click", () => {
            openSmallGift(gift, index);
        }, { once: true });

        giftLayer.appendChild(gift);
    });
}

// ==========================================
// OPEN SMALL GIFT
// ==========================================

function openSmallGift(gift, index) {
    if (gift.classList.contains("opened")) return;

    gift.classList.add("opened");
    openedGifts++;

    giftCount.textContent = `Opened: ${openedGifts} / 5`;

    const rect = gift.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    createHeartBurst(centerX, centerY, 20);
    createEnergyRing(centerX, centerY);

    playEffect(650 + index * 90, 0.25);

    showGiftMessage(messages[index]);
    speakText(messages[index], "ml-IN");

    setTimeout(() => gift.remove(), 450);

    if (openedGifts === 5) {
        setTimeout(showFinalGift, 2200);
    }
}

// ==========================================
// MESSAGE POPUP
// ==========================================

function showGiftMessage(message) {
    const oldMessage = document.querySelector(".gift-message");

    if (oldMessage) oldMessage.remove();

    const popup = document.createElement("div");

    popup.className = "gift-message";
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transition = "opacity .4s ease";
        popup.style.opacity = "0";

        setTimeout(() => popup.remove(), 450);
    }, 2000);
}

// ==========================================
// HEART BURST
// ==========================================

function createHeartBurst(x, y, amount = 20) {
    const heartSymbols = [
        "❤️", "💖", "💕", "💗", "💘", "💝"
    ];

    for (let i = 0; i < amount; i++) {
        const heart = document.createElement("span");

        heart.className = "heart-particle";

        heart.textContent =
            heartSymbols[
                Math.floor(Math.random() * heartSymbols.length)
            ];

        heart.style.left = x + "px";
        heart.style.top = y + "px";

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 170;

        heart.style.setProperty(
            "--move-x",
            Math.cos(angle) * distance + "px"
        );

        heart.style.setProperty(
            "--move-y",
            Math.sin(angle) * distance + "px"
        );

        heart.style.fontSize =
            (17 + Math.random() * 23) + "px";

        effectLayer.appendChild(heart);

        setTimeout(() => heart.remove(), 1300);
    }
}

// ==========================================
// ENERGY RING
// ==========================================

function createEnergyRing(x, y) {
    const ring = document.createElement("div");

    ring.className = "flash-ring";
    ring.style.left = x + "px";
    ring.style.top = y + "px";

    effectLayer.appendChild(ring);

    setTimeout(() => ring.remove(), 900);
}

// ==========================================
// FINAL BIG GIFT
// ==========================================

function showFinalGift() {
    giftLayer.innerHTML = "";

    finalArea.classList.remove("hidden");
    bigGift.classList.add("big-gift-enter");

    finalArea.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    startFlowers();
    playEffect(850, 0.5);

    finalText.textContent = "Your biggest surprise is waiting! ❤️";
}

// ==========================================
// FLOWER RAIN
// ==========================================

function startFlowers() {
    if (flowerTimer) return;

    const flowerEmojis = [
        "🌸", "🌹", "🌺", "🌷", "💮", "🌼"
    ];

    flowerTimer = setInterval(() => {
        const flower = document.createElement("div");

        flower.className = "flower";

        flower.textContent =
            flowerEmojis[
                Math.floor(Math.random() * flowerEmojis.length)
            ];

        flower.style.left = Math.random() * 100 + "vw";
        flower.style.fontSize =
            (18 + Math.random() * 25) + "px";

        const duration = 4 + Math.random() * 4;

        flower.style.animationDuration = duration + "s";
        flowerLayer.appendChild(flower);

        setTimeout(() => flower.remove(), duration * 1000);
    }, 180);
}

// ==========================================
// OPEN BIG GIFT
// ==========================================

bigGift.addEventListener("click", openBigGift);

function openBigGift() {
    if (finalGiftOpened) return;

    finalGiftOpened = true;
    bigGift.disabled = true;

    bigGift.classList.remove("big-gift-enter");
    bigGift.classList.add("opening");

    finalText.textContent = "A special message for you... ❤️";

    const rect = bigGift.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    createHeartBurst(centerX, centerY, 65);
    createEnergyRing(centerX, centerY);

    playEffect(950, 0.7);

    startFinalFlowerRain();

    setTimeout(showClosingScreen, 1800);
}

// ==========================================
// FINAL FLOWER RAIN
// ==========================================

function startFinalFlowerRain() {
    const flowerEmojis = [
        "🌹", "🌸", "🌺", "💖", "🌷", "💐"
    ];

    for (let i = 0; i < 55; i++) {
        setTimeout(() => {
            const flower = document.createElement("div");

            flower.className = "flower";

            flower.textContent =
                flowerEmojis[
                    Math.floor(Math.random() * flowerEmojis.length)
                ];

            flower.style.left = Math.random() * 100 + "vw";
            flower.style.fontSize =
                (22 + Math.random() * 30) + "px";

            flower.style.animationDuration =
                (3 + Math.random() * 4) + "s";

            flowerLayer.appendChild(flower);

            setTimeout(() => flower.remove(), 7500);
        }, i * 45);
    }
}

// ==========================================
// FINAL MALAYALAM THANK YOU
// ==========================================

function showClosingScreen() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    surprise.classList.add("hidden");
    closingScreen.classList.remove("hidden");

    // Final voice is also Malayalam.
    speakText(finalMalayalamMessage, "ml-IN");

    // Browser may block closing a tab opened manually.
    // Closing screen remains as a fallback.
    setTimeout(() => {
        window.close();
    }, 5000);
}
