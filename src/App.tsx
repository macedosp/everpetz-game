import React, { useState, useEffect } from 'react';
import type { Screen, User, PetProfile } from './types';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Game from './components/Game';
import GameOver from './components/GameOver';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);

  // Initialize from local storage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('everpetz_user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // If we have a user but no pet profile, go to onboarding. 
      // If we have both, user can choose to start game directly, but for this flow we start fresh logic.
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('everpetz_user', JSON.stringify(newUser));
    setCurrentScreen('ONBOARDING');
  };

  const handleOnboardingComplete = (profile: PetProfile) => {
    setPetProfile(profile);
    localStorage.setItem('everpetz_pet', JSON.stringify(profile));
    setCurrentScreen('GAME');
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setCurrentScreen('GAMEOVER');
  };

  const handleRestart = () => {
    setFinalScore(0);
    setCurrentScreen('GAME');
  };

  return (
    <Layout>
      {currentScreen === 'LOGIN' && (
        <Login onLogin={handleLogin} />
      )}
      {currentScreen === 'ONBOARDING' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'GAME' && user && petProfile && (
        <Game 
          petProfile={petProfile} 
          onGameOver={handleGameOver} 
        />
      )}
      {currentScreen === 'GAMEOVER' && petProfile && (
        <GameOver 
          score={finalScore} 
          petName={petProfile.name} 
          onRestart={handleRestart}
        />
      )}
    </Layout>
  );
};

export default App;