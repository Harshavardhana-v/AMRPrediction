from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
import joblib
import pandas as pd
import os
import json
import sqlite3
import uuid
from marshmallow import Schema, fields, ValidationError
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import shap
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print(f"DEBUG: Loaded API Key: {api_key[:8]}...")
client = OpenAI(api_key=api_key)

# Rule-based fallback data for when API quota is exceeded
AMR_KNOWLEDGE_BASE = {
    "e. coli": "Escherichia coli symptoms include severe stomach cramps, bloody diarrhea, and vomiting. Most cases clear in 5-7 days, but some can lead to kidney failure.",
    "mrsa": "MRSA (Methicillin-resistant Staph aureus) is resistant to many common antibiotics. It often causes skin infections (bumps, pus, fever) and requires specific drugs like Vancomycin.",
    "klebsiella": "Klebsiella pneumoniae causes healthcare-associated infections like pneumonia and bloodstream infections. It is known for high resistance risk.",
    "symptoms": "Pathogens like E. coli or Staph aureus often cause fever, inflammation, pain, or digestive issues depending on the site of infection.",
    "antibiotics": "Antibiotics are used to treat bacterial infections. Misuse leads to resistance, where bacteria evolve to survive the drugs meant to kill them.",
    "prevention": "Hand hygiene, proper food cooking, and following infection control protocols are the best ways to prevent the spread of resistant bacteria.",
    "transmission": "Bacteria spread through direct contact, contaminated surfaces, or infected food and water."
}

app = Flask(__name__)
CORS(app)

# Rate limiting – default 100 requests per minute per IP (configurable via env var)
limiter = Limiter(key_func=get_remote_address, app=app, default_limits=[os.getenv('RATE_LIMIT', '100 per minute')])

# Load model and SHAP explainer at startup
MODEL_PATH = os.path.join('models', 'amr_xgboost_model.pkl')
SHAP_EXPLAINER = None
try:
    model = joblib.load(MODEL_PATH)
    SHAP_EXPLAINER = shap.TreeExplainer(model)
    print("Model and SHAP explainer loaded successfully.")
except Exception as e:
    print(f"Error loading model or SHAP explainer: {e}")
    model = None
    SHAP_EXPLAINER = None

# SQLite DB for prediction history (global, anonymous)
DB_PATH = os.path.join('predictions.db')
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = conn.cursor()
cur.execute('''
    CREATE TABLE IF NOT EXISTS predictions (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        inputs TEXT,
        prediction TEXT,
        probability REAL,
        risk_tier TEXT,
        shap_values TEXT,
        resistance_profile TEXT
    )
''')
conn.commit()

# Marshmallow schema for input validation
class PredictSchema(Schema):
    age = fields.Int(required=True, validate=lambda n: 0 <= n <= 120)
    gender = fields.Int(required=True, validate=lambda g: g in (0, 1))
    infection_type = fields.Int(required=True, validate=lambda i: 0 <= i <= 20)
    prev_antibiotic_usage = fields.Int(required=True, validate=lambda v: v in (0, 1))
    wbc_count = fields.Float(required=True, validate=lambda w: 0 <= w <= 100)
    hospitalization_days = fields.Int(required=True, validate=lambda d: 0 <= d <= 365)

def compute_risk_tier(prob):
    if prob < 0.30:
        return "Low"
    elif prob <= 0.65:
        return "Moderate"
    else:
        return "High"

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})

@app.route('/model-info', methods=['GET'])
def model_info():
    meta_path = os.path.join('models', 'model_meta.json')
    if os.path.exists(meta_path):
        with open(meta_path) as f:
            meta = json.load(f)
        return jsonify(meta)
    else:
        return jsonify({"error": "Metadata not found"}), 404

