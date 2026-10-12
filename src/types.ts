export type SquareType = 'start' | 'finish' | 'question' | 'challenge' | 'ladder' | 'snake' | 'bonus' | 'normal';

export interface BoardSquare {
  number: number;
  type: SquareType;
  color: string;
  label?: string;
  target?: number; // For ladder (up) or snake (down)
  description?: string;
}

export type WordTopic =
  | 'Bold'
  | 'Italic'
  | 'Underline'
  | 'Bullets'
  | 'Numbering'
  | 'Page Border Art'
  | 'Insert Picture'
  | 'Insert Symbol'
  | 'Align Left'
  | 'Center'
  | 'Align Right'
  | 'Justify'
  | 'Font'
  | 'Font Size';

export interface Question {
  id: string;
  topic: WordTopic;
  question: string;
  options: string[]; // 4 options
  correctIndex: number;
  explanation: string;
  iconName: string;
  difficulty?: 'mudah';
}

export interface Challenge {
  id: string;
  topic: WordTopic;
  title: string;
  instruction: string;
  keyPoints: string[];
  iconName: string;
}

export interface PairPlayer {
  student1: string;
  student2: string;
}

export interface TurnRecord {
  pair: PairPlayer;
  diceRoll: number;
  fromSquare: number;
  intermediateSquare: number;
  finalSquare: number;
  specialEvent?: 'ladder' | 'snake' | 'none';
  questionOrChallenge: {
    type: 'question' | 'challenge';
    text: string;
    topic: WordTopic;
    isCorrect: boolean;
    explanation: string;
    studentAnswerText?: string;
  };
  timestamp: Date;
}
