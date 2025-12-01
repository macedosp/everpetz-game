export type Screen = 'LOGIN' | 'ONBOARDING' | 'GAME' | 'GAMEOVER';

export type PetType = 'dog' | 'cat';
export type PetSize = 'small' | 'medium' | 'large';
export type PetStage = 'puppy' | 'adult' | 'senior';

export interface User {
  name: string;
  email: string;
}

export interface PetProfile {
  hasPet: boolean;
  type: PetType;
  name: string;
  breed?: string;
  size?: PetSize;
  stage?: PetStage;
}

export interface GameState {
  level: number;
  score: number;
  maxLevels: number;
}