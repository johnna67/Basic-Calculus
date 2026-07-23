# Calculus Question Bank, Answer Key, and Solutions

This bank contains **17 required questions**. Rooms 1 and 2 contain six limits examples. Every item includes a hint, environmental response, full solution, and explanation.

## Coverage summary

| Room | Coverage | Questions |
|---:|---|---:|
| 1 — The Domain of No Return | Lessons 1–3 · limits, one-sided limits, infinite limits | 3 |
| 2 — The Infinite Abyss | Lessons 4–6 · limits at infinity and special limits | 3 |
| 3 — Poor, Undefined Souls | Lessons 7–9 · indeterminate forms and continuity | 3 |
| 4 — Changes in Rate of Survival | Lessons 10–12 · IVT, rate of change, derivatives | 3 |
| 5 — The Final Exam | Cumulative · all twelve lessons | 5 |

# Room 1: The Domain of No Return

**Coverage:** Lessons 1–3 · limits, one-sided limits, infinite limits

## 1.1 The Chained Classroom Door

**Lesson 1 — Limit of a Function**

**Prompt:** The glowing lock rejects direct substitution. Evaluate the limit to dissolve the chains.

$$\lim_{x\to2}\frac{x^2-4}{x-2}$$

**Correct answer:** 4

**Hint:** Factor the numerator as a difference of squares, then cancel the common factor.

**Solution — Factor and cancel:**

1. $x^2-4=(x-2)(x+2)$
2. $\frac{(x-2)(x+2)}{x-2}=x+2\quad(x\ne2)$
3. $\lim_{x\to2}(x+2)=4$

**Explanation:** The original expression is undefined at x = 2, but the nearby values follow x + 2, so the limit is 4.

**Correct environmental response:** The chains loosen and strike the floor.

**Incorrect environmental response:** The lock pulses red. The Entity takes one step closer.

## 1.2 The Split Corridor

**Lesson 2 — One-Sided Limits**

**Prompt:** Only the left corridor is stable. Find the value approached from values less than 3.

$$f(x)=\begin{cases}2x+1,&x<3\\x^2-4,&x\ge3\end{cases}\qquad\lim_{x\to3^-}f(x)=?$$

**Options:**

- **A.** $5$
- **B.** $7$
- **C.** $9$
- **D.** $	ext{DNE}$

**Correct answer:** 7

**Hint:** For a left-hand limit, use only the branch assigned to x < 3.

**Solution — Use the left branch:**

1. $x\to3^-\text{ means values just below }3$
2. $f(x)=2x+1\text{ on the left}$
3. $2(3)+1=7$

**Explanation:** The left-hand limit uses the x < 3 formula, so the value approached is 7.

**Correct environmental response:** The false corridor folds into darkness while the correct passage holds.

**Incorrect environmental response:** Both corridors twist. A whisper repeats: “Choose the correct side.”

## 1.3 The Vertical Lock

**Lesson 3 — Infinite Limits**

**Prompt:** A gauge rises without bound as the denominator approaches zero from the positive side.

$$\lim_{x\to2^+}\frac{1}{x-2}$$

**Options:**

- **A.** $+infty$
- **B.** $-infty$
- **C.** $0$
- **D.** $2$

**Correct answer:** +infty

**Hint:** Immediately to the right of 2, x − 2 is a very small positive number.

**Solution — Track the sign:**

1. $x\to2^+\Rightarrow x-2\to0^+$
2. $\frac{1}{\text{small positive}}\text{ grows without bound}$
3. $\lim_{x\to2^+}\frac1{x-2}=+\infty$

**Explanation:** The denominator remains positive and approaches zero, so the quotient increases without bound.

**Correct environmental response:** The gauge breaks above its maximum mark. The first room releases you.

**Incorrect environmental response:** The needle plunges through the glass and the hallway lights fail.


# Room 2: The Infinite Abyss

**Coverage:** Lessons 4–6 · limits at infinity and special limits

## 2.1 The Bridge Ratio

**Lesson 4 — Limits at Infinity**

**Prompt:** The bridge accepts only the long-run ratio of the leading terms.

$$\lim_{x\to\infty}\frac{5x^2-3x+1}{2x^2+7}$$

**Correct answer:** 2.5

