import { describe, expect, it } from 'vitest';
import { checkAnswer, parseNumericAnswer } from '../src/gameStore';
import { QUESTION_BY_ID } from '../src/questions';

describe('answer parsing and checking', () => {
  it('accepts integers, decimals, fractions, and unicode minus', () => {
    expect(parseNumericAnswer('4')).toBe(4);
    expect(parseNumericAnswer('2.5')).toBe(2.5);
    expect(parseNumericAnswer('5/2')).toBe(2.5);
    expect(parseNumericAnswer('−2')).toBe(-2);
  });
  it('rejects malformed values and division by zero', () => {
    expect(parseNumericAnswer('abc')).toBeNull();
    expect(parseNumericAnswer('1/0')).toBeNull();
  });
  it('accepts the first factoring limit answer', () => {
    expect(checkAnswer(QUESTION_BY_ID['r1-q1'], '4').correct).toBe(true);
  });
  it('accepts a fraction for the bridge-ratio problem', () => {
    expect(checkAnswer(QUESTION_BY_ID['r2-q1'], '5/2').correct).toBe(true);
  });
  it('checks multiple-choice option IDs', () => {
    expect(checkAnswer(QUESTION_BY_ID['r1-q2'], 'b').correct).toBe(true);
    expect(checkAnswer(QUESTION_BY_ID['r1-q2'], 'a').correct).toBe(false);
  });
});