@app.route('/predict', methods=['POST'])
@limiter.limit(os.getenv('RATE_LIMIT', '100 per minute'))
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded.'}), 500
    try:
        data = request.get_json()
        schema = PredictSchema()
        validated = schema.load(data)
    except ValidationError as ve:
        return jsonify({'validation_errors': ve.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    input_df = pd.DataFrame([validated])
    pred = model.predict(input_df)[0]
    prob = model.predict_proba(input_df)[0][1]
    result = "Resistant" if pred == 1 else "Susceptible"
    risk = compute_risk_tier(prob)
    shap_vals = {}
    if SHAP_EXPLAINER is not None:
        shap_array = SHAP_EXPLAINER.shap_values(input_df)[0]
        shap_vals = dict(zip(input_df.columns, shap_array.tolist()))
    resistance_profile = {}
    # Store prediction history
    pred_id = str(uuid.uuid4())
    cur.execute('''
        INSERT INTO predictions (id, timestamp, inputs, prediction, probability, risk_tier, shap_values, resistance_profile)
        VALUES (?,?,?,?,?,?,?,?)
    ''', (
        pred_id,
        datetime.utcnow().isoformat(),
        json.dumps(validated),
        result,
        float(prob),
        risk,
        json.dumps(shap_vals),
        json.dumps(resistance_profile)
    ))
    conn.commit()
    return jsonify({
        'prediction': result,
        'probability': float(prob),
        'risk_tier': risk,
        'shap_values': shap_vals,
        'resistance_profile': resistance_profile,
        'prediction_id': pred_id
    })

@app.route('/history', methods=['GET'])
def history():
    try:
        page = int(request.args.get('page', 1))
        size = int(request.args.get('size', 20))
    except ValueError:
        return jsonify({'error': 'Invalid pagination parameters'}), 400
    offset = (page - 1) * size
    cur.execute('SELECT id, timestamp, inputs, prediction, probability, risk_tier FROM predictions ORDER BY timestamp DESC LIMIT ? OFFSET ?', (size, offset))
    rows = cur.fetchall()
    results = []
    for r in rows:
        results.append({
            'id': r[0],
            'timestamp': r[1],
            'inputs': json.loads(r[2]),
            'prediction': r[3],
            'probability': r[4],
            'risk_tier': r[5]
        })
    return jsonify({'page': page, 'size': size, 'results': results})

@app.route('/analytics', methods=['GET'])
def analytics():
    # Aggregate statistics from predictions table
    cur.execute('SELECT COUNT(*) FROM predictions')
    total_predictions = cur.fetchone()[0]
    # Resistant vs Susceptible counts
    cur.execute('SELECT prediction, COUNT(*) FROM predictions GROUP BY prediction')
    pred_counts = dict(cur.fetchall())
    resistant = pred_counts.get('Resistant', 0)
    susceptible = pred_counts.get('Susceptible', 0)
    # Average WBC count from inputs JSON
    cur.execute('SELECT inputs FROM predictions')
    wbc_values = []
    for (inp_json,) in cur.fetchall():
        try:
            inp = json.loads(inp_json)
            wbc = inp.get('wbc_count')
            if isinstance(wbc, (int, float)):
                wbc_values.append(wbc)
        except Exception:
            continue
    avg_wbc = sum(wbc_values) / len(wbc_values) if wbc_values else 0
    # Gender distribution (0: Male, 1: Female)
    cur.execute('SELECT inputs FROM predictions')
    gender_counts = {0: 0, 1: 0}
    for (inp_json,) in cur.fetchall():
        try:
            inp = json.loads(inp_json)
            g = inp.get('gender')
            if g in gender_counts:
                gender_counts[g] += 1
        except Exception:
            continue
    # Risk distribution
    cur.execute('SELECT risk_tier, COUNT(*) FROM predictions GROUP BY risk_tier')
    risk_dist = dict(cur.fetchall())
    # Most common bacteria placeholder (not stored yet)
    most_common_bacteria = []
    return jsonify({
        'total_predictions': total_predictions,
        'resistant': resistant,
        'susceptible': susceptible,
        'average_wbc': avg_wbc,
        'gender_distribution': gender_counts,
        'risk_distribution': risk_dist,
        'most_common_bacteria': most_common_bacteria
    })

@app.route('/history/<pred_id>', methods=['GET'])
def history_detail(pred_id):
    cur.execute('SELECT * FROM predictions WHERE id = ?', (pred_id,))
    row = cur.fetchone()
    if not row:
        return jsonify({'error': 'Prediction not found'}), 404
    data = {
        'id': row[0],
        'timestamp': row[1],
        'inputs': json.loads(row[2]),
        'prediction': row[3],
        'probability': row[4],
        'risk_tier': row[5],
        'shap_values': json.loads(row[6]),
        'resistance_profile': json.loads(row[7])
    }
    return jsonify(data)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant specializing in antimicrobial resistance (AMR). You help clinicians understand bacteria, symptoms, and antibiotics. Keep your responses concise and professional. Always include a disclaimer that this is for educational purposes and not a substitute for professional medical advice."},
                {"role": "user", "content": user_message}
            ]
        )
        return jsonify({'reply': response.choices[0].message.content})
    except Exception as e:
        print(f"DEBUG: OpenAI Chat Error: {e}")
        
        # Rule-based Fallback
        query = user_message.lower()
        fallback_reply = None
        for key, value in AMR_KNOWLEDGE_BASE.items():
            if key in query:
                fallback_reply = value
                break
        
        if fallback_reply:
            return jsonify({
                'reply': f"(Offline Mode) {fallback_reply}\n\nNote: The AI Assistant is currently in fallback mode due to API limitations."
            })
            
        return jsonify({'error': "The AI service is currently unavailable (Quota Exceeded). Please try asking about specific bacteria like E. coli or MRSA for offline assistance."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
