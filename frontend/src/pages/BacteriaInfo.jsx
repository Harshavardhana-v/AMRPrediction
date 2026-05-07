import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, 
  Thermometer, 
  ShieldCheck, 
  Users, 
  Pill, 
  AlertCircle, 
  X,
  Search,
  ChevronRight
} from 'lucide-react';

const BACTERIA_DATA = [
  {
    id: 'ecoli',
    name: 'Escherichia coli (E. coli)',
    scientificName: 'Escherichia coli',
    risk: 'Medium to High',
    description: 'A diverse group of bacteria normally found in the intestines. While most are harmless, some strains can cause severe illness.',
    symptoms: ['Severe stomach cramps', 'Diarrhea (often bloody)', 'Vomiting', 'Low-grade fever'],
    antibiotics: ['Cephalosporins', 'Fluoroquinolones', 'Nitrofurantoin (for UTIs)'],
    transmission: ['Contaminated food or water', 'Contact with animals', 'Person-to-person spread'],
    prevention: ['Hand washing', 'Proper food cooking', 'Avoiding unpasteurized milk'],
    color: 'emerald'
  },
  {
    id: 'klebsiella',
    name: 'Klebsiella pneumoniae',
    scientificName: 'Klebsiella pneumoniae',
    risk: 'Critical (High)',
    description: 'A type of Gram-negative bacteria that can cause different types of healthcare-associated infections, including pneumonia and bloodstream infections.',
    symptoms: ['Fever', 'Chills', 'Cough', 'Yellow or bloody mucus', 'Shortness of breath'],
    antibiotics: ['Carbapenems (often resistant)', 'Aminoglycosides', 'Polymyxins'],
    transmission: ['Person-to-person (contaminated hands)', 'Medical devices (ventilators, catheters)'],
    prevention: ['Strict hand hygiene', 'Environmental cleaning', 'Infection control in hospitals'],
    color: 'rose'
  },
  {
    id: 'mrsa',
    name: 'MRSA (Staph aureus)',
    scientificName: 'Methicillin-resistant Staphylococcus aureus',
    risk: 'High',
    description: 'A staph bacterium that is resistant to several widely used antibiotics. Common in healthcare settings and the community.',
    symptoms: ['Red, swollen, painful skin bumps', 'Warmth to the touch', 'Pus or drainage', 'Fever'],
    antibiotics: ['Vancomycin', 'Linezolid', 'Daptomycin'],
    transmission: ['Direct contact with infected skin', 'Shared personal items (towels, razors)', 'Contaminated surfaces'],
    prevention: ['Cleaning wounds', 'Hand hygiene', 'Not sharing personal items'],
    color: 'amber'
  },
  {
    id: 'pseudomonas',
    name: 'Pseudomonas aeruginosa',
    scientificName: 'Pseudomonas aeruginosa',
    risk: 'High',
    description: 'An opportunistic pathogen known for its multi-drug resistance and association with serious illnesses, especially in hospitalized patients.',
    symptoms: ['Ear pain/drainage', 'Skin rashes', 'Eye pain/redness', 'Pneumonia (cough, fever)'],
    antibiotics: ['Piperacillin-Tazobactam', 'Ceftazidime', 'Ciprofloxacin'],
    transmission: ['Contaminated water', 'Soil', 'Medical equipment'],
    prevention: ['Proper pool/hot tub maintenance', 'Sterilizing medical equipment'],
    color: 'indigo'
  },
  {
    id: 'acinetobacter',
    name: 'Acinetobacter baumannii',
    scientificName: 'Acinetobacter baumannii',
    risk: 'Critical',
    description: 'Often called "Iraqibacter," this organism is highly resilient and survives for long periods on environmental surfaces.',
    symptoms: ['Fever', 'Red/swollen skin', 'Cloudy urine', 'Chest pain/cough'],
    antibiotics: ['Carbapenems', 'Colistin', 'Tigecycline'],
    transmission: ['Direct contact with surfaces', 'Person-to-person spread'],
    prevention: ['Rigorous hospital sanitation', 'Contact precautions'],
    color: 'cyan'
  }
];

