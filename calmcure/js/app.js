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

    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    fetch('http://localhost:8000/api/moods', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ mood: selectedMood, intensity, note })
    }).then(r => r.json()).then(data => {
        if (data.success) {
            // reset UI
            const noteBox = document.getElementById("note");
            if (noteBox) noteBox.value = "";
            selectedMood = "";
            const selectedText = document.getElementById("selectedMoodText");
            if (selectedText) selectedText.innerText = "Selected: None";
            // refresh
            displayMood();
            showInsights();
            showMoodGraph();
        } else {
            alert(data.message || 'Failed to save mood');
        }
    }).catch(err => alert('Error: ' + err.message));
}


/***********************
 * 📜 DISPLAY MOODS
 ***********************/
async function displayMood() {
    const history = document.getElementById("history");
    if (!history) return;
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    try {
        const res = await fetch('http://localhost:8000/api/moods', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        if (!data.success) {
            history.innerHTML = '<p>Failed to load moods</p>';
            return;
        }
        const moods = data.moods || [];
        history.innerHTML = '';
        moods.forEach(m => {
            history.innerHTML += `
                <div class="history-card">
                    <p><b>${m.mood}</b></p>
                    <p>Intensity: ${m.intensity}</p>
                    <p>${m.note || ''}</p>
                    <p>📅 ${new Date(m.created_at || m.date).toLocaleString()}</p>
                    <button onclick="deleteMood(${m.id})">Delete</button>
                </div>
            `;
        });
    } catch (err) {
        history.innerHTML = '<p>Error loading moods</p>';
    }
}


/***********************
 * 🗑 DELETE MOOD
 ***********************/
async function deleteMood(id) {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
    try {
        const res = await fetch(`http://localhost:8000/api/moods/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        if (data.success) {
            displayMood();
            showInsights();
            showMoodGraph();
        } else {
            alert(data.message || 'Failed to delete');
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}


/***********************
 * 📊 INSIGHTS
 ***********************/
function showInsights() {
    const el = document.getElementById("insights");
    if (!el) return;
    const token = localStorage.getItem('token');
    if (!token) return el.innerText = '';
    fetch('http://localhost:8000/api/moods', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(data => {
            if (!data.success) return el.innerText = '';
            const moods = data.moods || [];
            const happy = moods.filter(m => m.mood.includes("Happy")).length;
            const sad = moods.filter(m => m.mood.includes("Sad")).length;
            el.innerText = `😊 Happy: ${happy} | 😔 Sad: ${sad}`;
        }).catch(() => el.innerText = '');
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
        const token = localStorage.getItem('token');
        if (!token) return;
        let moods = [];
        // fetch moods then render graph
        fetch('http://localhost:8000/api/moods', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(r => r.json())
            .then(data => {
                if (!data.success) return;
                moods = data.moods || [];
                renderMoodGraph(moods);
            }).catch(() => {});
        return;
    }

    function renderMoodGraph(moods) {
        let moodCount = {
            Happy: 0,
            Neutral: 0,
            Sad: 0,
            Angry: 0,
            Calm: 0
        };

        let today = new Date();

        moods.forEach(m => {
            let entryDate = new Date(m.created_at || m.date);
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
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
    fetch('http://localhost:8000/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ content: text, mood })
    }).then(r => r.json()).then(data => {
        if (data.success) {
            document.getElementById("journalInput").value = "";
            displayJournal();
            generateReflection(text);
        } else {
            alert(data.message || 'Failed to save journal');
        }
    }).catch(err => alert('Error: ' + err.message));
}

function displayJournal() {
    const container = document.getElementById("journalHistory");
    if (!container) return;

    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
    fetch('http://localhost:8000/api/journals', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(data => {
            if (!data.success) return container.innerHTML = '<p>Failed to load journals</p>';
            const journals = data.journals || [];
            container.innerHTML = '';
            journals.forEach(j => {
                container.innerHTML += `
                    <div class="journal-card">
                        <p>${j.content}</p>
                        <p>${j.mood || ''}</p>
                        <small>${new Date(j.created_at || j.date).toLocaleString()}</small>
                        <button onclick="deleteJournal(${j.id})">Delete</button>
                    </div>
                `;
            });
        }).catch(() => container.innerHTML = '<p>Error loading journals</p>');
}

async function deleteJournal(id) {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
    try {
        const res = await fetch(`http://localhost:8000/api/journals/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        if (data.success) displayJournal(); else alert(data.message || 'Delete failed');
    } catch (err) { alert('Error: ' + err.message); }
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

// Set login state and store JWT token
function setLogin(user, token) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", user.name || user.email);
    localStorage.setItem("token", token);
}

// Real login logic
async function login(event) {
    event.preventDefault();
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    if (!email || !password) {
        alert("Enter valid details");
        return;
    }
    try {
        const res = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            setLogin(data.user, data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        alert("Login error: " + err.message);
    }
}

// Real signup logic
async function signup(event) {
    event.preventDefault();
    const name = document.querySelector('#signupForm input[placeholder="Full Name"]')?.value;
    const email = document.querySelector('#signupForm input[placeholder="Email"]')?.value;
    const password = document.querySelector('#signupForm input[placeholder="Password"]')?.value;
    const confirm = document.querySelector('#signupForm input[placeholder="Confirm Password"]')?.value;
    if (!name || !email || !password || !confirm) {
        alert("All fields required");
        return;
    }
    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }
    try {
        const res = await fetch("http://localhost:8000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.success) {
            setLogin(data.user, data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Signup failed");
        }
    } catch (err) {
        alert("Signup error: " + err.message);
    }
}


function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
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
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

/***********************
 * 🚀 MASTER ONLOAD (FIXED)
 ***********************/
window.onload = function () {
    // Attach login/signup handlers if forms exist
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", signup);
    }
    // mood
    displayMood();
    showInsights();
    showMoodGraph();
    // journal
    displayJournal();
    loadUser();
};