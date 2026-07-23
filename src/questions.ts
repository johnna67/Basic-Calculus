import { QUESTIONS_1_TO_3 } from './questions1';
import { QUESTIONS_4_TO_5 } from './questions2';
export const QUESTIONS = [...QUESTIONS_1_TO_3, ...QUESTIONS_4_TO_5];
export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]));
