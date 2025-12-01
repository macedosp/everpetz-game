import React, { useState, useEffect, useCallback } from 'react';
import { PetProfile } from '../types';
import { TARGET_EMOJIS, DISTRACTOR_EMOJIS, SUCCESS_MESSAGES, INITIAL_TIME, SCORE_PER_LEVEL } from '../constants';
import { Play } from 'lucide-react';

interface GameProps {
  petProfile: PetProfile;
  onGameOver: (score: number) => void;
}

interface GridItem {
  id: number;
  emoji: string;
  isTarget: boolean;
}

const Game: React.FC<GameProps> = ({ petProfile, onGameOver }) => {
  // Game State
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  
  // Control State
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Initialize the specific target emoji once and keep it for the whole game
  const [targetEmoji] = useState<string>(() => {
    const options = petProfile.type === 'dog' ? TARGET_EMOJIS.dog : TARGET_EMOJIS.cat;
    return options[Math.floor(Math.random() * options.length)];
  });

  // Calculate Grid Size based on level (2x2 up to 6x6)
  const getGridSize = (lvl: number) => Math.min(2 + Math.floor((lvl - 1) / 2), 5);

  const generateLevel = useCallback(() => {
    const size = getGridSize(level);
    const totalCells = size * size;
    
    // Pick random distractors
    const newGrid: GridItem[] = [];
    
    // Add target (fixed emoji)
    const targetIndex = Math.floor(Math.random() * totalCells);

    for (let i = 0; i < totalCells; i++) {
      if (i === targetIndex) {
        newGrid.push({ id: i, emoji: targetEmoji, isTarget: true });
      } else {
        let distractor = DISTRACTOR_EMOJIS[Math.floor(Math.random() * DISTRACTOR_EMOJIS.length)];
        // Ensure distractor isn't the target
        while(distractor === targetEmoji) {
           distractor = DISTRACTOR_EMOJIS[Math.floor(Math.random() * DISTRACTOR_EMOJIS.length)];
        }
        newGrid.push({ id: i, emoji: distractor, isTarget: false });
      }
    }
    
    setGrid(newGrid);
    // Reset time with a little bonus for higher levels, but capping it
    setTimeLeft(Math.max(3, INITIAL_TIME - (level * 0.5))); 
    setMessage(null);
  }, [level, targetEmoji]);

  // Initial Load of Grid
  useEffect(() => {
    if (isGameStarted) {
      generateLevel();
    }
  }, [isGameStarted, generateLevel]);

  // Timer Logic
  useEffect(() => {
    if (!isGameStarted || message !== null) return; // Don't run timer if not started or showing success message

    if (timeLeft <= 0) {
      onGameOver(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score, isGameStarted, message]);

  // Web Audio API implementation
  const playSound = (type: 'success' | 'error') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); // C6
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        oscillator.start(now);
        oscillator.stop(now + 0.4);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleCardClick = (isTarget: boolean) => {
    if (isTarget) {
      playSound('success');
      const timeBonus = Math.ceil(timeLeft) * 10;
      const levelScore = SCORE_PER_LEVEL + timeBonus;
      setScore((prev) => prev + levelScore);
      
      const randomMsg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
      setMessage(randomMsg);

      // Short delay before next level
      setTimeout(() => {
        setLevel((prev) => prev + 1);
      }, 800);
    } else {
      playSound('error');
      setIsWrong(true);
      setTimeLeft((prev) => Math.max(0, prev - 2)); // Penalty
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const gridSize = getGridSize(level);

  // PRE-GAME SCREEN: Present the chosen pet
  if (!isGameStarted) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center animate-pop-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Prepare-se!</h2>
        
        <div className="bg-orange-100 rounded-full p-8 mb-6 shadow-inner ring-4 ring-orange-200">
          <span className="text-8xl">{targetEmoji}</span>
        </div>
        
        <p className="text-xl text-gray-600 mb-2">Encontre o(a)</p>
        <h3 className="text-3xl font-extrabold text-blue-600 mb-8">{petProfile.name}</h3>
        
        <button
          onClick={() => {
            playSound('success');
            setIsGameStarted(true);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 transform hover:-translate-y-1"
        >
          <Play fill="currentColor" />
          Começar
        </button>
      </div>
    );
  }

  // SUCCESS MESSAGE BETWEEN LEVELS
  if (message) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-pop-in">
        <div className="text-8xl mb-6">{targetEmoji}</div>
        <h2 className="text-3xl font-extrabold text-orange-500 text-center animate-bounce">{message}</h2>
        <p className="text-blue-900 font-bold mt-4 text-xl">Nível {level} Completo!</p>
      </div>
    );
  }

  // MAIN GAME LOOP
  return (
    <div className={`flex flex-col h-full ${isWrong ? 'shake' : ''}`}>
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 select-none">
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
          Nível {level}
        </div>
        <div className="font-bold text-xl text-gray-700">
          {score} pts
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center mb-4 select-none">
        <p className="text-gray-600 text-lg">
          Cadê o <span className="font-bold text-orange-600">{petProfile.name}</span>? {targetEmoji}
        </p>
      </div>

      {/* Grid */}
      <div 
        className="grid gap-2 sm:gap-4 flex-grow content-center"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          maxWidth: '400px',
          margin: '0 auto'
        }}
      >
        {grid.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item.isTarget)}
            className="aspect-square bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-4xl sm:text-5xl shadow-sm border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all select-none"
          >
            {item.emoji}
          </button>
        ))}
      </div>

      {/* Timer Bar */}
      <div className="mt-6 w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${timeLeft < 3 ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${(timeLeft / (Math.max(3, INITIAL_TIME - (level * 0.5)))) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Game;