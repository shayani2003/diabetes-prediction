


from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

# Load model + scaler
scaler = joblib.load("scaler.pkl")
model = joblib.load("diabetes_model.pkl")

app = Flask(__name__)
CORS(app)  # allow requests from frontend

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = np.array([[ 
        float(data["pregnancies"]),
        float(data["glucose"]),
        float(data["bp"]),
        float(data["skin"]),
        float(data["insulin"]),
        float(data["bmi"]),
        float(data["pedigree"]),
        float(data["age"])
    ]])
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    result = "Diabetic" if prediction == 1 else "Not Diabetic"
    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True)
