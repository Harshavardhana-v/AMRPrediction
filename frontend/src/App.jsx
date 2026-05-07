import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Result from './pages/Result';
import BacteriaInfo from './pages/BacteriaInfo';
import Chatbot from './components/Chatbot';
import { Activity } from 'lucide-react';

function App() {
  return (
    <Router>
      <Chatbot />
      <div className="relative min-h-screen bg-[#030712] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
        
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 min-h-screen pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>

        {/* Global Navbar */}
        <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-800/50 bg-[#030712]/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
                AMR-Predict
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link>
              <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/bacteria-info" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Bacteria Info</Link>
              <Link to="/predict" className="text-sm font-medium px-5 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all text-slate-300">Predict Now</Link>
            </nav>
          </div>
        </header>

        {/* Dynamic Main Content Container */}
        <main className="relative z-10 w-full min-h-screen pt-20 flex flex-col items-center justify-center px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bacteria-info" element={<BacteriaInfo />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="relative z-10 border-t border-slate-800/30 bg-[#030712]/50 backdrop-blur py-8 mt-auto w-full">
          <div className="max-w-7xl mx-auto px-6 flex justify-center text-sm font-medium text-slate-600">
            © 2026 AMR-Predict Intelligence System. All Rights Reserved.
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
