import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle,
  Clock,
  BookOpen,
  Trophy,
  Star,
  User,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import { Course, Thematic, UserProgress, QuizAttemptResult } from '../types';
import { calculateCourseProgress } from '../utils/storage';

interface ProgressTrackerModalProps {
  courses: Course[];
  thematics: Thematic[];
  progress: UserProgress;
  onClose: () => void;
  onUpdateStudentInfo: (name: string, email: string) => void;
  onOpenDiplomaForCourse: (course: Course) => void;
  onResetProgress: () => void;
  onImportData?: (jsonData: string) => void;
}

export const ProgressTrackerModal: React.FC<ProgressTrackerModalProps> = ({
  courses,
  progress,
  onClose,
  onUpdateStudentInfo,
  onOpenDiplomaForCourse,
  onResetProgress,
}) => {
  const [studentName, setStudentName] = useState(progress.studentName || '');
  const [studentEmail, setStudentEmail] = useState(progress.studentEmail || '');
  const [isSaved, setIsSaved] = useState(false);

  // Global calculations
  let totalChaptersAllCourses = 0;
  let totalChaptersCompleted = 0;
  let totalQuizzesAttempted = 0;
  let scoreSum = 0;
  let completedCoursesCount = 0;

  courses.forEach((c) => {
    const stats = calculateCourseProgress(c, progress);
    totalChaptersAllCourses += stats.totalChapters;
    totalChaptersCompleted += stats.completedChapters;
    if (stats.isCompleted) {
      completedCoursesCount += 1;
    }
  });

  const quizResultsList = Object.values(progress.quizResults) as QuizAttemptResult[];
  const totalQuizzesPassed = quizResultsList.filter((r) => r.passed).length;

  quizResultsList.forEach((qr) => {
    totalQuizzesAttempted += 1;
    scoreSum += qr.percentage;
  });

  const averageQuizScore =
    totalQuizzesAttempted > 0 ? Math.round(scoreSum / totalQuizzesAttempted) : 0;
  const globalCompletionRate =
    totalChaptersAllCourses > 0
      ? Math.round((totalChaptersCompleted / totalChaptersAllCourses) * 100)
      : 0;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudentInfo(studentName, studentEmail);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Gamified Badges
  const badges = [
    {
      id: 'b-first-video',
      title: 'Premiers Pas',
      desc: 'Avoir visionné au moins une vidéo de formation',
      unlocked: Object.keys(progress.completedVideos).length > 0,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'b-quiz-master',
      title: 'Expert des Quiz',
      desc: 'Avoir réussi au moins 2 quiz avec plus de 80%',
      unlocked:
        quizResultsList.filter((r) => r.passed && r.percentage >= 80).length >= 2,
      icon: Star,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'b-halfway',
      title: 'Mi-Parcours',
      desc: 'Avoir validé au moins la moitié d’un cursus',
      unlocked: globalCompletionRate >= 30,
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'b-certified',
      title: 'Diplômé Certifié',
      desc: 'Avoir décroché son premier diplôme officiel',
      unlocked: completedCoursesCount > 0,
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div
      id="progress-tracker-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="progress-tracker-container"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Mon Suivi de Progression & Certifications</h3>
              <p className="text-xs text-slate-400">Tableau de bord académique de vos formations et diplômes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* High-level stats KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Taux de complétion
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">{globalCompletionRate}%</p>
              <span className="text-[11px] text-slate-500">
                {totalChaptersCompleted}/{totalChaptersAllCourses} chapitres
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quiz Validés
              </span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{totalQuizzesPassed}</p>
              <span className="text-[11px] text-slate-500">
                {totalQuizzesAttempted} tentative(s)
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Moyenne aux Quiz
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {averageQuizScore}%
              </p>
              <span className="text-[11px] text-slate-500">Score global d'évaluation</span>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3.5 rounded-xl border border-amber-300">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Diplômes Décrochés
              </span>
              <p className="text-2xl font-black text-amber-900 mt-1">{completedCoursesCount}</p>
              <span className="text-[11px] text-amber-700">Certificats officiels</span>
            </div>
          </div>

          {/* Student Profile Identity for Diplomas */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-xs">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Identité de l'Apprenant (figurant sur les Diplômes)</span>
            </div>
            <form onSubmit={handleSaveInfo} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
                >
                  {isSaved ? 'Enregistré avec succès !' : 'Mettre à jour l’identité'}
                </button>
              </div>
            </form>
          </div>

          {/* Badges & Achievements */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Badges de Progression</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border transition flex items-start gap-3 ${
                      b.unlocked
                        ? 'bg-white border-slate-300 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-tr ${
                        b.unlocked ? b.color : 'from-slate-400 to-slate-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{b.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{b.desc}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold ${
                          b.unlocked ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {b.unlocked ? 'Débloqué ✓' : 'Verrouillé 🔒'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Course Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Progression Détaillée par Formation
            </h4>
            <div className="space-y-3">
              {courses.map((course) => {
                const stats = calculateCourseProgress(course, progress);
                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{course.title}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {stats.completedChapters} sur {stats.totalChapters} chapitres validés •{' '}
                          {stats.totalQuizzesPassed} quiz réussis
                        </p>
                      </div>

                      {stats.isCompleted ? (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDiplomaForCourse(course);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition self-start sm:self-auto"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Voir le Diplôme</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium self-start sm:self-auto">
                          En cours ({stats.percentage}%)
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Voulez-vous vraiment réinitialiser toute votre progression de formation ? Vos quiz et validations seront remis à zéro.'
                )
              ) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser la progression</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
