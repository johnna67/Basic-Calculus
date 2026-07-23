import type { Achievement, RoomDefinition, Spirit } from './types';

export const INTRO_SLIDES = [
  {
    eyebrow: '4:57 PM · Meridian Senior High',
    title: 'The lesson ends. You do not wake.',
    body: 'Your teacher writes the final limit of the day. The symbols blur. Your head touches the desk just before the bell should ring.',
  },
  {
    eyebrow: 'Time unknown',
    title: 'The classroom is empty.',
    body: 'The fluorescent lights hum without power. The windows show only a black hallway where the courtyard should be.',
  },
  {
    eyebrow: 'A message appears on the board',
    title: 'EVERY LIMIT HAS A COST.',
    body: 'The classroom door is chained by an equation. Somewhere outside, something drags a chair across the floor.',
  },
  {
    eyebrow: 'Objective received',
    title: 'Solve. Remember. Escape.',
    body: 'Five rooms stand between you and morning. Wrong answers feed the Entity. Forgotten students may still be saved.',
  },
] as const;

export const SPIRITS: Spirit[] = [
  {
    id: 'mara', roomId: 1, name: 'Mara', epithet: 'The Unheard Class Officer',
    message: 'I kept the doors open for everyone else. When the bell stopped, nobody came back for me. Do not let the Entity convince you that being correct is the same as being alone.',
  },
  {
    id: 'tomas', roomId: 2, name: 'Tomas', epithet: 'The Last Bridge Monitor',
    message: 'The abyss is endless only because fear keeps you from taking the next step. I marked every stable plank. Let me cross with you.',
  },
  {
    id: 'celeste', roomId: 3, name: 'Celeste', epithet: 'The Missing Name',
    message: 'A hole in a graph can be repaired by one value. A hole in memory needs someone willing to carry the missing name outside.',
  },
  {
    id: 'ilya', roomId: 4, name: 'Ilya', epithet: 'The Cartographer of Moving Walls',
    message: 'The room is predictable. Panic is the only random variable. Finish my map and take me to the exam hall.',
  },
];

export const ROOMS: RoomDefinition[] = [
  {
    id: 1,
    name: 'The Domain of No Return',
    lessons: 'Lessons 1–3 · limits, one-sided limits, infinite limits',
    description: 'A warped replica of a school hallway where every door is locked by a limit and the Entity waits for every mistake.',
    objective: 'Solve three limit locks and reach the hallway exit.',
    entryNarration: [
      'You wake after the last bell inside a version of Meridian Senior High that should not exist.',
      'Every locker is sealed. A chained classroom door displays a limit instead of a room number.',
      'Far beyond the emergency light, two red eyes open.',
    ],
    questionIds: ['r1-q1', 'r1-q2', 'r1-q3'],
    spiritId: 'mara',
    nodeLabels: ['The Chained Door', 'The Split Corridor', 'The Vertical Lock', 'Mara’s Echo'],
    accent: '#9ab477',
  },
  {
    id: 2,
    name: 'The Infinite Abyss',
    lessons: 'Lessons 4–6 · limits at infinity and special limits',
    description: 'Broken bridges float over fog with no visible bottom. Correct limits rebuild the only path forward.',
    objective: 'Restore three bridge spans and cross the abyss.',
    entryNarration: [
      'The hallway ends at a stairwell descending below the foundation.',
      'At the bottom, broken bridges float over fog with no visible floor.',
      'A distant lantern flashes in the rhythm of a failing heartbeat.',
    ],
    questionIds: ['r2-q1', 'r2-q2', 'r2-q3'],
    spiritId: 'tomas',
    nodeLabels: ['Bridge Ratio', 'Signal Lantern', 'Stability Dial', 'Tomas’s Rope'],
    accent: '#6fa7c3',
  },
  {
    id: 3,
    name: 'Poor, Undefined Souls',
    lessons: 'Lessons 7–9 · indeterminate forms and continuity',
    description: 'A haunted classroom holds unfinished papers and students whose identities have become missing values.',
    objective: 'Resolve the undefined work and restore a spirit’s identity.',
    entryNarration: [
      'The bridge leads into a classroom where unfinished papers orbit empty desks.',
      'The attendance register contains blank lines where student names should be.',
      'A translucent figure points to a proof that ends with 0/0.',
    ],
    questionIds: ['r3-q1', 'r3-q2', 'r3-q3'],
    spiritId: 'celeste',
    nodeLabels: ['Unfinished Proof', 'Continuity Register', 'The Broken Record', 'Celeste’s Name'],
    accent: '#c9a35d',
  },
  {
    id: 4,
    name: 'Changes in Rate of Survival',
    lessons: 'Lessons 10–12 · IVT, rate of change, derivatives',
    description: 'Walls, gears, and exits shift over time. The player must predict the room before it closes.',
    objective: 'Predict the room’s motion and reach the Final Exam.',
    entryNarration: [
      'The next room rearranges itself every time you look away.',
      'Graph lines glow beneath the floor while walls slide along invisible axes.',
      'A broken monitor predicts only one future: you trapped inside it.',
    ],
    questionIds: ['r4-q1', 'r4-q2', 'r4-q3'],
    spiritId: 'ilya',
    nodeLabels: ['Shifting Corridor', 'Motion Monitor', 'Derivative Mechanism', 'Ilya’s Map'],
    accent: '#c77860',
  },
  {
    id: 5,
    name: 'The Final Exam',
    lessons: 'Cumulative · all twelve lessons',
    description: 'A grand examination hall contains five final seals while the Entity watches from the proctor’s table.',
    objective: 'Break all five seals before the timer reaches zero.',
    entryNarration: [
      'Rows of examination desks repeat farther than the building can contain.',
      'The Entity waits at the proctor’s table. Five red seals cover the exit.',
      'The final bell begins counting down from the time you have left.',
    ],
    questionIds: ['r5-q1', 'r5-q2', 'r5-q3', 'r5-q4', 'r5-q5'],
    nodeLabels: ['Final Desk I', 'Final Desk II', 'Final Desk III', 'Final Desk IV', 'Final Desk V', 'The Exit'],
    accent: '#a878ad',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'flawless', name: 'Flawless', description: 'Complete Rooms 1 and 2 without an incorrect answer.', icon: '◇' },
  { id: 'intellect', name: 'Intellect', description: 'Finish the game without using a hint.', icon: '✦' },
  { id: 'overachiever', name: 'Overachiever', description: 'Earn the maximum score of 3,800 points.', icon: '★' },
  { id: 'speedrunner', name: 'Speedrunner', description: 'Escape in 15 active minutes or less.', icon: '⌁' },
  { id: 'soul-saver', name: 'Soul Saver', description: 'Rescue Mara, Tomas, Celeste, and Ilya.', icon: '♧' },
  { id: 'skys-the-limit', name: 'Sky’s the Limit', description: 'Reach the True Escape ending.', icon: '∞' },
  { id: 'leibnizs-lament', name: 'Leibniz’s Lament', description: 'Escape the school but leave the loop unbroken.', icon: '∂' },
];

export const ROOM_BY_ID = Object.fromEntries(ROOMS.map((room) => [room.id, room]));
export const SPIRIT_BY_ID = Object.fromEntries(SPIRITS.map((spirit) => [spirit.id, spirit]));
export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]));
