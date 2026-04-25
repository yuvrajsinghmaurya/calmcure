/***********************
 * 🌿 GLOBAL UI EFFECTS
 ***********************/
document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    document.querySelectorAll(".float").forEach((el, index) => {
        const speed = (index + 1) * 0.3;
        el.style.transform =
            `translate(${x * speed}px, ${y * speed}px) rotate(${x * 0.5}deg)`;
    });
});


/***********************
 * 🌿 CALM MODE NAVIGATION
 ***********************/
function enterCalmMode() {
    window.location.href = "calm.html";
}

function exitCalmMode() {
    window.location.href = "dashboard.html";
}


/***********************
 * 🔊 SOUND CONTROL
 ***********************/
function toggleSound() {
    const video = document.getElementById("calmVideo");
    if (video) video.muted = !video.muted;
}


/***********************
 * 💬 AFFIRMATIONS
 ***********************/
const affirmations = [
    "You are safe.",
    "This feeling will pass.",
    "Breathe slowly.",
    "You are doing your best.",
    "Let go of what you cannot control.",
    "Peace begins with you."
];

let index = 0;

function changeAffirmation() {
    const text = document.getElementById("affirmationText");
    if (!text) return;

    text.innerText = affirmations[index];
    index = (index + 1) % affirmations.length;
}

setInterval(changeAffirmation, 5000);


/***********************
 * 🌬 BREATHING TEXT
 ***********************/
let breathing = true;

setInterval(() => {
    const text = document.getElementById("breathText");
    if (!text) return;

    breathing = !breathing;
    text.innerText = breathing ? "Breathe In" : "Breathe Out";
}, 4000);


/***********************
 * ⏳ TIMER (5 MIN)
 ***********************/
let time = 300;

function updateTimer() {
    const timer = document.getElementById("timer");
    if (!timer) return;

    let min = Math.floor(time / 60);
    let sec = time % 60;

    timer.innerText = `${min}:${sec < 10 ? "0" + sec : sec}`;

    if (time > 0) time--;
}

setInterval(updateTimer, 1000);


/***********************
 * 🌿 MOOD SYSTEM
 ***********************/
let selectedMood = "";

function selectMood(mood) {
    selectedMood = mood;

    const el = document.getElementById("selectedMoodText");
    if (el) el.innerText = "Selected: " + mood;
}

function saveMood() {
    const note = document.getElementById("note")?.value || "";
    const intensity = document.getElementById("intensity")?.value || "";

    if (!selectedMood) {
        alert("Please select a mood");
        return;
    }

    const entry = {
        mood: selectedMood,
        note: note,
        intensity: intensity,
        date: new Date().toISOString() // ✅ FIXED
    };

    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    moods.unshift(entry);

    localStorage.setItem("moods", JSON.stringify(moods));

    // reset UI
    const noteBox = document.getElementById("note");
    if (noteBox) noteBox.value = "";

    selectedMood = "";

    const selectedText = document.getElementById("selectedMoodText");
    if (selectedText) selectedText.innerText = "Selected: None";

    displayMood();
    showInsights();
    showMoodGraph();
}


/***********************
 * 📜 DISPLAY MOODS
 ***********************/
function displayMood() {
    const history = document.getElementById("history");
    if (!history) return;

    let moods = JSON.parse(localStorage.getItem("moods")) || [];

    history.innerHTML = "";

    moods.forEach((m, index) => {
        history.innerHTML += `
            <div class="history-card">
                <p><b>${m.mood}</b></p>
                <p>Intensity: ${m.intensity}</p>
                <p>${m.note}</p>
                <p>📅 ${new Date(m.date).toLocaleString()}</p>
                <button onclick="deleteMood(${index})">Delete</button>
            </div>
        `;
    });
}


/***********************
 * 🗑 DELETE MOOD
 ***********************/
function deleteMood(index) {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    moods.splice(index, 1);

    localStorage.setItem("moods", JSON.stringify(moods));

    displayMood();
    showInsights();
    showMoodGraph();
}


/***********************
 * 📊 INSIGHTS
 ***********************/
function showInsights() {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];

    let happy = moods.filter(m => m.mood.includes("Happy")).length;
    let sad = moods.filter(m => m.mood.includes("Sad")).length;

    const el = document.getElementById("insights");
    if (el) {
        el.innerText = `😊 Happy: ${happy} | 😔 Sad: ${sad}`;
    }
}


