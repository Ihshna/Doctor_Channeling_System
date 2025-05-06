from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model
model = joblib.load('health_risk_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    
    data = request.get_json()
    print("Reciever data:",data)

    # Convert JSON to DataFrame
    df = pd.DataFrame([data])

    # Map gender
    df['gender'] = df['gender'].map({'male': 0, 'female': 1})

    # Predict
    prediction = model.predict(df)[0]

    # Provide health suggestion based on prediction
    if prediction == 1:
        risk = "High Risk"
        suggestion = {
        "diet": (
            "Adopt a low glycemic index (GI) diet rich in vegetables, whole grains, "
            "lean proteins, and legumes. Avoid sugary drinks, processed snacks, and fried foods. "
            "Eat smaller, frequent meals to maintain stable glucose levels."
        ),
        "exercise": (
            "Engage in at least 150 minutes of moderate-intensity aerobic exercise weekly "
            "(e.g., brisk walking, cycling, swimming). Include strength training 2 times per week."
        ),
        "lifestyle": (
            "Monitor blood sugar regularly. Prioritize 7–8 hours of quality sleep daily. "
            "Practice mindfulness, reduce stress through yoga/meditation, avoid smoking, and limit alcohol."
        ),
        "medical": (
            "Schedule regular checkups. Take medications as prescribed. Monitor blood pressure and cholesterol."
        )
        }
    else:
        risk = "Low Risk"
        suggestion = {
            "diet": (
            "Maintain a balanced diet rich in fruits, vegetables, lean proteins, and whole grains. "
            "Limit intake of added sugars and saturated fats. Stay hydrated."
        ),
        "exercise": (
            "Do 30–45 minutes of physical activity most days, like walking, jogging, or yoga. "
            "Include occasional strength or flexibility exercises."
        ),
        "lifestyle": (
            "Keep a regular sleep routine (7–9 hours/night). Manage stress with hobbies or relaxation techniques. "
            "Avoid smoking and consume alcohol in moderation if at all."
        ),
        "preventive": (
            "Go for annual health screenings. Stay up-to-date with vaccinations and maintain a healthy BMI."
        )
        }

    return jsonify({
        "risk": risk,
        "suggestion": suggestion
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)