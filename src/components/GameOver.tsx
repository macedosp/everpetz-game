import React from 'react';
import { Trophy, ShoppingBag, RotateCcw } from 'lucide-react';

interface GameOverProps {
  score: number;
  petName: string;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, petName, onRestart }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center animate-pop-in">
      
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Trophy className="w-24 h-24 text-yellow-500 relative z-10" />
      </div>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Fim de Jogo!</h2>
      <p className="text-gray-600 mb-6">
        Você tem reflexos incríveis para encontrar o {petName}!
      </p>

      <div className="bg-orange-100 p-6 rounded-2xl w-full mb-8">
        <p className="text-sm text-orange-800 font-bold uppercase tracking-wider">Pontuação Final</p>
        <p className="text-5xl font-black text-orange-600">{score}</p>
      </div>

      <div className="w-full space-y-3">
        <a 
          href="https://www.everpetzstore.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 transform hover:-translate-y-1"
        >
          <ShoppingBag className="w-5 h-5" />
          Ver ofertas para {petName}
        </a>

        <button
          onClick={onRestart}
          className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default GameOver;