const COLOR_MAP = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    textLight: 'text-emerald-300',
    bgLight: 'bg-emerald-500/20',
    gradient: 'from-emerald-600/30',
    dot: 'bg-emerald-400/50'
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    textLight: 'text-rose-300',
    bgLight: 'bg-rose-500/20',
    gradient: 'from-rose-600/30',
    dot: 'bg-rose-400/50'
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    textLight: 'text-amber-300',
    bgLight: 'bg-amber-500/20',
    gradient: 'from-amber-600/30',
    dot: 'bg-amber-400/50'
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    textLight: 'text-indigo-300',
    bgLight: 'bg-indigo-500/20',
    gradient: 'from-indigo-600/30',
    dot: 'bg-indigo-400/50'
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    textLight: 'text-cyan-300',
    bgLight: 'bg-cyan-500/20',
    gradient: 'from-cyan-600/30',
    dot: 'bg-cyan-400/50'
  }
};

export default function BacteriaInfo() {
  const [selectedBacteria, setSelectedBacteria] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBacteria = BACTERIA_DATA.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Microbial <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Knowledge Base</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explore detailed information about common pathogens and their impact on clinical care and antibiotic resistance.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
          type="text"
          placeholder="Search bacteria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 backdrop-blur-xl transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBacteria.map((bacteria) => {
          const colors = COLOR_MAP[bacteria.color];
          return (
            <motion.div
              key={bacteria.id}
              layoutId={bacteria.id}
              onClick={() => setSelectedBacteria(bacteria)}
              whileHover={{ y: -5 }}
              className="group cursor-pointer bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Dna className={`w-6 h-6 ${colors.text}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{bacteria.name}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-6">{bacteria.description}</p>
              <div className="flex items-center text-indigo-400 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedBacteria && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBacteria(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              layoutId={selectedBacteria.id}
              className="fixed inset-x-6 inset-y-12 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#0b0f1a] border border-slate-800 rounded-[2.5rem] z-[101] overflow-hidden shadow-2xl"
            >
              <div className="h-full overflow-y-auto custom-scrollbar">
                {/* Header Image/Gradient */}
                <div className={`h-48 bg-gradient-to-br ${COLOR_MAP[selectedBacteria.color].gradient} to-indigo-600/10 relative`}>
                  <button 
                    onClick={() => setSelectedBacteria(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-6 left-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-3 py-1 rounded-full ${COLOR_MAP[selectedBacteria.color].bgLight} border ${COLOR_MAP[selectedBacteria.color].border} ${COLOR_MAP[selectedBacteria.color].textLight} text-xs font-bold`}>
                        {selectedBacteria.risk} Risk
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-white">{selectedBacteria.name}</h2>
                    <p className="text-slate-400 italic text-sm">{selectedBacteria.scientificName}</p>
                  </div>
                </div>

                <div className="p-8 space-y-10">
                  <section>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {selectedBacteria.description}
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Symptoms */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white font-bold">
                        <Thermometer className="w-5 h-5 text-rose-400" />
                        Symptoms
                      </div>
                      <ul className="space-y-2">
                        {selectedBacteria.symptoms.map((s, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400/50 mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Antibiotics */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white font-bold">
                        <Pill className="w-5 h-5 text-indigo-400" />
                        Common Antibiotics
                      </div>
                      <ul className="space-y-2">
                        {selectedBacteria.antibiotics.map((s, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Transmission */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white font-bold">
                        <Users className="w-5 h-5 text-cyan-400" />
                        Transmission Mode
                      </div>
                      <ul className="space-y-2">
                        {selectedBacteria.transmission.map((s, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white font-bold">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        Prevention Methods
                      </div>
                      <ul className="space-y-2">
                        {selectedBacteria.prevention.map((s, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-amber-400 font-bold text-sm mb-1">Resistance Warning</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Antibiotic resistance is a growing threat. These treatments are general guidelines and may not be effective against resistant strains. Consult the prediction model for risk assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
