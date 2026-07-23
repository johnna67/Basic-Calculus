import { QUESTION_BY_ID } from './questions';
import { ROOMS } from './content';
import {
  FEAR, MAX_SCORE, SCORE, SPEEDRUN_SECONDS, TOTAL_TIME_SECONDS,
  type AchievementId, type AnswerCheck, type GameState, type Question, type SettingsState,
} from './types';

const SAVE_KEY = 'infinite-loop-no-escape-save-v1';
const SETTINGS_KEY = 'infinite-loop-no-escape-settings-v1';

export const DEFAULT_SETTINGS: SettingsState = {
  masterVolume: 0.65,
  reducedMotion: false,
  highContrast: false,
  largerText: false,
};

export function createInitialState(settings: SettingsState = DEFAULT_SETTINGS): GameState {
  return {
    version: 1,
    started: false,
    completed: false,
    roomIndex: 0,
    nodeIndex: 0,
    solvedQuestionIds: [],
    attempts: {},
    wrongCounts: {},
    hintUsedIds: [],
    spiritsRescued: [],
    spiritsResolved: [],
    completedRooms: [],
    score: 0,
    fear: 0,
    timeRemainingSeconds: TOTAL_TIME_SECONDS,
    elapsedSeconds: 0,
    achievements: [],
    ending: null,
    settings: { ...settings },
  };
}

