
import React, { useState, useEffect, useRef } from 'react';
import NanDingMascot from './components/NanDingMascot';
import CrunchTest from './components/CrunchTest';
import { ONOMATOPOEIA_DATA } from './constants';
import { Category } from './types';
import { playOnomatopoeiaSound } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'game'>('learn');
  const [bites, setBites] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const biteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ['All', ...Object.values(Category)];

  const filteredWords = ONOMATOPOEIA_DATA.filter(w => {
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBite = () => {
    setBites(prev => (prev >= 4 ? 1 : prev + 1));
    
    // Auto-heal logic: Reset bites to 0 after 2 seconds
    if (biteTimeoutRef.current) {
      clearTimeout(biteTimeoutRef.current);
    }
    biteTimeoutRef.current = setTimeout(() => {
      setBites(0);
    }, 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (biteTimeoutRef.current) clearTimeout(biteTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen pb-16 relative selection:bg-rose-200 selection:text-rose-900 bg-[#fff1f2]">
      {/* Background Sprinkles Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden -z-10">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 16 + 4 + 'px',
              backgroundColor: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'][Math.floor(Math.random() * 4)],
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Slimmer Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-xl z-40 border-b-4 border-rose-100 py-2 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black text-rose-600 tracking-tighter drop-shadow-sm flex items-center justify-center md:justify-start gap-2">
              Cupcake <span className="text-rose-400">Clatter</span>
            </h1>
            <p className="text-rose-400 font-bold text-xs md:text-sm tracking-wide">
              A Scrummy Guide to Onomatopoeia 🍰
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <NanDingMascot bites={bites} onBite={handleBite} />
          </div>

          <nav className="flex gap-1 p-1 bg-rose-50 rounded-full border-2 border-rose-100">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-6 py-2 rounded-full font-black text-sm transition-all transform ${
                activeTab === 'learn' ? 'bg-rose-500 text-white shadow-md scale-105' : 'text-rose-400 hover:text-rose-600 hover:bg-rose-100/50'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`px-6 py-2 rounded-full font-black text-sm transition-all transform ${
                activeTab === 'game' ? 'bg-rose-500 text-white shadow-md scale-105' : 'text-rose-400 hover:text-rose-600 hover:bg-rose-100/50'
              }`}
            >
              Crunch Test
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'learn' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Slimmer Search and Filter */}
            <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-rose-50 flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Find a sound..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-rose-50/50 border-2 border-transparent focus:border-rose-400 focus:bg-white focus:outline-none text-rose-700 placeholder-rose-300 font-bold text-base transition-all shadow-inner"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="relative w-full sm:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-3 px-6 rounded-2xl bg-rose-50 border-2 border-transparent focus:border-rose-400 focus:outline-none text-rose-700 font-black text-sm appearance-none cursor-pointer shadow-inner"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Word Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWords.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-white p-6 rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-300 border-2 border-rose-50 hover:border-rose-200 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-200 inline-block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-2xl font-black text-rose-700 group-hover:text-rose-500 transition-colors tracking-tight">
                        {item.word}
                      </h3>
                    </div>
                    <button
                      onClick={() => playOnomatopoeiaSound(item.word)}
                      className="w-10 h-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm group-hover:rotate-6 flex items-center justify-center border border-rose-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-rose-900 font-bold text-base mb-4 italic leading-tight flex-grow">
                    "{item.meaning}"
                  </p>
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                    <p className="text-rose-600 text-xs leading-relaxed">
                      <strong className="text-rose-800 font-black uppercase text-[9px] tracking-widest block mb-0.5">Example:</strong>
                      {item.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-rose-100 flex flex-col items-center justify-center">
                <p className="text-rose-300 text-xl font-black">No sounds found! 🧁</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CrunchTest />
          </div>
        )}
      </main>

      {/* Slimmer Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-rose-100 py-3 px-6 z-50 flex justify-center items-center shadow-inner">
        <p className="text-rose-400 font-black tracking-widest text-[10px] flex items-center gap-2 uppercase">
          baked with sprinkles by <span className="text-rose-600 font-black">Shalaka Kashikar</span> 🧁
        </p>
      </footer>
    </div>
  );
};

export default App;
