import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Lock,
  PlayCircle,
  HelpCircle,
  Award,
  BookOpen,
  Clock,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Info,
  MessageSquare,
  Star,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { Chapter, Course, Thematic, UserProgress, DiscussionThread, UserRole } from '../types';
import { getYouTubeEmbedUrl, formatDuration } from '../utils/youtube';
import {
  calculateCourseProgress,
  isChapterUnlocked,
  isChapterCompleted,
  getCourseDiscussionStats,
} from '../utils/storage';
import { QuizModal } from './QuizModal';
import { ChapterDiscussions } from './ChapterDiscussions';
import { CourseGeneralDiscussionsModal } from './CourseGeneralDiscussionsModal';

interface CoursePlayerViewProps {
  course: Course;
  thematic?: Thematic;
  progress: UserProgress;
  discussions: DiscussionThread[];
  userRole: UserRole;
  onBackToCatalog: () => void;
  onToggleVideoCompleted: (chapterId: string) => void;
  onPassQuiz: (chapterId: string, result: any) => void;
  onOpenDiploma: () => void;
  onAddChapterDiscussion: (
    chapterId: string,
    data: { title: string; content: string; videoTimestamp?: string }
  ) => void;
  onAddCourseComment: (
    courseId: string,
    data: { title: string; content: string; rating?: number }
  ) => void;
  onAddDiscussionReply: (threadId: string, content: string) => void;
  onToggleLikeDiscussion: (threadId: string, replyId?: string) => void;
  onToggleResolveDiscussion: (threadId: string) => void;
  isInstructor: boolean;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({
  course,
  thematic,
  progress,
  discussions,
  userRole,
  onBackToCatalog,
  onToggleVideoCompleted,
  onPassQuiz,
  onOpenDiploma,
  onAddChapterDiscussion,
  onAddCourseComment,
  onAddDiscussionReply,
  onToggleLikeDiscussion,
  onToggleResolveDiscussion,
  isInstructor,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'quiz' | 'resources' | 'discussions'>(
    'overview'
  );
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [isGeneralForumOpen, setIsGeneralForumOpen] = useState<boolean>(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  const chapters = course.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const currentVideoCompleted = !!progress.completedVideos[currentChapter.id];
  const currentQuizResult = progress.quizResults[currentChapter.id];
  const currentQuizPassed = !!currentQuizResult?.passed;
  const isCurrentChapterFullyDone = currentVideoCompleted && currentQuizPassed;

  const stats = calculateCourseProgress(course, progress);
  const discussionStats = getCourseDiscussionStats(course.id, discussions);

  const currentChapterDiscussions = discussions.filter(
    (t) => t.courseId === course.id && t.chapterId === currentChapter.id && !t.isGeneralCourseComment
  );

  const handleSelectChapter = (index: number) => {
    const unlocked = isChapterUnlocked(course, index, progress, isInstructor);
    if (!unlocked) {
      const prevCh = chapters[index - 1];
      setUnlockMessage(
        `Ce chapitre est verrouillé. Pour le débloquer, vous devez regarder la vidéo et réussir le quiz du "${prevCh?.title}".`
      );
      setTimeout(() => setUnlockMessage(null), 5000);
      return;
    }
    setActiveChapterIndex(index);
    setActiveTab('overview');
  };

  const handleNextChapter = () => {
    if (activeChapterIndex < chapters.length - 1) {
      handleSelectChapter(activeChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      handleSelectChapter(activeChapterIndex - 1);
    }
  };

  return (
    <div id="course-player-view" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Quick Actions Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="btn-back-to-catalog"
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
            {thematic && (
              <span className="hidden md:inline px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-medium">
                {thematic.name}
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 hidden md:inline text-slate-600" />
            <span className="text-slate-200 font-semibold truncate">{course.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-indigo-400 font-medium truncate">
              Chapitre {activeChapterIndex + 1}/{chapters.length}
            </span>
          </div>
        </div>

        {/* Course Progress Pill & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* General Course Forum & Reviews button */}
          <button
            id="btn-header-open-general-forum"
            onClick={() => setIsGeneralForumOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Consulter les avis et le forum général du cours"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Forum Général</span>
            {discussionStats.generalReviewsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                {discussionStats.generalReviewsCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Progression :</span>
            <span className="text-xs font-bold text-emerald-400">{stats.percentage}%</span>
            <div className="w-20 lg:w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>

          {stats.isCompleted && (
            <button
              id="btn-header-view-diploma"
              onClick={onOpenDiploma}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md transition animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>Diplôme Obtenu ! 🎓</span>
            </button>
          )}
        </div>
      </header>

      {/* Lock notification popup message if triggered */}
      {unlockMessage && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>{unlockMessage}</span>
          </div>
          <button onClick={() => setUnlockMessage(null)} className="text-slate-950 hover:underline">
            Compris
          </button>
        </div>
      )}

      {/* Main Learning Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Area (8 cols): Video Player + Interactive Controls + Tabs */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* YouTube Video Player Container */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {currentChapter.videoId ? (
              <iframe
                key={currentChapter.videoId}
                src={getYouTubeEmbedUrl(currentChapter.videoId)}
                title={currentChapter.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <PlayCircle className="w-12 h-12 mb-2" />
                <p className="text-sm">Aucune vidéo associée à ce chapitre.</p>
              </div>
            )}
          </div>

          {/* Video Status & Validation Action Bar */}
          <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCurrentChapterFullyDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                }`}
              >
                {activeChapterIndex + 1}
              </div>
              <div>
                <h2 className="font-bold text-white text-base leading-tight">
                  {currentChapter.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(currentChapter.durationMinutes)}
                  </span>
                  <span>•</span>
                  <span>Formateur : {course.instructorName}</span>
                </div>
              </div>
            </div>

            {/* Validation Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Toggle Video completion */}
              <button
                id="btn-toggle-video-watched"
                onClick={() => onToggleVideoCompleted(currentChapter.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition border ${
                  currentVideoCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentVideoCompleted ? 'Vidéo validée ✅' : 'Marquer la vidéo comme vue'}</span>
              </button>

              {/* Take Quiz Button */}
              <button
                id="btn-open-chapter-quiz"
                onClick={() => setIsQuizModalOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition ${
                  currentQuizPassed
                    ? 'bg-indigo-700/80 hover:bg-indigo-600 text-white border border-indigo-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>
                  {currentQuizPassed
                    ? `Quiz validé (${currentQuizResult?.percentage}%)`
                    : 'Passer le Quiz de validation'}
                </span>
              </button>
            </div>
          </div>

          {/* Unlock Requirements Banner if not fully done */}
          {!isCurrentChapterFullyDone && (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>
                  Conditions de déblocage du chapitre suivant :
                  <strong className={currentVideoCompleted ? 'text-emerald-400' : 'text-slate-400'}>
                    {' '}
                    1. Vidéo vue ({currentVideoCompleted ? 'Fait' : 'À faire'})
                  </strong>{' '}
                  et
                  <strong className={currentQuizPassed ? 'text-emerald-400' : 'text-slate-400'}>
                    {' '}
                    2. Quiz réussi ({currentQuizPassed ? `${currentQuizResult?.percentage}%` : 'À faire'})
                  </strong>
                  .
                </span>
              </div>
            </div>
          )}

          {/* Chapter Content Tabs */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/80 overflow-hidden">
            <div className="flex flex-wrap border-b border-slate-700/80 bg-slate-850">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 sm:px-5 py-3 text-xs font-semibold transition border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Objectifs & Résumé
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 sm:px-5 py-3 text-xs font-semibold transition border-b-2 ${
                  activeTab === 'quiz'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Quiz ({currentChapter.quiz?.questions.length || 0} questions)
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 sm:px-5 py-3 text-xs font-semibold transition border-b-2 ${
                  activeTab === 'resources'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Ressources ({currentChapter.resources?.length || 0})
              </button>
              <button
                id="btn-tab-chapter-discussions"
                onClick={() => setActiveTab('discussions')}
                className={`px-4 sm:px-5 py-3 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'discussions'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussions ({currentChapterDiscussions.length})</span>
              </button>
            </div>

            <div className="p-5 text-sm">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Description du module
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {currentChapter.description}
                    </p>
                  </div>

                  {currentChapter.keyTakeaways && currentChapter.keyTakeaways.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Compétences & Points clés abordés
                      </h3>
                      <ul className="space-y-2">
                        {currentChapter.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentChapter.lectureNotes && (
                    <div className="pt-3 border-t border-slate-800">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Guide & Support de Cours Écrit</span>
                      </h3>
                      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                        {currentChapter.lectureNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {currentChapter.quiz?.title || 'Quiz de fin de chapitre'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Seuil requis pour débloquer le chapitre suivant :{' '}
                        <strong className="text-indigo-400">
                          {currentChapter.quiz?.passingScorePercent}%
                        </strong>
                      </p>
                      {currentQuizResult && (
                        <div className="mt-2 text-xs">
                          Statut :{' '}
                          <span
                            className={`font-semibold ${
                              currentQuizResult.passed ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {currentQuizResult.passed ? 'Réussi' : 'Non validé'} (
                            {currentQuizResult.score}/{currentQuizResult.total} -{' '}
                            {currentQuizResult.percentage}%)
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setIsQuizModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                    >
                      {currentQuizResult ? 'Revoir / Recommencer' : 'Démarrer le Quiz'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-semibold">
                      Aperçu des questions évaluées :
                    </p>
                    {currentChapter.quiz?.questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-3 bg-slate-900/40 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="font-bold text-indigo-400">Q{idx + 1}.</span>
                        <span>{q.question}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {currentChapter.resources && currentChapter.resources.length > 0 ? (
                    currentChapter.resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-slate-900/60 hover:bg-slate-900 rounded-lg border border-slate-700/80 flex items-center justify-between text-xs text-slate-200 transition group"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                          <span className="font-medium group-hover:text-indigo-300">
                            {res.title}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">Aucune ressource supplémentaire.</p>
                  )}
                </div>
              )}

              {activeTab === 'discussions' && (
                <ChapterDiscussions
                  course={course}
                  chapter={currentChapter}
                  discussions={discussions}
                  userRole={userRole}
                  studentName={progress.studentName}
                  onAddQuestion={(data) => onAddChapterDiscussion(currentChapter.id, data)}
                  onAddReply={onAddDiscussionReply}
                  onToggleLike={onToggleLikeDiscussion}
                  onToggleResolve={onToggleResolveDiscussion}
                  onOpenGeneralForum={() => setIsGeneralForumOpen(true)}
                />
              )}
            </div>
          </div>

          {/* Bottom Chapter Navigation bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevChapter}
              disabled={activeChapterIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <span>← Chapitre précédent</span>
            </button>

            {activeChapterIndex < chapters.length - 1 ? (
              <button
                onClick={handleNextChapter}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg transition ${
                  isChapterUnlocked(course, activeChapterIndex + 1, progress, isInstructor)
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <span>Chapitre suivant</span>
                {isChapterUnlocked(course, activeChapterIndex + 1, progress, isInstructor) ? (
                  <span>→</span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            ) : (
              stats.isCompleted && (
                <button
                  onClick={onOpenDiploma}
                  className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-md hover:from-amber-400 hover:to-amber-500 transition animate-bounce"
                >
                  <Award className="w-4 h-4" />
                  <span>Obtenir mon diplôme !</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Right Area (4 cols): Course Outline (Moodle Style Sommaire) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Sommaire Card */}
          <div className="bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/80 p-5 shadow-xl sticky top-16">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Sommaire du Cours</span>
              </div>
              <span className="text-xs text-slate-400">
                {stats.completedChapters}/{stats.totalChapters} validés
              </span>
            </div>

            {/* Progress breakdown */}
            <div className="py-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Progression globale</span>
                <span className="font-bold text-emerald-400">{stats.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

            {/* Chapters list in chronological order */}
            <div className="space-y-2 mt-2 max-h-[380px] overflow-y-auto pr-1">
              {chapters.map((ch, index) => {
                const isSelected = index === activeChapterIndex;
                const unlocked = isChapterUnlocked(course, index, progress, isInstructor);
                const videoDone = !!progress.completedVideos[ch.id];
                const quizRes = progress.quizResults[ch.id];
                const quizDone = !!quizRes?.passed;
                const fullyDone = videoDone && quizDone;

                return (
                  <div
                    key={ch.id}
                    onClick={() => handleSelectChapter(index)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/50'
                        : unlocked
                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        : 'bg-slate-900/20 border-slate-800/50 text-slate-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Status indicator icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {fullyDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : unlocked ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold truncate text-slate-200">
                            {ch.title}
                          </p>
                          <span className="text-[10px] text-slate-500 flex-shrink-0">
                            {formatDuration(ch.durationMinutes)}
                          </span>
                        </div>

                        {/* Badges for video and quiz status */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              videoDone
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            Vidéo {videoDone ? '✓' : '○'}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              quizDone
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            Quiz {quizDone ? `${quizRes?.percentage}%` : '○'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Certification / Diploma Status Card */}
            <div className="mt-5 pt-4 border-t border-slate-700/80">
              <div
                className={`p-4 rounded-xl border transition ${
                  stats.isCompleted
                    ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg ${
                      stats.isCompleted
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      Diplôme de fin de formation
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {stats.isCompleted
                        ? 'Tous les chapitres validés !'
                        : `Encore ${stats.totalChapters - stats.completedChapters} chapitre(s) à valider`}
                    </p>
                  </div>
                </div>

                {stats.isCompleted ? (
                  <button
                    id="btn-sidebar-view-diploma"
                    onClick={onOpenDiploma}
                    className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Consulter & Imprimer le Diplôme</span>
                  </button>
                ) : (
                  <div className="mt-2.5 text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-600 flex-shrink-0" />
                    <span>Se débloque automatiquement à 100% de réussite.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Community & Reviews Card */}
            <div className="mt-4 pt-4 border-t border-slate-700/80">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Avis & Forum du cours
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{discussionStats.averageRating}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  {discussionStats.generalReviewsCount} avis déposés • {discussionStats.totalThreads} questions posées au total.
                </p>

                <button
                  id="btn-sidebar-open-general-forum"
                  onClick={() => setIsGeneralForumOpen(true)}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Consulter le Forum Général</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal if open */}
      {isQuizModalOpen && (
        <QuizModal
          chapter={currentChapter}
          previousResult={currentQuizResult}
          onClose={() => setIsQuizModalOpen(false)}
          onPassQuiz={(result) => {
            onPassQuiz(currentChapter.id, result);
          }}
          hasNextChapter={activeChapterIndex < chapters.length - 1}
          onNextChapter={handleNextChapter}
        />
      )}

      {/* General Course Forum & Reviews Modal */}
      {isGeneralForumOpen && (
        <CourseGeneralDiscussionsModal
          course={course}
          thematic={thematic}
          discussions={discussions}
          userRole={userRole}
          studentName={progress.studentName}
          isOpen={isGeneralForumOpen}
          onClose={() => setIsGeneralForumOpen(false)}
          onAddCourseComment={(data) => onAddCourseComment(course.id, data)}
          onAddReply={onAddDiscussionReply}
          onToggleLike={onToggleLikeDiscussion}
        />
      )}
    </div>
  );
};
