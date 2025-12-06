// Theme and Background Management
const LIGHT_BACKGROUNDS = ['light 01.jpg'];
const DARK_BACKGROUNDS = ['dark 01.jpg', 'dark 02.jpg'];
const BACKGROUND_CHANGE_INTERVAL = 30000; // Change wallpaper every 30 seconds if open long time
const BACKGROUND_PATH = '../public/img/background/';

let currentTheme = localStorage.getItem('theme') || 'light';
let backgroundChangeTimer = null;

// Initialize theme on page load
window.addEventListener('DOMContentLoaded', function() {
    loadHealthRanges();
    initializeTheme();
    changeBackground();
    setupBackgroundTimer();
});

// Initialize theme
function initializeTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        document.getElementById('themeToggle').textContent = '🌙';
    }
}

// Get random background from current theme
function getRandomBackground() {
    const backgrounds = currentTheme === 'dark' ? DARK_BACKGROUNDS : LIGHT_BACKGROUNDS;
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

// Change background with gradient animation
function changeBackground() {
    const randomBg = getRandomBackground();
    const bgUrl = `${BACKGROUND_PATH}${randomBg}`;
    const bgContainer = document.getElementById('backgroundContainer');
    
    bgContainer.style.backgroundImage = `url('${bgUrl}')`;
}

// Setup timer for changing background every 30 seconds
function setupBackgroundTimer() {
    clearInterval(backgroundChangeTimer);
    backgroundChangeTimer = setInterval(() => {
        changeBackground();
    }, BACKGROUND_CHANGE_INTERVAL);
}

// Theme toggle button
document.getElementById('themeToggle').addEventListener('click', function() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    // Update theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        this.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        this.textContent = '🌙';
    }
    
    // Change background with animation
    changeBackground();
    setupBackgroundTimer();
});

// Load health ranges data
let healthRanges = null;

async function loadHealthRanges() {
    try {
        const response = await fetch("health_ranges.json");
        const data = await response.json();
        healthRanges = data.ageGroups;
    } catch (error) {
        console.error("Error loading health ranges:", error);
    }
}

// Get health range for given age
function getHealthRangeForAge(age) {
    if (!healthRanges) return null;
    
    const ageNum = parseInt(age);
    const range = healthRanges.find(group => ageNum >= group.min && ageNum < group.max);
    return range;
}

// Update placeholder text for all input fields
function updateHealthPlaceholders(age) {
    const range = getHealthRangeForAge(age);
    
    if (!range) {
        // Reset placeholders if age is invalid
        document.getElementById("glucose").placeholder = "Healthy range: -";
        document.getElementById("bp").placeholder = "Healthy range: -";
        document.getElementById("skin").placeholder = "Healthy range: -";
        document.getElementById("insulin").placeholder = "Healthy range: -";
        document.getElementById("bmi").placeholder = "Healthy range: -";
        document.getElementById("pedigree").placeholder = "Healthy range: -";
        return;
    }
    
    document.getElementById("glucose").placeholder = `Healthy range: ${range.glucose.min}-${range.glucose.max}`;
    document.getElementById("bp").placeholder = `Healthy range: ${range.bloodPressure.min}-${range.bloodPressure.max}`;
    document.getElementById("skin").placeholder = `Healthy range: ${range.skinThickness.min}-${range.skinThickness.max}`;
    document.getElementById("insulin").placeholder = `Healthy range: ${range.insulin.min}-${range.insulin.max}`;
    document.getElementById("bmi").placeholder = `Healthy range: ${range.bmi.min}-${range.bmi.max}`;
    document.getElementById("pedigree").placeholder = `Healthy range: ${range.pedigree.min}-${range.pedigree.max}`;
}

// Update placeholders when age changes
document.getElementById("age").addEventListener("change", function() {
    if (this.value) {
        updateHealthPlaceholders(this.value);
    }
});

// Handle gender change to show/hide pregnancies field
document.getElementById("gender").addEventListener("change", function() {
    const pregnanciesContainer = document.getElementById("pregnanciesContainer");
    const pregnanciesField = document.getElementById("pregnancies");
    
    if (this.value === "female") {
        pregnanciesContainer.style.display = "flex";
        pregnanciesField.required = true;
    } else if (this.value === "male") {
        pregnanciesContainer.style.display = "none";
        pregnanciesField.required = false;
        pregnanciesField.value = "0"; // Set to 0 for males
    }
});

document.getElementById("predictionForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Collect values
    const data = {
        age: document.getElementById("age").value,
        pregnancies: document.getElementById("pregnancies").value,
        glucose: document.getElementById("glucose").value,
        bp: document.getElementById("bp").value,
        skin: document.getElementById("skin").value,
        insulin: document.getElementById("insulin").value,
        bmi: document.getElementById("bmi").value,
        pedigree: document.getElementById("pedigree").value
    };

    // Send to backend API (Flask/FastAPI must be running at localhost:5000)
    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById("result").innerText = "Prediction: " + result.prediction;
    } catch (error) {
        document.getElementById("result").innerText = "Error connecting to server!";
    }
});



