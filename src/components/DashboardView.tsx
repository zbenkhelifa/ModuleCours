import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  Award,
  Clock,
  User,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  Filter,
  GraduationCap,
  MessageSquare,
  Star,
} from 'lucide-react';
import { Course, Thematic, UserProgress, DiscussionThread } from '../types';
import { calculateCourseProgress, getCourseDiscussionStats } from '../utils/storage';

interface DashboardViewProps {
  courses: Course[];
  thematics: Thematic[];
  progress: UserProgress;
  discussions: DiscussionThread[];
  onSelectCourse: (course: Course) => void;
  onOpenDiploma: (course: Course) => void;
  onOpenCreateCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onOpenCourseDiscussions?: (course: Course) => void;
  isInstructor: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  thematics,
  progress,
  discussions,
  onSelectCourse,
  onOpenDiploma,
  onOpenCreateCourse,
  onEditCourse,
  onDeleteCourse,
  onOpenCourseDiscussions,
  isInstructor,
}) => {
  const [selectedThematicId, setSelectedThematicId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchThematic =
      selectedThematicId === 'all' || course.thematicId === selectedThematicId;
    const matchLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchQuery =
      searchQuery.trim() === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchThematic && matchLevel && matchQuery;
  });

  // Calculate overall stats for hero banner
  let totalCertificatesEarned = 0;
  let totalChaptersCompleted = 0;
  courses.forEach((c) => {
    const stats = calculateCourseProgress(c, progress);
    if (stats.isCompleted) totalCertificatesEarned += 1;
    totalChaptersCompleted += stats.completedChapters;
  });

  return (
    <div id="dashboard-catalog-view" className="space-y-8 pb-16">
      {/* Banner / Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>Plateforme Pédagogique Numérique • Style Moodle</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Formations Vidéo, Évaluations par Chapitre & Certification
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Suivez vos formations en vidéo YouTube, validez chaque fin de chapitre grâce aux quiz interactifs pour débloquer la suite de votre cursus et obtenez votre diplôme certifié officiel.
          </p>

          {/* Quick learning rule reminder */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-white/5 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 max-w-2xl">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Visionnez la vidéo</span>
            </div>
            <span className="text-slate-500">→</span>
            <div className="flex items-center gap-2 font-medium">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Réussissez le quiz (≥ 70%)</span>
            </div>
            <span className="text-slate-500">→</span>
            <div className="flex items-center gap-2 font-medium">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Débloquez le chapitre suivant</span>
            </div>
            <span className="text-slate-500">→</span>
            <div className="flex items-center gap-2 font-medium text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Décrochez le Diplôme 🎓</span>
            </div>
          </div>
        </div>

        {/* Global Progress pill on the right */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8 bg-slate-800/90 backdrop-blur rounded-xl p-4 border border-slate-700/80 shadow-lg text-xs">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-slate-400 font-semibold">Votre Palmarès</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {totalCertificatesEarned} diplôme(s)
            </span>
          </div>
          <div className="text-slate-300">
            <strong>{totalChaptersCompleted}</strong> chapitres validés au total
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Thematic Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              id="filter-thematic-all"
              onClick={() => setSelectedThematicId('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedThematicId === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Toutes les thématiques
            </button>
            {thematics.map((t) => (
              <button
                key={t.id}
                id={`filter-thematic-${t.id}`}
                onClick={() => setSelectedThematicId(t.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedThematicId === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* New Course Action (if instructor or creator) */}
          {isInstructor && (
            <button
              id="btn-create-course-header"
              onClick={onOpenCreateCourse}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Poster une nouvelle formation</span>
            </button>
          )}
        </div>

        {/* Search & Level Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une formation, un sujet, un enseignant..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-700 shadow-sm"
            >
              <option value="all">Tous les niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseThematic = thematics.find((t) => t.id === course.thematicId);
            const stats = calculateCourseProgress(course, progress);
            const discStats = getCourseDiscussionStats(course.id, discussions || []);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden group"
              >
                {/* Course Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Badges Over Thumbnail */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold">
                      {courseThematic?.name || 'Formation'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600/90 backdrop-blur text-white text-[10px] font-semibold">
                      {course.level}
                    </span>
                  </div>

                  {stats.isCompleted && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md">
                      <Award className="w-3 h-3" />
                      <span>DIPLÔMÉ</span>
                    </div>
                  )}

                  {/* Play Overlay Indicator */}
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {course.chapters.length} chapitres
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {course.instructorName}
                      </span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCourseDiscussions?.(course);
                        }}
                        className="flex items-center gap-1 font-semibold text-amber-600 hover:text-amber-700 transition"
                        title="Consulter les avis et le forum général"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{discStats.averageRating}</span>
                        <span className="text-slate-400 font-normal">
                          ({discStats.generalReviewsCount})
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-600">Progression</span>
                        <span
                          className={`font-bold ${
                            stats.isCompleted ? 'text-amber-600' : 'text-slate-800'
                          }`}
                        >
                          {stats.completedChapters}/{stats.totalChapters} chapitres ({stats.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            stats.isCompleted
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                              : 'bg-indigo-600'
                          }`}
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Primary Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                          stats.isCompleted
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : stats.percentage > 0
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {stats.isCompleted
                            ? 'Revoir les modules'
                            : stats.percentage > 0
                            ? 'Continuer la formation'
                            : 'Démarrer le cours'}
                        </span>
                      </button>

                      {onOpenCourseDiscussions && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCourseDiscussions(course);
                          }}
                          title="Avis et forum général de la formation"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition shadow-xs flex items-center justify-center"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}

                      {stats.isCompleted && (
                        <button
                          onClick={() => onOpenDiploma(course)}
                          title="Consulter et imprimer le diplôme officiel"
                          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm flex items-center justify-center"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      )}

                      {/* Instructor Edit & Delete Actions */}
                      {isInstructor && (
                        <div className="flex items-center gap-1 pl-1">
                          <button
                            onClick={() => onEditCourse(course)}
                            title="Modifier la formation & vidéos"
                            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer la formation "${course.title}" ?`)) {
                                onDeleteCourse(course.id);
                              }
                            }}
                            title="Supprimer la formation"
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">Aucune formation trouvée</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Aucun résultat ne correspond à vos critères de recherche. Essayez de réinitialiser vos filtres.
          </p>
          <button
            onClick={() => {
              setSelectedThematicId('all');
              setSearchQuery('');
              setSelectedLevel('all');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