/***********************
 * 📈 MOOD GRAPH (LAST 30 DAYS)
 ***********************/
function showMoodGraph() {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];

    let moodCount = {
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Angry: 0,
        Calm: 0
    };

    let today = new Date();

    moods.forEach(m => {
        let entryDate = new Date(m.date);
        let diffDays = (today - entryDate) / (1000 * 60 * 60 * 24);

        if (diffDays <= 30) {

            if (m.mood.includes("Happy")) moodCount.Happy++;
            if (m.mood.includes("Neutral")) moodCount.Neutral++;
            if (m.mood.includes("Sad")) moodCount.Sad++;
            if (m.mood.includes("Angry")) moodCount.Angry++;
            if (m.mood.includes("Calm")) moodCount.Calm++;
        }
    });

    const ctx = document.getElementById("moodChart");
    if (!ctx) return;

    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }

    window.moodChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['😊 Happy', '😐 Neutral', '😔 Sad', '😡 Angry', '😌 Calm'],
            datasets: [{
                label: 'Last 30 Days Mood',
                data: Object.values(moodCount),
                backgroundColor: [
                    '#66bb6a',
                    '#90a4ae',
                    '#42a5f5',
                    '#ef5350',
                    '#ab47bc'
                ],
                borderRadius: 10
            }]
        }
    });

    // dominant mood
    let keys = Object.keys(moodCount);
    let values = Object.values(moodCount);

    let maxMood = keys[values.indexOf(Math.max(...values))];

    const top = document.getElementById("topMood");
    if (top) top.innerText = "🌿 Dominant Mood: " + maxMood;
}


/***********************
 * 📓 JOURNAL SYSTEM
 ***********************/
function saveJournal() {
    const text = document.getElementById("journalInput")?.value || "";
    const mood = document.getElementById("journalMood")?.value || "";

    if (!text.trim()) {
        alert("Write something!");
        return;
    }

    const entry = {
        content: text,
        mood: mood,
        date: new Date().toISOString()
    };

    let journals = JSON.parse(localStorage.getItem("journals")) || [];
    journals.unshift(entry);

    localStorage.setItem("journals", JSON.stringify(journals));

    document.getElementById("journalInput").value = "";

    displayJournal();
    generateReflection(text);
}

function displayJournal() {
    const container = document.getElementById("journalHistory");
    if (!container) return;

    let journals = JSON.parse(localStorage.getItem("journals")) || [];

    container.innerHTML = "";

    journals.forEach((j, index) => {
        container.innerHTML += `
            <div class="journal-card">
                <p>${j.content}</p>
                <p>${j.mood}</p>
                <small>${new Date(j.date).toLocaleString()}</small>
                <button onclick="deleteJournal(${index})">Delete</button>
            </div>
        `;
    });
}

function deleteJournal(index) {
    let journals = JSON.parse(localStorage.getItem("journals")) || [];
    journals.splice(index, 1);

    localStorage.setItem("journals", JSON.stringify(journals));

    displayJournal();
}


/***********************
 * 🧠 AI REFLECTION
 ***********************/
function generateReflection(text) {
    let msg = "You’re expressing yourself well.";

    if (text.includes("sad") || text.includes("tired")) {
        msg = "It seems you're low. Be kind to yourself.";
    } else if (text.includes("happy")) {
        msg = "Great positivity! Keep it up 🌿";
    } else if (text.includes("stress")) {
        msg = "Take a deep breath. You’re safe.";
    }

    const el = document.getElementById("aiReflection");
    if (el) el.innerText = msg;
}


/***********************
 * 🔐 AUTH SYSTEM
 ***********************/
function setLogin(userName) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", userName);
}

function login() {
    let user = document.getElementById("username")?.value;
    let pass = document.getElementById("password")?.value;

    if (user && pass) {
        setLogin(user);
        window.location.href = "tracker.html";
    } else {
        alert("Enter valid details");
    }
}

function checkAuth() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}

function loadUser() {
    let user = localStorage.getItem("user");

    const el = document.getElementById("usernameDisplay");
    if (el && user) {
        el.innerText = "Welcome, " + user + " 👋";
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}

/***********************
 * 🚀 MASTER ONLOAD (FIXED)
 ***********************/
window.onload = function () {

    // mood
    displayMood();
    showInsights();
    showMoodGraph();

    // journal
    displayJournal();

    // auth
    loadUser();
};