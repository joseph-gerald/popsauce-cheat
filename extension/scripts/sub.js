const pairs = {};

(async () => {
    const res = await fetch("https://cdn.jsdelivr.net/gh/joseph-gerald/jklm-py-client@main/answers/popsauce_pairs.txt")
    const text = await res.text();

    text.split("\n").forEach(line => {
        const split = line.split(":");
        pairs[split.shift()] = split.join(":");
    });
})();

async function sha1(uint8Array) {
    const hash = await crypto.subtle.digest('SHA-1', uint8Array);
    return Array.from(new Uint8Array(hash))
        .map(v => v.toString(16).padStart(2, '0'))
        .join('');
}

async function getChallengeHash() {
    const prompt = document.querySelector(".prompt").innerText;
    const text = document.querySelector(".text").innerText;
    const challenge = document.querySelector(".challenge");

    if (challenge) challenge.style.boxShadow = "#1c181c 0 0 100px";

    if (!prompt) return;

    const challengeType = document.querySelector(".text").checkVisibility() ? "text" : "image";
    if (challengeType === "image" && !document.querySelector(".actual").checkVisibility()) return;

    const promptUInt8Array = new TextEncoder().encode(prompt);
    let combinedUInt8Array;

    if (challengeType === "text") {
        const textUInt8Array = new TextEncoder().encode(text);

        combinedUInt8Array = new Uint8Array(promptUInt8Array.length + textUInt8Array.length);
        combinedUInt8Array.set(promptUInt8Array);
        combinedUInt8Array.set(textUInt8Array, promptUInt8Array.length);
    } else {
        const imageArrayBuffer = await fetch(document.querySelector(".actual").style.backgroundImage.split("\"")[1]).then(res => res.blob()).then(blob => blob.arrayBuffer()).catch(() => null);
        if (!imageArrayBuffer) return;
        const imageUInt8Array = new Uint8Array(imageArrayBuffer);

        combinedUInt8Array = new Uint8Array(imageUInt8Array.length + promptUInt8Array.length);
        combinedUInt8Array.set(promptUInt8Array);
        combinedUInt8Array.set(imageUInt8Array, promptUInt8Array.length);
    }

    const hash = await sha1(combinedUInt8Array);

    return hash;
}

let hashesHandled = [];

setInterval(async () => {
    const hash = await getChallengeHash();

    if (!hash) return

    if (hashesHandled.length > 1) hashesHandled.shift();

    if (!hashesHandled.includes(hash)) {
        const guessInput = document.querySelector(".guessing input");
        hashesHandled.push(hash);

        const indexed_answer = pairs[hash];

        if (!indexed_answer) {
            guessInput.placeholder = "404 / No Answer Found";
            return;
        }

        guessInput.placeholder = indexed_answer;
        console.log(hash, indexed_answer);

        guessInput.onkeydown = e => {
            console.log(e.value);
            if (e.key === "Enter" && guessInput.value === "") {
                guessInput.value = indexed_answer;
            }
        }
    }
}, 25);