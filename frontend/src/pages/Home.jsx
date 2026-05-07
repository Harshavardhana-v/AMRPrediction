import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Zap, ArrowRight, Dna } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-20 lg:py-32">
      
      {/* Premium Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl w-full flex flex-col items-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-md"
        >
          <Dna className="w-4 h-4" /> Machine Learning for Healthcare
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-8">
          Defeat Superbugs with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.2)]">
            Predictive Intelligence
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Analyze clinical patient data instantly. Our AI predicts Antimicrobial Resistance (AMR) with high confidence, transforming a 72-hour process into a 2-second decision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/predict')}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all duration-500 w-full sm:w-auto"
          >
            <span className="relative z-10 text-lg">Start Prediction</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#features"
            className="flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-300 rounded-full border border-slate-700/50 hover:bg-slate-800/50 backdrop-blur-sm transition-colors w-full sm:w-auto"
          >
            Learn More
          </motion.a>
        </div>
      </motion.div>

      {/* Exquisite Features Grid */}
      <motion.div 
        id="features"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32"
      >
        {[
          { icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", title: "Lightning Fast", text: "Instant predictive results bypassing the traditional 24-72 hour waiting period for cultures." },
          { icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", title: "EHR Integrated", text: "Uses standard clinical variables readily available in patient electronic health records." },
          { icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", title: "Combat AMR", text: "Reduces empiric antibiotic misuse, preventing the escalation of superbug resistance." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -10 }}
            className={`flex flex-col items-center text-center p-8 rounded-3xl bg-[#090b14]/50 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:${feature.border} transition-all duration-500`}
          >
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-${feature.color.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className={`p-4 rounded-2xl ${feature.bg} mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.text}</p>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
