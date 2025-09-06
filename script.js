document.getElementById("predictionForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Collect values
    const data = {
        pregnancies: document.getElementById("pregnancies").value,
        glucose: document.getElementById("glucose").value,
        bp: document.getElementById("bp").value,
        skin: document.getElementById("skin").value,
        insulin: document.getElementById("insulin").value,
        bmi: document.getElementById("bmi").value,
        pedigree: document.getElementById("pedigree").value,
        age: document.getElementById("age").value
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



