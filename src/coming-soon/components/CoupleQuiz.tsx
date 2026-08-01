import { useEffect, useRef, useState } from "react";
import { comingSoonConfig } from "../config";
import { QuizModal } from "./QuizModal";

const { quiz } = comingSoonConfig;
const TITLE_ID = "cs-quiz-title";

/** "How Well Do You Know Us?" — one question at a time, then a fun result. */
export const CoupleQuiz = ({ onClose }: { onClose: () => void }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const advancing = useRef<number>();
  const stepRef = useRef<HTMLDivElement>(null);

  const total = quiz.questions.length;
  const question = quiz.questions[index];

  const answer = (option: number) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.correct) setScore((s) => s + 1);

    // Brief pause so the selection is visible before the transition
    advancing.current = window.setTimeout(() => {
      setPicked(null);
      if (index + 1 < total) setIndex(index + 1);
      else setDone(true);
    }, 380);
  };

  // Keep keyboard focus with the game as questions swap in and out
  useEffect(() => {
    if (index === 0 && !done) return;
    stepRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [index, done]);

  useEffect(() => () => window.clearTimeout(advancing.current), []);

  const restart = () => {
    window.clearTimeout(advancing.current);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  const resultText =
    score >= quiz.results.goodScore
      ? quiz.results.good
      : score >= Math.ceil(total / 2)
        ? quiz.results.okay
        : quiz.results.poor;

  return (
    <QuizModal onClose={onClose} titleId={TITLE_ID}>
      <button
        type="button"
        className="cs-card__close"
        onClick={onClose}
        aria-label="Close the game"
      >
        ✕
      </button>

      <h2 className="cs-card__title" id={TITLE_ID}>
        {quiz.title}
      </h2>

      {done ? (
        <div className="cs-result" ref={stepRef}>
          <p className="cs-result__score">
            {score}
            <small> / {total}</small>
          </p>
          <p className="cs-result__text">{resultText}</p>
          <div className="cs-result__actions">
            <button type="button" className="cs-btn cs-btn--primary" onClick={restart}>
              {quiz.results.playAgain}
            </button>
            <button type="button" className="cs-btn cs-btn--ghost" onClick={onClose}>
              {quiz.results.close}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cs-progress">
            <span>
              {index + 1} / {total}
            </span>
            <span className="cs-progress__dots" aria-hidden="true">
              {quiz.questions.map((q, i) => (
                <span
                  key={q.question}
                  className={`cs-progress__dot${i <= index ? " cs-progress__dot--on" : ""}`}
                />
              ))}
            </span>
          </div>

          {/* key forces the slide transition between questions */}
          <div className="cs-q" key={index} ref={stepRef}>
            <p className="cs-q__text">{question.question}</p>
            <div className="cs-q__options">
              {question.options.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  className={`cs-option${picked === i ? " cs-option--picked" : ""}`}
                  onClick={() => answer(i)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </QuizModal>
  );
};

export default CoupleQuiz;
