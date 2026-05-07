import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#64748b'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/analytics')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-300">Loading analytics...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const pieData = [
    { name: 'Resistant', value: data.resistant },
    { name: 'Susceptible', value: data.susceptible },
  ];

  const genderData = Object.entries(data.gender_distribution).map(([key, value]) => ({
    name: key === '0' ? 'Male' : 'Female',
    value,
  }));

  const riskData = Object.entries(data.risk_distribution).map(([key, value]) => ({ name: key, value }));

  const bacteriaData = (data.most_common_bacteria || []).map((b, idx) => ({ name: b, value: idx + 1 })); // placeholder

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-slate-200">
      <h1 className="text-4xl font-bold mb-8 text-center">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Predictions */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total Predictions</h2>
          <p className="text-3xl font-bold text-indigo-400">{data.total_predictions}</p>
        </div>
        {/* Average WBC */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Average WBC Count</h2>
          <p className="text-3xl font-bold text-green-400">{data.average_wbc.toFixed(2)}</p>
        </div>
        {/* Resistant vs Susceptible */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Resistance Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Gender Distribution */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} label>
                {genderData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Risk Distribution */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Most Common Bacteria (placeholder) */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg col-span-2 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Most Common Bacteria</h2>
          {bacteriaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bacteriaData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400">No data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
