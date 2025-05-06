import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

#Load data
data = pd.read_csv('predictive_data.csv')
data = data.dropna()

#Select features and target
X = data[['age', 'gender', 'bmi', 'hypertension','heart_disease','HbA1c_level', 
          'blood_glucose_level', 'blood_sugar', 'weight']] 
y = data['diabetes'] 

#Convert categorical variables (gender) to numeric
X.loc[:,'gender'] = X['gender'].map({'male': 0, 'female': 1})


#Train the model
model = RandomForestClassifier()
model.fit(X, y)

#Save the trained model
joblib.dump(model, 'health_risk_model.pkl')

print("Model trained and saved as 'health_risk_model.pkl'")