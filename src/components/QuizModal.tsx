import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Award, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, Quiz, QuizAttemptResult } from '../types';

interface QuizModalProps {
  chapter: Chapter;
  previousResult?: QuizAttemptResult;
  onClose: () => void;
  onPassQuiz: (result: QuizAttemptResult) => void;
  onNextChapter?: () => void;
  hasNextChapter: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  chapter,
  previousResult,
  onClose,
  onPassQuiz,
  onNextChapter,
  hasNextChapter,
}) => {
  const quiz: Quiz = chapter.quiz;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    previousResult ? previousResult.answers : {}
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!previousResult?.passed);
  const [result, setResult] = useState<QuizAttemptResult | null>(previousResult || null);

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return; // locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (!isComplete) return;

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScorePercent;

    const newResult: QuizAttemptResult = {
      passed,
      score: correctCount,
      total: totalQuestions,
      percentage,
      answers: selectedAnswers,
      attemptedAt: new Date().toISOString(),
    };

    setResult(newResult);
    setIsSubmitted(true);

    if (passed) {
      // Trigger confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onPassQuiz(newResult);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div
      id="quiz-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="quiz-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Évaluation de fin de chapitre
              </span>
              <h3 className="font-bold text-base text-white">{quiz.title}</h3>
            </div>
          </div>
          <button
            id="btn-quiz-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Passing criteria bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              Questions répondues : <strong>{answeredCount}/{totalQuestions}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Seuil de validation :</span>
            <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {quiz.passingScorePercent}% requis
            </span>
          </div>
        </div>

        {/* Result banner if already submitted */}
        {isSubmitted && result && (
          <div
            className={`p-5 border-b ${
              result.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {result.passed ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">
                      {result.passed ? 'Quiz Réussi avec Succès !' : 'Score Insuffisant'}
                    </h4>
                    {result.passed && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-emerald-200/80 text-emerald-800 rounded-full">
                        <Sparkles className="w-3 h-3" /> Chapitre validé
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1 text-slate-700">
                    Vous avez obtenu <strong>{result.score}/{result.total}</strong> bonnes réponses,
                    soit <strong>{result.percentage}%</strong> (seuil requis : {quiz.passingScorePercent}%).
                  </p>
                  {result.passed ? (
                    <p className="text-xs text-emerald-700 mt-2 font-medium">
                      Bravo ! Le chapitre suivant est débloqué. Vous pouvez continuer votre progression.
                    </p>
                  ) : (
                    <p className="text-xs text-rose-700 mt-2 font-medium">
                      Il vous manque quelques points pour débloquer le chapitre suivant. Revoyez la vidéo et recommencez.
                    </p>
                  )}
                </div>
              </div>

              {!result.passed && (
                <button
                  id="btn-quiz-retry"
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-rose-100/60 text-rose-700 font-semibold text-xs rounded-lg border border-rose-300 shadow-sm transition flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réessayer</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {quiz.questions.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];
            const hasAnswered = selectedOpt !== undefined;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition ${
                  isSubmitted
                    ? selectedOpt === q.correctOptionIndex
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/30 border-rose-200'
                    : hasAnswered
                    ? 'border-indigo-200 bg-indigo-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Question title */}
                <div className="flex items-start gap-2.5 mb-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200">
                    {qIndex + 1}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-2 pl-8">
                  {q.options.map((optionText, optIndex) => {
                    const isOptionSelected = selectedOpt === optIndex;
                    const isCorrect = q.correctOptionIndex === optIndex;

                    let optClasses = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    if (isSubmitted) {
                      if (isCorrect) {
                        optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                      } else if (isOptionSelected && !isCorrect) {
                        optClasses = 'border-rose-500 bg-rose-50 text-rose-950 line-through ring-1 ring-rose-500';
                      } else {
                        optClasses = 'border-slate-200 bg-slate-50 text-slate-500 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      optClasses = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-600';
                    }

                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition ${optClasses}`}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={isOptionSelected}
                          disabled={isSubmitted}
                          onChange={() => handleSelectOption(q.id, optIndex)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="flex-1">{optionText}</span>
                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                        {isSubmitted && isOptionSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isSubmitted && (
                  <div className="mt-3 ml-8 p-3 rounded-lg bg-slate-100 text-xs text-slate-700 border-l-4 border-indigo-500">
                    <p className="font-semibold text-slate-800 mb-0.5">Explication pédagogique :</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {!isSubmitted && (
              <span className="text-xs text-slate-500">
                {isComplete
                  ? 'Toutes les questions sont remplies.'
                  : `Il reste ${totalQuestions - answeredCount} question(s) non répondue(s).`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isSubmitted && result?.passed && hasNextChapter && onNextChapter && (
              <button
                id="btn-quiz-next-chapter"
                onClick={() => {
                  onClose();
                  onNextChapter();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
              >
                <span>Passer au Chapitre Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {!isSubmitted ? (
              <button
                id="btn-quiz-submit"
                onClick={handleSubmit}
                disabled={!isComplete}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shadow-sm ${
                  isComplete
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Valider le Quiz</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-quiz-finish-close"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
