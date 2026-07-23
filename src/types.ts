export type QuestionKind = 'number' | 'choice';

export interface ChoiceOption {
  id: string;
  label: string;
  latex?: string;
}

export interface Question {
  id: string;
  roomId: number;
  lesson: number;
  concept: string;
  title: string;
  prompt: string;
  latex: string;
  kind: QuestionKind;
  expected: number | string;
  tolerance?: number;
  options?: ChoiceOption[];
  hint: string;
  solutionTitle: string;
  solutionSteps: string[];
  explanation: string;
  environmentSuccess: string;
  environmentFailure: string;
}

export interface Spirit {
  id: string;
  roomId: number;
  name: string;
  epithet: string;
  message: string;
}

export interface RoomDefinition {
  id: number;
  name: string;
  lessons: string;
  description: string;
  objective: string;
  entryNarration: string[];
  questionIds: string[];
  spiritId?: string;
  nodeLabels: string[];
  accent: string;
}

export type AchievementId =
  | 'flawless'
  | 'intellect'
  | 'overachiever'
  | 'speedrunner'
  | 'soul-saver'
  | 'skys-the-limit'
  | 'leibnizs-lament';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
}

export type EndingId = 'true-escape' | 'hollow-escape' | 'lost-soul' | null;

export interface SettingsState {
  masterVolume: number;
  reducedMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
}

export interface GameState {
  version: 1;
  started: boolean;
  completed: boolean;
  roomIndex: number;
  nodeIndex: number;
  solvedQuestionIds: string[];
  attempts: Record<string, number>;
  wrongCounts: Record<string, number>;
  hintUsedIds: string[];
  spiritsRescued: string[];
  spiritsResolved: string[];
  completedRooms: number[];
  score: number;
  fear: number;
  timeRemainingSeconds: number;
  elapsedSeconds: number;
  achievements: AchievementId[];
  ending: EndingId;
  settings: SettingsState;
}

export interface AnswerCheck {
  valid: boolean;
  correct: boolean;
  message?: string;
}

export const TOTAL_TIME_SECONDS = 30 * 60;
export const MAX_SCORE = 3800;
export const SPEEDRUN_SECONDS = TOTAL_TIME_SECONDS / 2;

export const SCORE = {
  CORRECT: 100,
  FIRST_ATTEMPT: 50,
  ROOM_COMPLETE: 250,
  HINT: -50,
  WRONG: -25,
} as const;

export const FEAR = {
  WRONG_ANSWER: 14,
  CAPTURE_THRESHOLD: 100,
  CAPTURE_RESET: 64,
  CAPTURE_TIME_PENALTY: 60,
  ROOM_RECOVERY: -8,
  CORRECT_RECOVERY: -4,
  TRUE_ENDING_MAX: 50,
} as const;
