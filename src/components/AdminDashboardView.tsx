import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  BookOpen,
  Youtube,
  HelpCircle,
  FolderPlus,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Award,
  AlertCircle,
  FileText,
  X,
  ExternalLink,
  Save,
} from 'lucide-react';
import { Course, Thematic, Chapter, QuizQuestion } from '../types';
import { getYouTubeThumbnailUrl } from '../utils/youtube';

interface AdminDashboardViewProps {
  courses: Course[];
  thematics: Thematic[];
  onOpenCreateCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onDuplicateCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onAddChapterToCourse: (course: Course) => void;
  onSaveThematic: (thematic: Thematic) => void;
  onDeleteThematic: (thematicId: string) => void;
  onSwitchToStudentView: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  courses,
  thematics,
  onOpenCreateCourse,
  onEditCourse,
  onDeleteCourse,
  onDuplicateCourse,
  onPreviewCourse,
  onAddChapterToCourse,
  onSaveThematic,
  onDeleteThematic,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'thematics' | 'quizzes'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [thematicFilter, setThematicFilter] = useState('all');
  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState<string | null>(null);

  // Thematic Modal State
  const [isThematicModalOpen, setIsThematicModalOpen] = useState(false);
  const [thematicName, setThematicName] = useState('');
  const [thematicDescription, setThematicDescription] = useState('');
  const [thematicColor, setThematicColor] = useState('bg-indigo-600');

  // Quiz Preview Modal
  const [previewQuizChapter, setPreviewQuizChapter] = useState<{
    courseTitle: string;
    chapter: Chapter;
  } | null>(null);

  // Calculate Metrics
  const totalCourses = courses.length;
  const totalChapters = courses.reduce((sum, c) => sum + c.chapters.length, 0);
  const totalVideosDurationMinutes = courses.reduce(
    (sum, c) => sum + c.chapters.reduce((s, ch) => s + (ch.durationMinutes || 0), 0),
    0
  );
  const totalQuizzes = courses.reduce(
    (sum, c) => sum + c.chapters.filter((ch) => ch.quiz && ch.quiz.questions.length > 0).length,
    0
  );
  const totalQuizQuestions = courses.reduce(
    (sum, c) => sum + c.chapters.reduce((s, ch) => s + (ch.quiz?.questions?.length || 0), 0),
    0
  );

