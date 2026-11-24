/* ==================================
   CHUCK V2 - VOICE & MEMORY SYSTEM
   ================================== */

const clock = document.getElementById("clock");
const date = document.getElementById("date");
const command = document.getElementById("command");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const voice = document.getElementById("voice");

const STORAGE_KEY = "chuck_v2_memory";

// MEMORY STORAGE
let history = [];

try {
    history = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(history)) history = [];
} catch (error) {
    history = [];
}

// SAVE MEMORY
function saveMemory() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(history.slice(-100))
        );
    } catch (error) {
        console.warn("Memory could not be saved.");
    }
}

// DISPLAY MESSAGES
function addMessage(sender, text) {
    const p = document.createElement("p");
    p.style.marginBottom = "10px";
    p.textContent = sender + ": " + text;

    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;

    history.push({ sender, text });
    history = history.slice(-100);
    saveMemory();
}

// RESTORE PREVIOUS CONVERSATION
messages.innerHTML = "";

if (history.length > 0) {
    history.forEach(item => {
        const p = document.createElement("p");
        p.style.marginBottom = "10px";
        p.textContent = item.sender + ": " + item.text;
        messages.appendChild(p);
    });
} else {
    const p = document.createElement("p");
    p.textContent = "CHUCK: System online. Awaiting activation.";
    messages.appendChild(p);
}

messages.scrollTop = messages.scrollHeight;

// CLOCK
function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString();

    date.textContent = now.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

updateClock();
setInterval(updateClock, 1000);

// BASIC RESPONSE ENGINE
function chuckResponse(text) {
    const input = text.toLowerCase();

    if (/hello|hi|hey/.test(input)) {
        return "Hello! CHUCK is ready. How can I help you?";
    }

    if (input.includes("your name")) {
        return "I am CHUCK, your personal AI assistant.";
    }

    if (input.includes("time")) {
        return "The current time is " +
            new Date().toLocaleTimeString();
    }

    if (input.includes("date")) {
        return "Today is " + new Date().toDateString();
    }

    if (input.includes("how are you")) {
        return "All systems operational. Thank you for asking!";
    }

    if (input.includes("remember")) {
        return "Our conversation is being saved in my local memory.";
    }

    if (input.includes("who created you")) {
        return "I was created by my human developer. A brilliant choice, if I may say so!";
    }

    if (input.includes("help")) {
        return "You can ask me about the time, date, or my identity.";
    }

    return "I've saved your message. My full AI intelligence connection is still under development.";
}


// VOICE RECOGNITION — CHUCK V2

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;
let listening = false;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voice.addEventListener("click", () => {
        if (listening) return;

        try {
            recognition.start();
        } catch (error) {
            addMessage(
                "CHUCK",
                "Unable to start voice: " + error.name
            );
        }
    });

    recognition.onstart = () => {
        listening = true;
        voice.textContent = "🎙 LISTENING...";
    };

    recognition.onresult = event => {

        const spokenText =
            event.results[0][0].transcript;

        command.value = spokenText;

        processCommand(spokenText, true);

        command.value = "";
    };

    recognition.onend = () => {

        listening = false;

        voice.textContent = "🎙 ACTIVATE VOICE";
    };

    recognition.onerror = event => {

        listening = false;

        voice.textContent = "🎙 ACTIVATE VOICE";

        addMessage(
            "CHUCK",
            "Speech recognition error: " + event.error
        );
    };

} else {

    voice.addEventListener("click", () => {

        addMessage(
            "CHUCK",
            "Speech recognition is unavailable in this browser."
        );

    });
}

// TEXT COMMANDS
function sendCommand() {
    const text = command.value.trim();

    if (!text) return;

    processCommand(text, false);
    command.value = "";
}

send.addEventListener("click", sendCommand);

command.addEventListener("keydown", event => {
    if (event.key === "Enter") sendCommand();
});

// VOICE RECOGNITION

    window.SpeechRecognition ||
    window.webkitSpeechRecognition;




if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voice.addEventListener("click", () => {
        if (listening) return;

        try {
            recognition.start();
        } catch (error) {
            addMessage("CHUCK", "Please try activating the microphone again.");
        }
    });

    recognition.onstart = () => {
        listening = true;
        voice.textContent = "🎙 LISTENING...";
    };

    recognition.onresult = event => {
        const spokenText =
            event.results[0][0].transcript;

        command.value = spokenText;
        processCommand(spokenText, true);
        command.value = "";
    };

    recognition.onend = () => {
        listening = false;
        voice.textContent = "🎙 ACTIVATE VOICE";
    };

    recognition.onerror = event => {
        listening = false;
        voice.textContent = "🎙 ACTIVATE VOICE";

        addMessage(
            "CHUCK",
            "Microphone issue: " + event.error
        );
    };

} else {
    voice.addEventListener("click", () => {
        addMessage(
            "CHUCK",
            "Voice recognition is unavailable in this browser. You can still type commands."
        );
    });
}

// MEMORY CLEAR BUTTON
const clearMemory = document.createElement("button");

clearMemory.textContent = "CLEAR CONVERSATION MEMORY";
clearMemory.style.width = "100%";
clearMemory.style.marginTop = "12px";
clearMemory.style.background = "#301725";
clearMemory.style.borderColor = "#a54b68";
clearMemory.style.fontSize = "10px";

document.querySelector(".command-panel")
    .appendChild(clearMemory);

clearMemory.addEventListener("click", () => {
    const confirmed = window.confirm(
        "Clear all saved CHUCK conversations?"
    );

    if (!confirmed) return;

    history = [];
    localStorage.removeItem(STORAGE_KEY);
    messages.innerHTML = "";

    const p = document.createElement("p");
    p.textContent = "CHUCK: Memory cleared. Awaiting activation.";
    messages.appendChild(p);
});

// NAVIGATION
document.querySelectorAll(".nav-btn")
    .forEach(button => {
        button.addEventListener("click", () => {

            document.querySelectorAll(".nav-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            addMessage(
                "CHUCK",
                button.dataset.page + " module selected."
            );
        });
    });

console.log("CHUCK V2: Voice and memory initialized.");
