// Function to calculate healthy ranges based on age
function getHealthyRanges(age) {
    // Medical reference ranges adjusted for age
    const ranges = {
        glucose: { min: 70, max: 100 }, // Fasting glucose normal
        bp: { min: 90, max: 120 }, // Systolic BP, adjusted slightly with age
        skin: { min: 20, max: 30 }, // Skin thickness in mm
        insulin: { min: 0, max: 12 }, // Fasting insulin
        bmi: { min: 18.5, max: 24.9 }, // Normal BMI range
        pedigree: { min: 0, max: 0.5 } // Diabetes pedigree function
    };

    // Adjust ranges based on age
    if (age >= 40) {
        ranges.glucose.max = 110; // Slightly higher for older age
        ranges.bp.max = 130; // Slightly higher for older age
    }
    if (age >= 60) {
        ranges.glucose.max = 120;
        ranges.bp.max = 140;
    }

    return ranges;
}

// Update placeholders based on age input
document.getElementById("age").addEventListener("input", function() {
    const age = parseInt(this.value);
    
    if (age > 0 && age <= 120) {
        const ranges = getHealthyRanges(age);
        
        // Update placeholders
        document.getElementById("glucose").placeholder = `Healthy: ${ranges.glucose.min}-${ranges.glucose.max} mg/dL`;
        document.getElementById("bp").placeholder = `Healthy: ${ranges.bp.min}-${ranges.bp.max} mmHg`;
        document.getElementById("skin").placeholder = `Healthy: ${ranges.skin.min}-${ranges.skin.max} mm`;
        document.getElementById("insulin").placeholder = `Healthy: ${ranges.insulin.min}-${ranges.insulin.max} µU/mL`;
        document.getElementById("bmi").placeholder = `Healthy: ${ranges.bmi.min}-${ranges.bmi.max}`;
        document.getElementById("pedigree").placeholder = `Healthy: ${ranges.pedigree.min}-${ranges.pedigree.max}`;
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