**Hint:** The numerator and denominator have the same degree. Compare leading coefficients.

**Solution — Divide by the highest power:**

1. $\frac{5x^2-3x+1}{2x^2+7}=\frac{5-3/x+1/x^2}{2+7/x^2}$
2. $1/x\to0\text{ and }1/x^2\to0$
3. $\frac{5}{2}=2.5$

**Explanation:** Equal-degree rational functions approach the ratio of their leading coefficients.

**Correct environmental response:** A missing bridge segment condenses from the fog.

**Incorrect environmental response:** A plank tears free and disappears before it reaches the bottom.

## 2.2 The Signal Lantern

**Lesson 5 — Exponential Limits**

**Prompt:** The lantern needs the instantaneous growth factor of an exponential signal.

$$\lim_{x\to0}\frac{e^{2x}-1}{x}$$

**Correct answer:** 2

**Hint:** Let u = 2x and use the standard limit (eᵘ − 1)/u → 1.

**Solution — Rescale the standard limit:**

1. $u=2x\Rightarrow x=u/2$
2. $\frac{e^{2x}-1}{x}=2\frac{e^u-1}{u}$
3. $2\cdot1=2$

**Explanation:** The standard exponential limit equals 1, and the inner factor 2 scales the result.

**Correct environmental response:** The lantern burns with a cold blue flame and reveals the next platform.

**Incorrect environmental response:** The lantern exhales black smoke. Something moves beneath the bridge.

## 2.3 The Stability Dial

**Lesson 6 — Special Trigonometric Limits**

**Prompt:** Stabilize the final span using the fundamental sine limit.

$$\lim_{x\to0}\frac{\sin(5x)}{3x}$$

**Correct answer:** 1.6666666666666667

**Hint:** Create sin(5x)/(5x), then multiply by the remaining constant.

**Solution — Create sin u over u:**

1. $\frac{\sin(5x)}{3x}=\frac53\cdot\frac{\sin(5x)}{5x}$
2. $\lim_{u\to0}\frac{\sin u}{u}=1$
3. $\frac53\cdot1=\frac53$

**Explanation:** The fundamental sine limit is 1, leaving the scaling factor 5/3.

**Correct environmental response:** The bridge locks into place. The abyss finally has an opposite side.

**Incorrect environmental response:** The dial slips. Fog pours upward like water running in reverse.


# Room 3: Poor, Undefined Souls

**Coverage:** Lessons 7–9 · indeterminate forms and continuity

## 3.1 The Unfinished Proof

**Lesson 7 — Indeterminate Forms**

**Prompt:** The spirit’s work ends at 0/0. Resolve the indeterminate form.

$$\lim_{x\to1}\frac{x^2-1}{x-1}$$

**Correct answer:** 2

**Hint:** 0/0 is not the final answer. Factor x² − 1.

**Solution — Resolve the indeterminate form:**

1. $\text{Direct substitution gives }0/0$
2. $x^2-1=(x-1)(x+1)$
3. $\lim_{x\to1}(x+1)=2$

**Explanation:** An indeterminate form signals that algebraic simplification is required; the limit is 2.

**Correct environmental response:** The spirit’s erased final line rewrites itself in chalk.

**Incorrect environmental response:** The page returns to 0/0 no matter how many times you blink.

## 3.2 The Continuity Register

**Lesson 8 — Continuous Functions**

**Prompt:** Choose the missing value that repairs the function at x = 3.

$$f(x)=\begin{cases}\dfrac{x^2-9}{x-3},&x\ne3\\k,&x=3\end{cases}\quad\text{Find }k.$$

**Correct answer:** 6

**Hint:** Continuity requires f(3) to equal the limit as x approaches 3.

**Solution — Match the function value to the limit:**

1. $\frac{x^2-9}{x-3}=x+3\quad(x\ne3)$
2. $\lim_{x\to3}f(x)=6$
3. $k=f(3)=6$

**Explanation:** Setting k = 6 makes the function value and two-sided limit agree.

**Correct environmental response:** A missing name returns to the attendance register.

**Incorrect environmental response:** The register tears itself open at the same blank line.

## 3.3 The Broken Record

**Lesson 9 — Discontinuous Functions**

**Prompt:** Classify the discontinuity that repeats at x = 1.

