from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import IsolationForest
import pandas as pd

app = FastAPI(title="Zero Trust ML Service", description="Anomaly Detection for User Activities")

# Simple mock model for demonstration
# In production, this would be loaded from a saved model artifact (.joblib or .pkl)
model = IsolationForest(contamination=0.1, random_state=42)

# Fit on dummy data to initialize
dummy_data = pd.DataFrame({
    'hour_of_day': [9, 10, 11, 14, 15, 16, 9, 10, 11, 14],
    'download_count': [5, 2, 10, 3, 4, 1, 6, 2, 8, 4],
    'failed_logins': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0]
})
model.fit(dummy_data)

class ActivityLog(BaseModel):
    user_id: str
    hour_of_day: int
    download_count: int
    failed_logins: int

@app.get("/")
def read_root():
    return {"status": "ML Service is running"}

@app.post("/predict-risk")
def predict_risk(activity: ActivityLog):
    # Prepare features
    features = np.array([[activity.hour_of_day, activity.download_count, activity.failed_logins]])
    
    # Predict (-1 is anomaly, 1 is normal)
    prediction = model.predict(features)[0]
    
    # Decision function returns raw score (lower = more abnormal)
    score = model.decision_function(features)[0]
    
    # Normalize score to 0-100 risk score (heuristic approach for demo)
    # IsolationForest decision_function values typically range from -0.5 to 0.5
    # Let's map it roughly to 0-100 where higher is riskier
    risk_score = max(0, min(100, int((0.5 - score) * 100)))
    
    return {
        "user_id": activity.user_id,
        "is_anomaly": bool(prediction == -1),
        "risk_score": risk_score
    }
