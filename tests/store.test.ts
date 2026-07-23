import { beforeEach, describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, ROOMS } from '../src/content';
import { GameStore } from '../src/gameStore';
import { QUESTION_BY_ID } from '../src/questions';
import { FEAR, MAX_SCORE, TOTAL_TIME_SECONDS } from '../src/types';

const correctRaw = (id: string) => String(QUESTION_BY_ID[id].expected);
function completeRun(store: GameStore, rescue = true) {
  for (const room of ROOMS) {
    room.questionIds.forEach(id => expect(store.submitAnswer(id, correctRaw(id)).correct).toBe(true));
    if (room.spiritId) store.resolveSpirit(room.spiritId, rescue);
    expect(store.completeCurrentRoom().completed).toBe(true);
  }
}

beforeEach(() => localStorage.clear());

describe('game state, score, and endings', () => {
  it('produces maximum score and True Escape for a perfect run', () => {
    const store = new GameStore(); store.startNewGame(); completeRun(store);
    expect(store.snapshot.score).toBe(MAX_SCORE);
    expect(store.snapshot.ending).toBe('true-escape');
    expect(store.snapshot.achievements).toContain('overachiever');
    expect(store.snapshot.achievements).toContain('skys-the-limit');
    expect(store.snapshot.achievements).not.toContain('leibnizs-lament');
  });
  it('removes the first-attempt bonus after a wrong answer', () => {
    const store = new GameStore(); store.startNewGame();
    expect(store.submitAnswer('r1-q1', '0').correct).toBe(false);
    const result = store.submitAnswer('r1-q1', '4');
    expect(result.firstAttempt).toBe(false);
    expect(result.scoreDelta).toBe(100);
  });
  it('charges a hint only once', () => {
    const store = new GameStore(); store.startNewGame(); store.submitAnswer('r1-q1', '4');
    expect(store.useHint('r1-q2').applied).toBe(true);
    expect(store.useHint('r1-q2').applied).toBe(false);
    expect(store.snapshot.score).toBe(100);
  });
  it('applies capture reset and a one-minute penalty', () => {
    const store = new GameStore(); store.startNewGame(); let captured = false;
    for (let i = 0; i < 8; i += 1) captured ||= store.submitAnswer('r1-q1', '0').captured;
    expect(captured).toBe(true);
    expect(store.snapshot.fear).toBe(FEAR.CAPTURE_RESET);
    expect(store.snapshot.timeRemainingSeconds).toBe(TOTAL_TIME_SECONDS - FEAR.CAPTURE_TIME_PENALTY);
  });
  it('produces Hollow Escape when spirits are abandoned', () => {
    const store = new GameStore(); store.startNewGame(); completeRun(store, false);
    expect(store.snapshot.ending).toBe('hollow-escape');
  });
  it('produces Lost Soul when the timer reaches zero', () => {
    const store = new GameStore(); store.startNewGame(); store.tick(TOTAL_TIME_SECONDS);
    expect(store.snapshot.ending).toBe('lost-soul');
    expect(store.snapshot.completed).toBe(true);
  });
  it('has two mutually exclusive ending achievements', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(ids).toContain('skys-the-limit');
    expect(ids).toContain('leibnizs-lament');
  });
});
