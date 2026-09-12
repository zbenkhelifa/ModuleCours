import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  BarChart3,
  User,
  Shield,
  CheckCircle,
  Plus,
  Sparkles,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { UserRole, UserProgress, QuizAttemptResult, AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  userRole: UserRole;
  progress: UserProgress;
  onNavigateCatalog: () => void;
  onNavigateAdmin: () => void;
  onOpenProgressTracker: () => void;
  onSelectRole: (role: UserRole) => void;
  onOpenCreateCourse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  userRole,
  progress,
  onNavigateCatalog,
  onNavigateAdmin,
  onOpenProgressTracker,
  onSelectRole,
  onOpenCreateCourse,
}) => {
  const passedQuizzesCount = (Object.values(progress.quizResults) as QuizAttemptResult[]).filter((r) => r.passed).length;
  const completedCoursesCount = Object.keys(progress.completedCourses).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={onNavigateCatalog}
          className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">EduMoodle</span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                LMS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
              Plateforme E-learning • YouTube & Quizz
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Catalogue Button */}
          <button
            id="nav-btn-catalog"
            onClick={onNavigateCatalog}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              currentView === 'catalog'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Catalogue</span>
          </button>

          {/* Admin Console Navigation Link */}
          <button
            id="nav-btn-admin-console"
            onClick={onNavigateAdmin}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              currentView === 'admin'
                ? 'bg-amber-100 text-amber-950 font-extrabold border border-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50'
            }`}
            title="Accéder au panneau d'administration pour créer et modifier les cours"
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Console Admin</span>
          </button>

          {/* Student Progress & Badges */}
          <button
            id="nav-btn-progress"
            onClick={onOpenProgressTracker}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
            title="Consulter votre suivi académique"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Suivi & Badges</span>
            {passedQuizzesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                {passedQuizzesCount}
              </span>
            )}
          </button>

          {/* New Course Button (Shortcut for Admin/Instructor) */}
          {(userRole === 'admin' || userRole === 'instructor' || currentView === 'admin') && (
            <button
              id="nav-btn-create-course"
              onClick={onOpenCreateCourse}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition"
              title="Créer un nouveau module de formation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Créer Module</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Role Switcher Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              id="role-btn-student"
              onClick={() => onSelectRole('student')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                userRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mode Étudiant : Parcours vidéo, réalisation de quiz et obtention de diplôme"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Étudiant</span>
            </button>

            <button
              id="role-btn-admin"
              onClick={() => onSelectRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                userRole === 'admin' || userRole === 'instructor'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mode Admin : Créer, modifier les modules, intégrer des vidéos YouTube et gérer les quiz"
            >
              <Shield className="w-3.5 h-3.5 text-slate-950" />
              <span>Admin ⚙️</span>
            </button>
          </div>

          {/* Student Profile Identity Chip */}
          <div
            onClick={onOpenProgressTracker}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition hidden sm:flex"
            title="Modifier le profil apprenant et les informations de diplôme"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                {progress.studentName || 'Apprenant'}
              </p>
              <p className="text-[10px] text-slate-500">
                {completedCoursesCount > 0 ? '🎓 Diplômé' : 'Apprenant'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