  // Filtered Courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesThematic = thematicFilter === 'all' || c.thematicId === thematicFilter;
    return matchesSearch && matchesThematic;
  });

  const handleCreateThematicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thematicName.trim()) return;

    const slug = thematicName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newThematic: Thematic = {
      id: `theme-${Date.now()}`,
      name: thematicName.trim(),
      slug: slug || `theme-${Date.now()}`,
      description: thematicDescription.trim() || `Parcours pédagogique en ${thematicName.trim()}`,
      color: thematicColor,
      iconName: 'Sparkles',
    };

    onSaveThematic(newThematic);
    setThematicName('');
    setThematicDescription('');
    setIsThematicModalOpen(false);
  };

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Admin Top Header Banner */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-900/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  Console d'Administration & Gestion
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Mode Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Créez et modifiez les modules, intégrez des vidéos YouTube, enrichissez les cours et configurez les quizz.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-admin-switch-student"
              onClick={onSwitchToStudentView}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              title="Prévisualiser la plateforme avec l'interface étudiante"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Voir vue Apprenant</span>
            </button>

            <button
              id="btn-admin-create-thematic"
              onClick={() => setIsThematicModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Nouvelle Thématique</span>
            </button>

            <button
              id="btn-admin-create-course"
              onClick={onOpenCreateCourse}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Créer un Nouveau Module</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Formations & Modules</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalCourses}</p>
            <p className="text-[11px] text-slate-400">Modules publiés et certifiants</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Chapitres & Liens YT</span>
              <Youtube className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalChapters}</p>
            <p className="text-[11px] text-slate-400">
              ~{Math.round(totalVideosDurationMinutes / 60)}h de vidéos pédagogiques
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Quizz & Évaluations</span>
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalQuizzes}</p>
            <p className="text-[11px] text-slate-400">{totalQuizQuestions} questions à choix multiples</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Catégories d'Enseignement</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{thematics.length}</p>
            <p className="text-[11px] text-slate-400">Thématiques actives</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              id="tab-admin-modules"
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'modules'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Gestion des Modules & Cours ({courses.length})</span>
            </button>

            <button
              id="tab-admin-thematics"
              onClick={() => setActiveTab('thematics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'thematics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Thématiques & Catégories ({thematics.length})</span>
            </button>

            <button
              id="tab-admin-quizzes"
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'quizzes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Centre de Contrôle des Quizz ({totalQuizzes})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MODULES & COURSES */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un module, mot-clé, formateur..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Filtrer par thématique :</span>
                <select
                  value={thematicFilter}
                  onChange={(e) => setThematicFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Toutes les thématiques</option>
                  {thematics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses Table / Cards */}
            <div className="space-y-3">
              {filteredCourses.length === 0 ? (
                <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800">
                  <p className="text-slate-400 text-sm">Aucun module ne correspond aux critères.</p>
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const thematic = thematics.find((t) => t.id === course.thematicId);
                  const firstVideoId = course.chapters[0]?.videoId || 'SqcY0GlETPk';
                  const thumb = course.thumbnailUrl || getYouTubeThumbnailUrl(firstVideoId, 'hq');
                  const totalQuizInCourse = course.chapters.filter(
                    (ch) => ch.quiz && ch.quiz.questions.length > 0
                  ).length;
                  const totalQuestionsInCourse = course.chapters.reduce(
                    (sum, ch) => sum + (ch.quiz?.questions.length || 0),
                    0
                  );

                  return (
                    <div
                      key={course.id}
                      className="p-4 sm:p-5 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-slate-600 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div className="relative w-28 sm:w-36 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-700">
                          <img
                            src={thumb}
                            alt={course.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-bold text-white flex items-center gap-1">
                            <Youtube className="w-3 h-3 text-red-500" />
                            <span>{course.chapters.length} chap.</span>
                          </div>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {thematic && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${thematic.color || 'bg-indigo-600'}`}
                              >
                                {thematic.name}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {course.level}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> ~{course.estimatedHours}h
                            </span>
                          </div>

                          <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-xl">
                            {course.title}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                            {course.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                            <span>Formateur : <strong className="text-slate-200">{course.instructorName}</strong></span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              {totalQuizInCourse} quiz ({totalQuestionsInCourse} questions)
                            </span>
                            <span>•</span>
                            <span className="text-indigo-400 truncate max-w-xs" title={course.certificateTitle}>
                              🎓 {course.certificateTitle}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions Toolbar */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-700/60 justify-end">
                        <button
                          onClick={() => onPreviewCourse(course)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                          title="Lancer le lecteur de cours en tant qu'étudiant"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Aperçu</span>
                        </button>

                        <button
                          onClick={() => onAddChapterToCourse(course)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition flex items-center gap-1.5"
                          title="Ajouter un chapitre et vidéo YouTube directement à ce module"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Chapitre / Vidéo</span>
                        </button>

                        <button
                          onClick={() => onEditCourse(course)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                          title="Modifier les contenus, vidéos, quiz et paramètres du module"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>

                        <button
                          onClick={() => onDuplicateCourse(course)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition"
                          title="Dupliquer ce module"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setConfirmDeleteCourseId(course.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-xs transition"
                          title="Supprimer ce module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: THEMATICS & CATEGORIES */}
        {activeTab === 'thematics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <div>
                <h3 className="font-bold text-white text-sm">Gestion des Catégories Pédagogiques</h3>
                <p className="text-xs text-slate-400">
                  Organisez vos modules par filière d'enseignement pour faciliter la recherche des apprenants.
                </p>
              </div>
              <button
                onClick={() => setIsThematicModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une Thématique</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thematics.map((thematic) => {
                const count = courses.filter((c) => c.thematicId === thematic.id).length;
                return (
                  <div
                    key={thematic.id}
                    className="p-5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-md text-white ${thematic.color || 'bg-indigo-600'}`}
                        >
                          {thematic.name}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          {count} module{count > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {thematic.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs text-slate-400">
                      <span className="font-mono text-[10px] text-slate-500">slug: {thematic.slug}</span>
                      {thematics.length > 1 && count === 0 && (
                        <button
                          onClick={() => onDeleteThematic(thematic.id)}
                          className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES CONTROL CENTER */}
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <h3 className="font-bold text-white text-sm">Centre de Contrôle Pédagogique des Quizz</h3>
              <p className="text-xs text-slate-400">
                Chaque chapitre doit disposer d'un quizz de validation obligatoire pour certifier l'acquisition des compétences.
              </p>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <span>{course.title}</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        {course.chapters.length} chapitres configurés
                      </p>
                    </div>

                    <button
                      onClick={() => onEditCourse(course)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Éditer les Quizz du Module</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {course.chapters.map((chapter, idx) => {
                      const quiz = chapter.quiz;
                      const qCount = quiz?.questions?.length || 0;
                      return (
                        <div
                          key={chapter.id}
                          className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/80 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-300 truncate">
                              Ch.{idx + 1} : {chapter.title}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>
                              Questions : <strong className="text-white">{qCount}</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-bold">
                              Seuil : {quiz?.passingScorePercent || 70}%
                            </span>
                          </div>

                          {qCount > 0 && (
                            <button
                              onClick={() =>
                                setPreviewQuizChapter({
                                  courseTitle: course.title,
                                  chapter,
                                })
                              }
                              className="w-full py-1.5 mt-1 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-center rounded font-semibold transition text-[11px]"
                            >
                              Prévisualiser les questions ({qCount})
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add Thematic */}
      {isThematicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>Nouvelle Thématique Pédagogique</span>
              </h3>
              <button
                onClick={() => setIsThematicModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThematicSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  required
                  value={thematicName}
                  onChange={(e) => setThematicName(e.target.value)}
                  placeholder="Ex: Intelligence Artificielle & Data Science"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={thematicDescription}
                  onChange={(e) => setThematicDescription(e.target.value)}
                  placeholder="Objectif de cette filière..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Couleur du badge</label>
                <select
                  value={thematicColor}
                  onChange={(e) => setThematicColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="bg-indigo-600">Indigo (Défaut)</option>
                  <option value="bg-emerald-600">Émeraude / Vert</option>
                  <option value="bg-rose-600">Rose / Rouge</option>
                  <option value="bg-amber-600">Ambre / Orange</option>
                  <option value="bg-sky-600">Bleu Ciel</option>
                  <option value="bg-purple-600">Violet Royal</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsThematicModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow"
                >
                  Créer la Thématique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Quiz Preview */}
      {previewQuizChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <span>Aperçu du Quiz de Chapitre</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {previewQuizChapter.courseTitle} • {previewQuizChapter.chapter.title}
                </p>
              </div>
              <button
                onClick={() => setPreviewQuizChapter(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-950/60 rounded-lg border border-indigo-800 flex items-center justify-between">
                <span className="text-indigo-200">
                  Titre : <strong>{previewQuizChapter.chapter.quiz?.title}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold">
                  Seuil : {previewQuizChapter.chapter.quiz?.passingScorePercent}%
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {previewQuizChapter.chapter.quiz?.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2"
                  >
                    <p className="font-bold text-slate-200">
                      Question {idx + 1} : {q.question}
                    </p>

                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                            oIdx === q.correctOptionIndex
                              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-semibold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">
                            {oIdx === q.correctOptionIndex ? '✓' : oIdx + 1}
                          </span>
                          <span>{opt}</span>
                          {oIdx === q.correctOptionIndex && (
                            <span className="ml-auto text-[10px] text-emerald-400 uppercase font-bold">
                              Bonne Réponse
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800">
                        💡 <em>Explication :</em> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewQuizChapter(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Fermer l'aperçu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteCourseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-white">Confirmer la suppression</h3>
            </div>
            <p className="text-xs text-slate-300">
              Êtes-vous certain de vouloir supprimer ce module et l'ensemble de ses vidéos, quizz et ressources associées ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteCourseId(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteCourse(confirmDeleteCourseId);
                  setConfirmDeleteCourseId(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Oui, supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
