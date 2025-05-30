from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        age = data.get('age', 0)
        gender = data.get('gender', '').lower()
        bmi = data.get('bmi', 0)
        hypertension = data.get('hypertension', 0)
        heart_disease = data.get('heart_disease', 0)
        HbA1c_level = data.get('HbA1c_level', 0)
        blood_glucose_level = data.get('blood_glucose_level', 0)
        blood_sugar = data.get('blood_sugar', 0)
        weight = data.get('weight', 0)
    except Exception as e:
        return jsonify({"error": f"Invalid input data: {str(e)}"}), 400

    # Rule-based risk logic:
    # If any of these conditions are met, classify as High Risk:
    # - HbA1c_level > 7.0 (diabetes indicator)
    # - blood_glucose_level > 200 (high glucose)
    # - blood_sugar > 180 (high sugar)
    # - BMI > 30 (obese)
    # - hypertension = 1
    # - heart_disease = 1
    # - age > 60

    high_risk_conditions = [
        HbA1c_level > 7.0,
        blood_glucose_level > 200,
        blood_sugar > 180,
        bmi > 30,
        hypertension == 1,
        heart_disease == 1,
        age > 60
    ]

    if any(high_risk_conditions):
        risk = "High Risk"
        suggestion = {
            "diet": "Adopt a low glycemic index diet rich in vegetables, whole grains, lean proteins, and legumes. Avoid sugary drinks, processed snacks, and fried foods. Eat smaller, frequent meals to maintain stable glucose levels.",
            "exercise": "Engage in at least 150 minutes of moderate-intensity aerobic exercise weekly (e.g., brisk walking, cycling, swimming). Include strength training 2 times per week.",
            "lifestyle": "Monitor blood sugar regularly. Prioritize 7–8 hours of quality sleep daily. Practice mindfulness, reduce stress through yoga/meditation, avoid smoking, and limit alcohol.",
        }
    else:
        risk = "Low Risk"
        suggestion = {
            "diet": "Maintain a balanced diet rich in fruits, vegetables, lean proteins, and whole grains. Limit added sugars and saturated fats. Stay hydrated.",
            "exercise": "Do 30–45 minutes of physical activity most days, like walking, jogging, or yoga. Include occasional strength or flexibility exercises.",
            "lifestyle": "Keep a regular sleep routine (7–9 hours/night). Manage stress with hobbies or relaxation techniques. Avoid smoking and consume alcohol in moderation if at all.",
        }

    return jsonify({"risk": risk, "suggestion": suggestion})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
