# AMR-Predict v2.0: Clinical Decision Support for Antimicrobial Resistance

## 🌟 Overview
**AMR-Predict** is an advanced machine learning-based clinical decision support system (CDSS) designed to tackle the global challenge of Antimicrobial Resistance (AMR). The platform enables clinicians to predict the likelihood of bacterial resistance in seconds rather than days, using patient-specific clinical markers.

The project bridges the gap between complex ML models and clinical practice by providing **explainable** results, an **audit trail** of predictions, and a **GPT-powered medical assistant**.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 + Vite (for high-speed development and optimized builds).
- **Styling:** Vanilla CSS & Tailwind CSS (Dark-themed, professional medical UI).
- **Visualization:** Recharts (for SHAP value charts and confidence bars).
- **Icons:** Lucide React.
- **API Communication:** Axios.
- **Routing:** React Router DOM.

### Backend
- **Framework:** Python Flask (Lightweight and extensible API).
- **Machine Learning:** XGBoost Classifier (Optimized gradient boosting).
- **Explainability:** SHAP (TreeExplainer) for per-prediction feature importance.
- **Validation:** Marshmallow (Strict schema enforcement for clinical data).
- **Rate Limiting:** Flask-Limiter (Protection against API abuse).
- **Database:** SQLite3 (Local, lightweight storage for prediction history).
- **AI Integration:** OpenAI GPT-3.5 Turbo (with a custom medical system prompt).

---

## 🧠 Machine Learning & Dataset

### The Dataset
The model is trained on real-world bacterial isolate data:
- **E. coli:** 1000+ cleaned samples (Resistant & Susceptible).
- **Klebsiella pneumoniae:** Multi-drug resistance data.
- **Feature Engineering:** Bacterial labels are correlated with six critical clinical features to simulate a real patient profile.

### Clinical Features (Input Parameters)
| Feature | Type | Range | Description |
| :--- | :--- | :--- | :--- |
| **Age** | Integer | 0-120 | Patient age in years. |
| **Gender** | Binary | 0/1 | 0: Male, 1: Female. |
| **Infection Type** | Integer | 0-2 | 0: E. coli, 1: K. pneumoniae, 2: S. aureus. |
| **Prev. Antibiotic Usage** | Binary | 0/1 | If the patient used antibiotics in the last 90 days. |
| **WBC Count** | Float | 0-100 | White Blood Cell count (x10⁹/L). |
| **Hospitalization Days** | Integer | 0-365 | Total days spent in the hospital. |

### Training Methodology
- **SMOTE:** Applied to handle class imbalance between resistant and susceptible isolates.
- **Stratified 5-Fold CV:** Ensures the model's reliability across different patient cohorts.
- **SHAP Integration:** Every prediction calculates "Shapley values," revealing which features (e.g., high WBC count or age) most influenced the resistance score.

---

## 🛠️ Key Features
1. **Explainable Predictions:** Transparent "Why" behind every result using SHAP.
2. **Risk Stratification:** Categorizes results into Low, Moderate, or High risk tiers.
3. **Analytics Dashboard:** Visualizes overall resistance trends and demographic distributions.
4. **Prediction History:** A secure, searchable log of all clinical assessments.
5. **AI Clinical Assistant:** An interactive chatbot that provides educational info on pathogens and antibiotic protocols.
6. **Rule-Based Fallback:** Ensures the AI assistant remains functional (with a subset of knowledge) even if the primary API is offline.

---

## 📁 Project Directory Structure
```text
├── backend/
│   ├── app.py              # Flask API, Chat logic, & History management
│   ├── train_model.py      # XGBoost training & validation script
│   ├── models/             # Serialized models (.pkl) and metadata
│   └── venv/               # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── pages/          # Home, Predict, History, Analytics, Result
│   │   └── components/     # UI Building blocks (Charts, Cards)
│   └── tailwind.config.js  # UI Theme configuration
├── dataset/                # Cleaned CSV files (Ecoli, Klebsiella)
└── project_overview.md     # Project documentation
```

---

## ⚠️ Clinical Disclaimer
**AMR-Predict is a decision-support tool only.** It is intended to assist, not replace, clinical judgment. All predictions must be reviewed by a qualified healthcare professional. This tool does not constitute medical advice.
