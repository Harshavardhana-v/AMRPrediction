import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, Thermometer, User, Beaker, Clock, AlertTriangle } from 'lucide-react';

export default function Predict() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    age: 45,
    gender: 0,
    infection_type: 0,
    prev_antibiotic_usage: 0,
    wbc_count: 12.0,
    hospitalization_days: 2
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Typically the Flask app runs on 5000 in dev
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      navigate('/result', { 
        state: { 
          prediction: response.data.prediction, 
          probability: response.data.probability, 
          risk_tier: response.data.risk_tier,
          inputs: formData 
        } 
      });
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the backend ML service. Ensure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
          Patient Clinical Data Form
        </h2>
        <p className="text-slate-400 mt-2">Enter patient vitals and history to predict Antimicrobial Resistance.</p>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Age */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <User className="w-4 h-4 text-cyan-400" /> Patient Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0" max="120"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <User className="w-4 h-4 text-cyan-400" /> Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none"
              >
                <option value={0}>Male</option>
                <option value={1}>Female</option>
              </select>
            </div>

            {/* Infection Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Beaker className="w-4 h-4 text-emerald-400" /> Infection Type
              </label>
              <select
                name="infection_type"
                value={formData.infection_type}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
              >
                <option value={0}>E. coli</option>
                <option value={1}>K. pneumoniae</option>
                <option value={2}>S. aureus</option>
              </select>
            </div>

            {/* Previous Antibiotic Usage */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <AlertTriangle className="w-4 h-4 text-yellow-500" /> Previous Antibiotics?
              </label>
              <select
                name="prev_antibiotic_usage"
                value={formData.prev_antibiotic_usage}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all appearance-none"
              >
                <option value={0}>No</option>
                <option value={1}>Yes (within last 90 days)</option>
              </select>
            </div>

            {/* WBC Count */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Activity className="w-4 h-4 text-red-400" /> WBC Count (x10^9/L)
              </label>
              <input
                type="number"
                name="wbc_count"
                value={formData.wbc_count}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                required
              />
            </div>

            {/* Hospitalization Days */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock className="w-4 h-4 text-indigo-400" /> Hospitalization Days
              </label>
              <input
                type="number"
                name="hospitalization_days"
                value={formData.hospitalization_days}
                onChange={handleChange}
                min="0"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="pt-6 border-t border-slate-700/50 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-medium text-white shadow-lg transition-all
                ${loading 
                  ? 'bg-indigo-500/50 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95'
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-inherit border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : 'Run ML Prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
