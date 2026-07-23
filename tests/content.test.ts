import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, ROOMS, SPIRITS } from '../src/content';
import { QUESTIONS } from '../src/questions';

describe('content completeness', () => {
  it('contains five rooms and seventeen questions', () => {
    expect(ROOMS).toHaveLength(5);
    expect(QUESTIONS).toHaveLength(17);
    expect(ROOMS.reduce((sum, room) => sum + room.questionIds.length, 0)).toBe(17);
  });
  it('covers every lesson from 1 through 12', () => {
    const lessons = new Set(QUESTIONS.map(q => q.lesson));
    for (let lesson = 1; lesson <= 12; lesson += 1) expect(lessons.has(lesson)).toBe(true);
  });
  it('contains six dedicated limits examples in Rooms 1 and 2', () => {
    expect(QUESTIONS.filter(q => q.roomId <= 2)).toHaveLength(6);
  });
  it('provides complete educational feedback for every item', () => {
    QUESTIONS.forEach(question => {
      expect(question.hint.length).toBeGreaterThan(10);
      expect(question.solutionSteps.length).toBeGreaterThan(0);
      expect(question.explanation.length).toBeGreaterThan(10);
      if (question.kind === 'choice') expect(question.options?.some(option => option.id === question.expected)).toBe(true);
    });
  });
  it('contains four spirits and seven achievements', () => {
    expect(SPIRITS).toHaveLength(4);
    expect(ACHIEVEMENTS).toHaveLength(7);
  });
});
