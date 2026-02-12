
export interface OnomatopoeiaWord {
  id: number;
  word: string;
  meaning: string;
  example: string;
  category: string;
}

export enum Category {
  ANIMALS = "Animal Noises",
  COLLISION = "Collision or Explosive Sounds",
  MUSICAL = "Musical Sounds",
  WATER_AIR_OBJECTS = "Movement of Water, Air, or Objects",
  HUMAN = "Human Sounds",
  MISC = "Miscellaneous"
}

export interface GameState {
  score: number;
  totalPlayed: number;
  currentWord?: OnomatopoeiaWord;
  options: string[];
  isCorrect?: boolean;
  hasAnswered: boolean;
}
