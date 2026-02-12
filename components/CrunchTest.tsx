
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ONOMATOPOEIA_DATA } from '../constants';
import { OnomatopoeiaWord, GameState } from '../types';
import { playOnomatopoeiaSound } from '../services/geminiService';

const CrunchTest: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<GameState>({
    score: 0,
    totalPlayed: 0,
    options: [],
    hasAnswered: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const scrollToTest = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const startNewRound = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ONOMATOPOEIA_DATA.length);
    const correctWord = ONOMATOPOEIA_DATA[randomIndex];
    
    // Get 3 random distractors
    const distractors = ONOMATOPOEIA_DATA
      .filter(w => w.id !== correctWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.word);

    const options = [correctWord.word, ...distractors].sort(() => 0.5 - Math.random());

    setGame(prev => ({
      ...prev,
      currentWord: correctWord,
      options,
      hasAnswered: false,
      isCorrect: undefined
    }));
    
    // Scroll to top when a new round starts (entering game or clicking next)
    setTimeout(scrollToTest, 100);
  }, [scrollToTest]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleSoundPlay = async () => {
    if (!game.currentWord) return;
    setIsLoading(true);
    await playOnomatopoeiaSound(game.currentWord.word);
    setIsLoading(false);
  };

  const handleAnswer = (option: string) => {
    if (game.hasAnswered) return;
    
    const isCorrect = option === game.currentWord?.word;
    setGame(prev => ({
      ...prev,
      hasAnswered: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalPlayed: prev.totalPlayed + 1
    }));

    // Scroll to top upon submitting an answer as requested
    setTimeout(scrollToTest, 100);
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white p-8 rounded-3xl shadow-xl border-4 border-rose-200 max-w-2xl mx-auto scroll-mt-48"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-rose-600 mb-2">The Crunch Test</h2>
        <p className="text-rose-400">Listen to the sound and pick the most accurate word!</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <button
          onClick={handleSoundPlay}
          disabled={isLoading}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
            isLoading ? 'bg-rose-300' : 'bg-rose-500'
          }`}
        >
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>

        <div className="grid grid-cols-2 gap-4 w-full">
          {game.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={game.hasAnswered}
              className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                game.hasAnswered
                  ? option === game.currentWord?.word
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-rose-50 border-rose-200 text-rose-300'
                  : 'bg-white border-rose-100 hover:border-rose-400 text-rose-700 hover:bg-rose-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {game.hasAnswered && (
          <div className="text-center mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className={`text-xl font-bold mb-4 ${game.isCorrect ? 'text-green-600' : 'text-rose-500'}`}>
              {game.isCorrect ? 'Sweet! Correct!' : `Oops! That was '${game.currentWord?.word}'`}
            </p>
            <button
              onClick={startNewRound}
              className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors shadow-md"
            >
              Next Round 🍰
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between w-full text-rose-500 font-bold border-t pt-4">
          <span>Score: {game.score}</span>
          <span>Played: {game.totalPlayed}</span>
        </div>
      </div>
    </div>
  );
};

export default CrunchTest;
