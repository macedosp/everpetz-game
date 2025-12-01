import React, { useState } from 'react';
import { PetProfile, PetType, PetSize, PetStage } from '../types';
import { Dog, Cat, ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: PetProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [hasPet, setHasPet] = useState<boolean | null>(null);
  const [petType, setPetType] = useState<PetType>('dog'); // Default
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petSize, setPetSize] = useState<PetSize>('medium');
  const [petStage, setPetStage] = useState<PetStage>('adult');

  const handleNext = () => {
    // Finalization logic based on path
    if (step === 1 && hasPet === false) {
      // User has no pet, goes to preference selection then finishes
      setStep(10); // Special step for "No pet" preference
      return;
    }
    
    if (step === 1 && hasPet === true) {
      setStep(2);
      return;
    }

    if (step === 10) {
       // Completed via "No Pet" path
       onComplete({
           hasPet: false,
           type: petType,
           name: 'Seu futuro amigo',
           size: 'medium',
           stage: 'adult'
       });
       return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      // Completed via "Has Pet" path
      onComplete({
        hasPet: true,
        type: petType,
        name: petName || (petType === 'dog' ? 'Totó' : 'Miau'),
        breed: petBreed,
        size: petSize,
        stage: petStage
      });
    }
  };

  // Render Step 1: Has Pet?
  if (step === 1) {
    return (
      <div className="flex flex-col h-full animate-pop-in">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-900">Você tem um pet?</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setHasPet(true)}
            className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
              hasPet === true ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
            }`}
          >
            <span className="text-lg font-bold">Sim, tenho!</span>
            {hasPet === true && <Check className="text-orange-500" />}
          </button>
          <button
            onClick={() => setHasPet(false)}
            className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
              hasPet === false ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
            }`}
          >
            <span className="text-lg font-bold">Ainda não</span>
            {hasPet === false && <Check className="text-orange-500" />}
          </button>
        </div>
        <div className="flex-grow"></div>
        <button
          disabled={hasPet === null}
          onClick={handleNext}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          Continuar <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  // Render Step 10: No Pet - Preference
  if (step === 10) {
    return (
      <div className="flex flex-col h-full animate-pop-in">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-900">Qual você prefere?</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPetType('dog')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              petType === 'dog' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <Dog size={48} className={petType === 'dog' ? 'text-orange-500' : 'text-gray-400'} />
            <span className="font-bold">Cachorros</span>
          </button>
          <button
            onClick={() => setPetType('cat')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              petType === 'cat' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <Cat size={48} className={petType === 'cat' ? 'text-orange-500' : 'text-gray-400'} />
            <span className="font-bold">Gatos</span>
          </button>
        </div>
        <div className="flex-grow"></div>
        <button
          onClick={handleNext}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all"
        >
          Começar Jogo
        </button>
      </div>
    );
  }

  // Render Step 2: Choose Type (If has pet)
  if (step === 2) {
    return (
      <div className="flex flex-col h-full animate-pop-in">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-900">É Cachorro ou Gato?</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPetType('dog')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              petType === 'dog' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <Dog size={48} className={petType === 'dog' ? 'text-orange-500' : 'text-gray-400'} />
            <span className="font-bold">Cachorro</span>
          </button>
          <button
            onClick={() => setPetType('cat')}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              petType === 'cat' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <Cat size={48} className={petType === 'cat' ? 'text-orange-500' : 'text-gray-400'} />
            <span className="font-bold">Gato</span>
          </button>
        </div>
        <div className="flex-grow"></div>
        <button
          onClick={handleNext}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all"
        >
          Próximo
        </button>
      </div>
    );
  }

  // Render Step 3: Details
  return (
    <div className="flex flex-col h-full animate-pop-in">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-900">Conte mais sobre {petType === 'dog' ? 'o cachorro' : 'o gato'}</h2>
      
      <div className="space-y-4 overflow-y-auto pr-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="Ex: Rex"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Raça (Opcional)</label>
          <input
            type="text"
            value={petBreed}
            onChange={(e) => setPetBreed(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Ex: Vira-lata"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idade / Estágio</label>
          <div className="flex gap-2">
            {(['puppy', 'adult', 'senior'] as PetStage[]).map((s) => (
              <button
                key={s}
                onClick={() => setPetStage(s)}
                className={`flex-1 py-2 px-1 text-xs sm:text-sm rounded-lg border transition-all ${
                  petStage === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {s === 'puppy' ? 'Filhote' : s === 'adult' ? 'Adulto' : 'Sênior'}
              </button>
            ))}
          </div>
        </div>

        {petType === 'dog' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Porte</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as PetSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setPetSize(s)}
                  className={`flex-1 py-2 px-1 text-xs sm:text-sm rounded-lg border transition-all ${
                    petSize === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {s === 'small' ? 'Pequeno' : s === 'medium' ? 'Médio' : 'Grande'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={!petName}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all"
      >
        Jogar Agora!
      </button>
    </div>
  );
};

export default Onboarding;