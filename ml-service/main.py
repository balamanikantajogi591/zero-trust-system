from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os
from datetime import datetime

app = FastAPI(title="Zero Trust AI Threat Intelligence")

# Model configuration
MODEL_PATH = "isolation_forest.pkl"
model = None

# Sample data for initial training (normally this would come from a database)
def train_initial_model():
    # Features: [hour_of_day, login_frequency, data_download_size, device_reputation]
    data = np.random.normal(size=(100, 4))
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(data)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    return model

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
else:
    model = train_initial_model()

class UserActivity(BaseModel):
    user_id: str
    hour_of_day: int
    login_frequency: float
    data_download_size: float
    device_reputation: float

@app.get("/")
def read_root():
    return {"status": "AI Engine Online", "model": "Isolation Forest"}

@app.post("/predict-risk")
async def predict_risk(activity: UserActivity):
    try:
        features = np.array([[
            activity.hour_of_day,
            activity.login_frequency,
            activity.data_download_size,
            activity.device_reputation
        ]])
        
        # Isolation Forest returns -1 for anomalies and 1 for normal
        prediction = model.predict(features)
        decision_score = model.decision_function(features)[0]
        
        # Convert decision score to a 0-100 risk score
        # Higher decision score means more normal, so we invert it
        risk_score = int(max(0, min(100, (0.5 - decision_score) * 100)))
        
        return {
            "user_id": activity.user_id,
            "risk_score": risk_score,
            "is_anomaly": bool(prediction[0] == -1),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model():
    global model
    model = train_initial_model()
    return {"status": "Model retrained successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