$$f(x)=\frac{x^2-1}{x-1}\quad\text{at }x=1$$

**Options:**

- **A.** Removable discontinuity (a hole)
- **B.** Jump discontinuity
- **C.** Infinite discontinuity
- **D.** The function is continuous

**Correct answer:** Removable discontinuity (a hole)

**Hint:** The simplified expression approaches a finite value, but the original is undefined at x = 1.

**Solution — Identify the hole:**

1. $\frac{x^2-1}{x-1}=x+1\quad(x\ne1)$
2. $\lim_{x\to1}f(x)=2$
3. $f(1)\text{ is undefined, so the graph has a removable hole}$

**Explanation:** Defining f(1) = 2 would remove the discontinuity.

**Correct environmental response:** The record stops skipping. A spirit remembers her own name.

**Incorrect environmental response:** The same second repeats: bell, scream, silence.


# Room 4: Changes in Rate of Survival

**Coverage:** Lessons 10–12 · IVT, rate of change, derivatives

## 4.1 The Shifting Corridor

**Lesson 10 — Intermediate Value Theorem**

**Prompt:** The corridor changes sign between two doors. What does IVT guarantee?

$$f(x)=x^3-x-2,\qquad f(1)=-2,\quad f(2)=4$$

**Options:**

- **A.** At least one c in (1, 2) satisfies f(c) = 0
- **B.** Exactly one c in (1, 2) satisfies f(c) = 0
- **C.** f has no zero in (1, 2)
- **D.** The zero must be c = 1.5

**Correct answer:** At least one c in (1, 2) satisfies f(c) = 0

**Hint:** A polynomial is continuous, and 0 lies between −2 and 4. IVT guarantees existence, not uniqueness.

**Solution — Apply the Intermediate Value Theorem:**

1. $f\text{ is a polynomial, so it is continuous on }[1,2]$
2. $f(1)=-2<0<4=f(2)$
3. $\exists c\in(1,2)\text{ such that }f(c)=0$

**Explanation:** IVT guarantees at least one root in the interval, but not its exact value or uniqueness.

**Correct environmental response:** One shifting corridor becomes mathematically unavoidable.

**Incorrect environmental response:** Every doorway relocates at once. The floor tilts toward the Entity.

## 4.2 The Motion Monitor

**Lesson 11 — Average Rate of Change**

**Prompt:** Calculate the average rate of change of the room’s position from t = 1 to t = 3.

$$s(t)=t^2+3t,\qquad\frac{s(3)-s(1)}{3-1}$$

**Correct answer:** 7

**Hint:** Evaluate s(3) and s(1), then divide their difference by 2.

**Solution — Compute the secant slope:**

1. $s(3)=18$
2. $s(1)=4$
3. $\frac{18-4}{3-1}=7$

**Explanation:** The average rate of change is the slope of the secant line: 7 units per time unit.

**Correct environmental response:** The monitor predicts the next movement before the walls can close.

**Incorrect environmental response:** Your prediction arrives one second late. Metal scrapes behind you.

## 4.3 The Derivative Mechanism

**Lesson 12 — Differentiation of Algebraic Functions**

**Prompt:** The mechanism needs the instantaneous value f′(1).

$$f(x)=(x^2+1)(3x-2),\qquad f'(1)=?$$

**Correct answer:** 8

**Hint:** Use the product rule: (uv)′ = u′v + uv′.

**Solution — Use the product rule:**

1. $u=x^2+1,\;u'=2x,\qquad v=3x-2,\;v'=3$
2. $f'(x)=2x(3x-2)+3(x^2+1)$
3. $f'(1)=2+6=8$

**Explanation:** The product rule differentiates each factor while retaining the other factor in each term.

**Correct environmental response:** The mechanism turns before the room can rearrange itself again.

**Incorrect environmental response:** The gears reverse and cut a doorway into the wrong wall.


# Room 5: The Final Exam

**Coverage:** Cumulative · all twelve lessons

## 5.1 Final Desk I

**Lesson 2 — Two-Sided Limits**

**Prompt:** The first exam seal opens only if both one-sided limits agree.

$$f(x)=\begin{cases}x+2,&x<1\\4-x,&x\ge1\end{cases}\qquad\lim_{x\to1}f(x)=?$$