export function parseNumericAnswer(raw: string): number | null {
  const value = raw.trim().toLowerCase().replace(/[−–—]/g, '-').replace(/,/g, '').replace(/\s+/g, '');
  if (!value) return null;
  if (['∞', '+∞', 'inf', '+inf', 'infinity', '+infinity'].includes(value)) return Number.POSITIVE_INFINITY;
  if (['-∞', '-inf', '-infinity'].includes(value)) return Number.NEGATIVE_INFINITY;
  const fraction = value.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\/([+-]?(?:\d+(?:\.\d+)?|\.\d+))$/);
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
    return numerator / denominator;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function checkAnswer(question: Question, raw: string): AnswerCheck {
  if (question.kind === 'choice') {
    if (!raw.trim()) return { valid: false, correct: false, message: 'Select an answer first.' };
    return { valid: true, correct: raw.trim() === String(question.expected) };
  }
  const parsed = parseNumericAnswer(raw);
  if (parsed === null) {
    return { valid: false, correct: false, message: 'Enter a number, decimal, or fraction such as 5/2.' };
  }
  const expected = Number(question.expected);
  const tolerance = question.tolerance ?? 0.0001;
  return { valid: true, correct: Math.abs(parsed - expected) <= tolerance };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export class GameStore {
  private state: GameState;
  private listeners = new Set<(state: GameState) => void>();

  constructor() {
    this.state = this.load() ?? createInitialState(this.loadSettings());
  }

  get snapshot(): GameState {
    return structuredClone(this.state);
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  hasSave(): boolean {
    return this.state.started;
  }

  startNewGame(): void {
    const settings = { ...this.state.settings };
    this.state = createInitialState(settings);
    this.state.started = true;
    this.persist();
  }

  clearSave(): void {
    localStorage.removeItem(SAVE_KEY);
    this.state = createInitialState(this.state.settings);
    this.emit();
  }

  updateSettings(settings: Partial<SettingsState>): void {
    this.state.settings = { ...this.state.settings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.state.settings));
    this.persist();
  }

  setNode(nodeIndex: number): void {
    this.state.nodeIndex = Math.max(0, nodeIndex);
    this.persist();
  }

  tick(seconds: number): void {
    if (!this.state.started || this.state.completed || seconds <= 0) return;
    this.state.timeRemainingSeconds = Math.max(0, this.state.timeRemainingSeconds - seconds);
    this.state.elapsedSeconds += seconds;
    if (this.state.timeRemainingSeconds <= 0) {
      this.state.completed = true;
      this.state.ending = 'lost-soul';
      this.updateAchievements();
    }
    this.persist();
  }

  submitAnswer(questionId: string, raw: string): {
    valid: boolean; correct: boolean; firstAttempt: boolean; scoreDelta: number; captured: boolean; message?: string;
  } {
    const question = QUESTION_BY_ID[questionId];
    if (!question) return { valid: false, correct: false, firstAttempt: false, scoreDelta: 0, captured: false, message: 'Unknown question.' };
    if (this.state.solvedQuestionIds.includes(questionId)) {
      return { valid: true, correct: true, firstAttempt: false, scoreDelta: 0, captured: false };
    }
    const check = checkAnswer(question, raw);
    if (!check.valid) return { valid: false, correct: false, firstAttempt: false, scoreDelta: 0, captured: false, message: check.message };

    const attempts = (this.state.attempts[questionId] ?? 0) + 1;
    this.state.attempts[questionId] = attempts;
    const firstAttempt = attempts === 1;
    let scoreDelta = 0;
    let captured = false;

    if (!check.correct) {
      this.state.wrongCounts[questionId] = (this.state.wrongCounts[questionId] ?? 0) + 1;
      scoreDelta = SCORE.WRONG;
      this.state.score = Math.max(0, this.state.score + scoreDelta);
      this.state.fear = clamp(this.state.fear + FEAR.WRONG_ANSWER, 0, 100);
      if (this.state.fear >= FEAR.CAPTURE_THRESHOLD) {
        captured = true;
        this.state.fear = FEAR.CAPTURE_RESET;
        const penalty = Math.min(FEAR.CAPTURE_TIME_PENALTY, this.state.timeRemainingSeconds);
        this.state.timeRemainingSeconds -= penalty;
        this.state.elapsedSeconds += penalty;
        if (this.state.timeRemainingSeconds <= 0) {
          this.state.completed = true;
          this.state.ending = 'lost-soul';
        }
      }
    } else {
      scoreDelta = SCORE.CORRECT + (firstAttempt ? SCORE.FIRST_ATTEMPT : 0);
      this.state.score += scoreDelta;
      this.state.fear = clamp(this.state.fear + FEAR.CORRECT_RECOVERY, 0, 100);
      this.state.solvedQuestionIds.push(questionId);
    }
    this.persist();
    return { valid: true, correct: check.correct, firstAttempt, scoreDelta, captured };
  }

  useHint(questionId: string): { applied: boolean; scoreDelta: number } {
    if (this.state.hintUsedIds.includes(questionId)) return { applied: false, scoreDelta: 0 };
    this.state.hintUsedIds.push(questionId);
    const before = this.state.score;
    this.state.score = Math.max(0, this.state.score + SCORE.HINT);
    this.persist();
    return { applied: true, scoreDelta: this.state.score - before };
  }

  resolveSpirit(spiritId: string, rescue: boolean): void {
    if (!this.state.spiritsResolved.includes(spiritId)) this.state.spiritsResolved.push(spiritId);
    if (rescue && !this.state.spiritsRescued.includes(spiritId)) this.state.spiritsRescued.push(spiritId);
    this.persist();
  }

  roomSolved(roomIndex = this.state.roomIndex): boolean {
    return ROOMS[roomIndex].questionIds.every((id) => this.state.solvedQuestionIds.includes(id));
  }

  maxUnlockedNode(roomIndex = this.state.roomIndex): number {
    const room = ROOMS[roomIndex];
    let solvedSequentially = 0;
    for (const id of room.questionIds) {
      if (!this.state.solvedQuestionIds.includes(id)) break;
      solvedSequentially += 1;
    }
    return Math.min(room.questionIds.length, solvedSequentially);
  }

  resumeAfterFailure(seconds = 5 * 60): void {
    this.state.completed = false;
    this.state.ending = null;
    this.state.timeRemainingSeconds = seconds;
    this.state.fear = Math.min(this.state.fear, FEAR.CAPTURE_RESET);
    this.persist();
  }

  completeCurrentRoom(): { completed: boolean; final: boolean } {
    const room = ROOMS[this.state.roomIndex];
    if (!this.roomSolved()) return { completed: false, final: false };
    if (!this.state.completedRooms.includes(room.id)) {
      this.state.completedRooms.push(room.id);
      this.state.score += SCORE.ROOM_COMPLETE;
      this.state.fear = clamp(this.state.fear + FEAR.ROOM_RECOVERY, 0, 100);
    }
    const final = room.id === 5;
    if (final) {
      this.state.completed = true;
      this.state.ending = this.determineEnding();
      this.updateAchievements();
    } else {
      this.updateAchievements();
      this.state.roomIndex += 1;
      this.state.nodeIndex = 0;
    }
    this.persist();
    return { completed: true, final };
  }

  private determineEnding(): 'true-escape' | 'hollow-escape' {
    return this.state.spiritsRescued.length === 4
      && this.state.fear <= FEAR.TRUE_ENDING_MAX
      ? 'true-escape'
      : 'hollow-escape';
  }

  private updateAchievements(): void {
    const grant = (id: AchievementId, condition: boolean) => {
      if (condition && !this.state.achievements.includes(id)) this.state.achievements.push(id);
    };
    const limitsWrong = Object.entries(this.state.wrongCounts)
      .filter(([id]) => id.startsWith('r1-') || id.startsWith('r2-'))
      .reduce((sum, [, count]) => sum + count, 0);
    grant('flawless', this.state.completedRooms.includes(1) && this.state.completedRooms.includes(2) && limitsWrong === 0);
    grant('soul-saver', this.state.spiritsRescued.length === 4);
    if (this.state.completed) {
      grant('intellect', this.state.hintUsedIds.length === 0);
      grant('overachiever', this.state.score === MAX_SCORE);
      grant('speedrunner', this.state.elapsedSeconds <= SPEEDRUN_SECONDS);
      grant('skys-the-limit', this.state.ending === 'true-escape');
      grant('leibnizs-lament', this.state.ending === 'hollow-escape');
    }
  }

  private persist(): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.state.settings));
    this.emit();
  }

  private emit(): void {
    const snap = this.snapshot;
    this.listeners.forEach((listener) => listener(snap));
  }

  private load(): GameState | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GameState;
      if (parsed.version !== 1) return null;
      return { ...createInitialState(parsed.settings), ...parsed };
    } catch {
      return null;
    }
  }

  private loadSettings(): SettingsState {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}