**Correct answer:** 3

**Hint:** Compute the left-hand and right-hand limits separately.

**Solution — Compare both sides:**

1. $\lim_{x\to1^-}(x+2)=3$
2. $\lim_{x\to1^+}(4-x)=3$
3. $\lim_{x\to1}f(x)=3$

**Explanation:** The two-sided limit exists because both one-sided limits equal 3.

**Correct environmental response:** The first exam seal fades from the desk.

**Incorrect environmental response:** The proctor’s red eyes open at the back of the hall.

## 5.2 Final Desk II

**Lesson 4 — Limits at Infinity**

**Prompt:** Determine the end behavior as the corridor extends toward negative infinity.

$$\lim_{x\to-\infty}\frac{4x^3-x}{-2x^3+5}$$

**Correct answer:** -2

**Hint:** The degrees are equal. Compare the leading coefficients.

**Solution — Use the leading terms:**

1. $\text{Both polynomials have degree }3$
2. $\frac{4x^3}{-2x^3}\to\frac4{-2}$
3. $\lim=-2$

**Explanation:** The limit is the ratio of the leading coefficients, −2.

**Correct environmental response:** A second seal cracks. The hall grows shorter.

**Incorrect environmental response:** The rows of desks multiply behind you.

## 5.3 Final Desk III

**Lesson 8 — Continuity**

**Prompt:** Judge the function at the marked point.

$$f(x)=\begin{cases}\dfrac{x^2-4}{x-2},&x\ne2\\6,&x=2\end{cases}$$

**Options:**

- **A.** Continuous at x = 2
- **B.** Not continuous: the limit is 4 but f(2) = 6
- **C.** Not continuous: the limit does not exist
- **D.** Not continuous: infinite discontinuity

**Correct answer:** Not continuous: the limit is 4 but f(2) = 6

**Hint:** Simplify the quotient and compare the limit at 2 with f(2).

**Solution — Check the continuity conditions:**

1. $\frac{x^2-4}{x-2}=x+2\quad(x\ne2)$
2. $\lim_{x\to2}f(x)=4$
3. $f(2)=6\ne4$

**Explanation:** The function value does not equal the limit, so the function is not continuous at x = 2.

**Correct environmental response:** The third seal disappears. A spirit whispers your name beyond the exit.

**Incorrect environmental response:** The answer sheet stains itself with a dark circle around 6.

## 5.4 Final Desk IV

**Lesson 10 — Intermediate Value Theorem**

**Prompt:** Select an interval where IVT guarantees a zero of g.

$$g(x)=x^2-5$$

**Options:**

- **A.** [0, 1]
- **B.** [1, 2]
- **C.** [2, 3]
- **D.** [3, 4]

**Correct answer:** [2, 3]

**Hint:** Find endpoint values with opposite signs.

**Solution — Bracket the zero:**

1. $g(2)=-1$
2. $g(3)=4$
3. $g\text{ is continuous and changes sign on }[2,3]$

**Explanation:** The interval [2, 3] contains a guaranteed zero because g changes sign and is continuous.

**Correct environmental response:** The fourth seal breaks. The Entity leaves the proctor’s desk.

**Incorrect environmental response:** The Entity begins walking between the rows.

## 5.5 Final Desk V

**Lesson 12 — Differentiation**

**Prompt:** Complete the last derivative before the bell reaches zero.

$$f(x)=2x^3-5x^2+4x-7,\qquad f'(2)=?$$

**Correct answer:** 8

**Hint:** Differentiate term by term with the power rule, then substitute x = 2.

**Solution — Apply the power rule:**

1. $f'(x)=6x^2-10x+4$
2. $f'(2)=6(4)-20+4$
3. $f'(2)=8$

**Explanation:** Applying the power rule term by term gives f′(2) = 8.

**Correct environmental response:** The last seal shatters. The exit appears behind the Entity.

**Incorrect environmental response:** The final bell loses another second. The Entity is almost within reach.

# Verification notes

- All numeric expected values are covered by automated answer tests.
- Every multiple-choice question contains the expected option identifier.
- Fractions and decimal equivalents are accepted for numeric questions.
- Solutions pause the timer so educational review is never penalized.
