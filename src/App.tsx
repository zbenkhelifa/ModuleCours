/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CoursePlayerView } from './components/CoursePlayerView';
import { DiplomaModal } from './components/DiplomaModal';
import { CourseEditorModal } from './components/CourseEditorModal';
import { ProgressTrackerModal } from './components/ProgressTrackerModal';
import { CourseGeneralDiscussionsModal } from './components/CourseGeneralDiscussionsModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import {
  Course,
  Thematic,
  UserProgress,
  UserRole,
  QuizAttemptResult,
  DiscussionThread,
  DiscussionReply,
  AppView,
  Chapter,
} from './types';
import {
  loadCourses,
  saveCourses,
  loadThematics,
  saveThematics,
  loadUserProgress,
  saveUserProgress,
  loadDiscussions,
  saveDiscussions,
  calculateCourseProgress,
  generateCertificateId,
  DEFAULT_USER_PROGRESS,
} from './utils/storage';
import { Sparkles, Award, Shield, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [thematics, setThematics] = useState<Thematic[]>([]);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Navigation & Role State
  const [currentView, setCurrentView] = useState<AppView>('catalog');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');

  // Modals
  const [diplomaCourse, setDiplomaCourse] = useState<Course | null>(null);
  const [generalDiscussionsCourse, setGeneralDiscussionsCourse] = useState<Course | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
  const [isCourseEditorOpen, setIsCourseEditorOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Initialize from storage on mount
  useEffect(() => {
    const loadedCourses = loadCourses();
    const loadedThematics = loadThematics();
    const loadedProgress = loadUserProgress();
    const loadedDiscussions = loadDiscussions();

    setCourses(loadedCourses);
    setThematics(loadedThematics);
    setProgress(loadedProgress);
    setDiscussions(loadedDiscussions);
    setIsLoaded(true);
  }, []);

  // Sync to storage on state change
  const updateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveUserProgress(newProgress);
  };

  const updateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    saveCourses(newCourses);
  };

  const updateThematics = (newThematics: Thematic[]) => {
    setThematics(newThematics);
    saveThematics(newThematics);
  };

  const updateDiscussions = (newDiscussions: DiscussionThread[]) => {
    setDiscussions(newDiscussions);
    saveDiscussions(newDiscussions);
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Find active course
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || null;
  const activeThematic = activeCourse
    ? thematics.find((t) => t.id === activeCourse.thematicId)
    : undefined;

  // Toggle Video watched for a chapter
  const handleToggleVideo = (chapterId: string) => {
    if (!activeCourse) return;

    const currentWatched = !!progress.completedVideos[chapterId];
    const updatedVideos = {
      ...progress.completedVideos,
      [chapterId]: !currentWatched,
    };

    const newProgress: UserProgress = {
      ...progress,
      completedVideos: updatedVideos,
    };

    checkCourseCompletion(activeCourse, newProgress);
    updateProgress(newProgress);

    if (!currentWatched) {
      showToast('Vidéo validée ! Réussissez le quiz pour débloquer la suite.');
    }
  };

  // Pass quiz for a chapter
  const handlePassQuiz = (chapterId: string, result: QuizAttemptResult) => {
    if (!activeCourse) return;

    const updatedQuizResults = {
      ...progress.quizResults,
      [chapterId]: result,
    };

    const newProgress: UserProgress = {
      ...progress,
      quizResults: updatedQuizResults,
    };

    checkCourseCompletion(activeCourse, newProgress);
    updateProgress(newProgress);

    if (result.passed) {
      showToast(`Quiz réussi avec ${result.score}/${result.total} (${result.percentage}%) !`);
    }
  };

  // Check if all chapters in course are finished
  const checkCourseCompletion = (course: Course, currentProg: UserProgress) => {
    const allDone = course.chapters.every((ch) => {
      const vid = !!currentProg.completedVideos[ch.id];
      const quiz = !!currentProg.quizResults[ch.id]?.passed;
      return vid && quiz;
    });

    if (allDone && !currentProg.completedCourses[course.id]) {
      const certId = generateCertificateId(course.id, currentProg.studentName);

      let total = 0;
      let count = 0;
      course.chapters.forEach((ch) => {
        const q = currentProg.quizResults[ch.id];
        if (q) {
          total += q.percentage;
          count += 1;
        }
      });
      const avg = count > 0 ? Math.round(total / count) : 100;
      let finalGrade = 'Mention Bien';
      if (avg >= 95) finalGrade = 'Mention Très Honorable avec Félicitations';
      else if (avg >= 85) finalGrade = 'Mention Très Bien';

      const completed = {
        ...currentProg.completedCourses,
        [course.id]: {
          completedAt: new Date().toISOString(),
          certificateId: certId,
          finalGrade,
          averageScore: avg,
        },
      };

      currentProg.completedCourses = completed;
      showToast(`🎓 Félicitations ! Vous avez décroché le diplôme : ${course.certificateTitle} !`);
    }
  };

  // Student name update
  const handleUpdateStudentName = (name: string) => {
    const updated: UserProgress = {
      ...progress,
      studentName: name,
    };
    updateProgress(updated);
    showToast(`Nom mis à jour : ${name}`);
  };

  // Student info update (from ProgressTrackerModal)
  const handleUpdateStudentInfo = (name: string, email: string) => {
    const updated: UserProgress = {
      ...progress,
      studentName: name,
      studentEmail: email,
    };
    updateProgress(updated);
  };

  // Save new or edited course
  const handleSaveCourse = (savedCourse: Course) => {
    const exists = courses.some((c) => c.id === savedCourse.id);
    let updatedCourses: Course[];
    if (exists) {
      updatedCourses = courses.map((c) => (c.id === savedCourse.id ? savedCourse : c));
      showToast('Formation et éléments de cours mis à jour avec succès.');
    } else {
      updatedCourses = [savedCourse, ...courses];
      showToast('Nouveau module créé avec succès dans EduMoodle.');
    }

    updateCourses(updatedCourses);
    setIsCourseEditorOpen(false);
    setEditingCourse(null);
  };

  // Delete course
  const handleDeleteCourse = (courseId: string) => {
    const updated = courses.filter((c) => c.id !== courseId);
    updateCourses(updated);
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setCurrentView('catalog');
    }
    showToast('Module supprimé.');
  };

  // Duplicate course
  const handleDuplicateCourse = (course: Course) => {
    const clonedCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      title: `${course.title} (Copie)`,
      chapters: course.chapters.map((ch, idx) => ({
        ...ch,
        id: `ch-${Date.now()}-${idx + 1}`,
        quiz: {
          ...ch.quiz,
          id: `quiz-${Date.now()}-${idx + 1}`,
        },
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateCourses([clonedCourse, ...courses]);
    showToast(`Module "${course.title}" dupliqué avec succès.`);
  };

  // Add chapter to existing course shortcut
  const handleAddChapterToCourse = (course: Course) => {
    const nextOrder = course.chapters.length + 1;
    const newChapter: Chapter = {
      id: `ch-${Date.now()}-${nextOrder}`,
      order: nextOrder,
      title: `Chapitre ${nextOrder} : Nouvelle Leçon`,
      description: 'Présentation des notions clés de ce nouveau chapitre...',
      youtubeUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
      videoId: 'SqcY0GlETPk',
      durationMinutes: 20,
      keyTakeaways: ['Comprendre la méthodologie', 'Pratiquer sur les exemples concrets'],
      lectureNotes: 'Support pédagogique écrit pour ce chapitre.',
      resources: [],
      quiz: {
        id: `quiz-${Date.now()}`,
        title: `Quiz de fin de Chapitre ${nextOrder}`,
        passingScorePercent: 70,
        questions: [
          {
            id: `q-${Date.now()}-1`,
            question: 'Quel est l’élément clé retenu dans ce chapitre ?',
            options: ['La démarche rigoureuse', 'Le hasard complet', 'Rien du tout', 'Autre chose'],
            correctOptionIndex: 0,
            explanation: 'La méthodologie permet de structurer les apprentissages.',
          },
        ],
      },
    };

    const updatedCourse: Course = {
      ...course,
      chapters: [...course.chapters, newChapter],
    };

    setEditingCourse(updatedCourse);
    setIsCourseEditorOpen(true);
  };

  // Thematics Handlers
  const handleSaveThematic = (newThematic: Thematic) => {
    const exists = thematics.some((t) => t.id === newThematic.id);
    const updated = exists
      ? thematics.map((t) => (t.id === newThematic.id ? newThematic : t))
      : [...thematics, newThematic];
    updateThematics(updated);
    showToast(`Thématique "${newThematic.name}" enregistrée.`);
  };

  const handleDeleteThematic = (thematicId: string) => {
    const updated = thematics.filter((t) => t.id !== thematicId);
    updateThematics(updated);
    showToast('Thématique supprimée.');
  };

  // Reset progress
  const handleResetProgress = () => {
    const reset = {
      ...DEFAULT_USER_PROGRESS,
      studentName: progress.studentName,
      studentEmail: progress.studentEmail,
    };
    updateProgress(reset);
    showToast('Progression réinitialisée.');
  };

  // Fast-track demo helper: unlocks all chapters and marks course completed
  const handleFastTrackCompleteCourse = (course: Course) => {
    const updatedVideos = { ...progress.completedVideos };
    const updatedQuizzes = { ...progress.quizResults };

    course.chapters.forEach((ch) => {
      updatedVideos[ch.id] = true;
      updatedQuizzes[ch.id] = {
        passed: true,
        score: ch.quiz.questions.length,
        total: ch.quiz.questions.length,
        percentage: 100,
        answers: {},
        attemptedAt: new Date().toISOString(),
      };
    });

    const newProg: UserProgress = {
      ...progress,
      completedVideos: updatedVideos,
      quizResults: updatedQuizzes,
    };

    checkCourseCompletion(course, newProg);
    updateProgress(newProg);
    setDiplomaCourse(course);
  };

  // Discussion & Questions Handlers
  const handleAddChapterDiscussion = (
    chapterId: string,
    data: { title: string; content: string; videoTimestamp?: string }
  ) => {
    if (!activeCourse) return;
    const newThread: DiscussionThread = {
      id: `thread-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      courseId: activeCourse.id,
      chapterId,
      authorName: progress.studentName,
      authorRole: userRole,
      title: data.title,
      content: data.content,
      videoTimestamp: data.videoTimestamp,
      likes: 0,
      isResolved: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    updateDiscussions([newThread, ...discussions]);
    showToast('Votre question a été publiée dans le forum du chapitre !');
  };

  const handleAddCourseComment = (
    courseId: string,
    data: { title: string; content: string; rating?: number }
  ) => {
    const newThread: DiscussionThread = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      courseId,
      authorName: progress.studentName,
      authorRole: userRole,
      title: data.title,
      content: data.content,
      rating: data.rating,
      likes: 0,
      isResolved: false,
      isGeneralCourseComment: true,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    updateDiscussions([newThread, ...discussions]);
    showToast('Votre avis/commentaire a été publié sur la formation !');
  };

  const handleAddDiscussionReply = (threadId: string, content: string) => {
    const newReply: DiscussionReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      threadId,
      authorName: progress.studentName,
      authorRole: userRole,
      content,
      isInstructorResponse: userRole === 'instructor' || userRole === 'admin',
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = discussions.map((t) => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [...t.replies, newReply],
        };
      }
      return t;
    });

    updateDiscussions(updated);
    showToast('Votre réponse a été ajoutée !');
  };

  const handleToggleLikeDiscussion = (threadId: string, replyId?: string) => {
    const updated = discussions.map((t) => {
      if (t.id === threadId) {
        if (replyId) {
          return {
            ...t,
            replies: t.replies.map((r) =>
              r.id === replyId ? { ...r, likes: r.likes + 1 } : r
            ),
          };
        }
        return { ...t, likes: t.likes + 1 };
      }
      return t;
    });
    updateDiscussions(updated);
  };

  const handleToggleResolveDiscussion = (threadId: string) => {
    const updated = discussions.map((t) => {
      if (t.id === threadId) {
        return { ...t, isResolved: !t.isResolved };
      }
      return t;
    });
    updateDiscussions(updated);
    showToast('Statut de la question mis à jour.');
  };

  // Role switching
  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentView('admin');
      showToast('Mode Administrateur activé : création de modules, vidéos YouTube, éléments de cours et quizz.');
    } else {
      if (currentView === 'admin') {
        setCurrentView('catalog');
      }
      showToast(role === 'instructor' ? 'Mode Formateur activé.' : 'Mode Étudiant activé.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-sm font-semibold animate-pulse">Chargement d'EduMoodle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Toast */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        userRole={userRole}
        progress={progress}
        onNavigateCatalog={() => {
          setCurrentView('catalog');
          setSelectedCourseId(null);
        }}
        onNavigateAdmin={() => {
          setUserRole('admin');
          setCurrentView('admin');
        }}
        onOpenProgressTracker={() => setIsProgressModalOpen(true)}
        onSelectRole={handleSelectRole}
        onOpenCreateCourse={() => {
          setEditingCourse(null);
          setIsCourseEditorOpen(true);
        }}
      />

      {/* Demo helper banner if in catalog or course */}
      {currentView !== 'admin' && (
        <div className="bg-indigo-950 text-indigo-200 px-4 py-2 border-b border-indigo-900 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Système Moodle certifiant :</strong> Chaque chapitre nécessite le visionnage de la vidéo et la validation du quiz pour débloquer le suivant.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setUserRole('admin');
                setCurrentView('admin');
              }}
              className="text-amber-300 hover:text-amber-200 font-semibold underline flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Ouvrir la Console Admin</span>
            </button>
            {courses.length > 0 && (
              <button
                onClick={() => handleFastTrackCompleteCourse(courses[0])}
                className="underline text-indigo-300 hover:text-white"
                title="Valide instantanément la formation 1 pour tester la délivrance du Diplôme"
              >
                🎓 Tester Diplôme
              </button>
            )}
          </div>
        </div>
      )}

      {/* View Switcher */}
      {currentView === 'admin' ? (
        <AdminDashboardView
          courses={courses}
          thematics={thematics}
          onOpenCreateCourse={() => {
            setEditingCourse(null);
            setIsCourseEditorOpen(true);
          }}
          onEditCourse={(c) => {
            setEditingCourse(c);
            setIsCourseEditorOpen(true);
          }}
          onDeleteCourse={handleDeleteCourse}
          onDuplicateCourse={handleDuplicateCourse}
          onPreviewCourse={(c) => {
            setSelectedCourseId(c.id);
            setCurrentView('course');
          }}
          onAddChapterToCourse={handleAddChapterToCourse}
          onSaveThematic={handleSaveThematic}
          onDeleteThematic={handleDeleteThematic}
          onSwitchToStudentView={() => {
            setUserRole('student');
            setCurrentView('catalog');
          }}
        />
      ) : currentView === 'catalog' || !activeCourse ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <DashboardView
            courses={courses}
            thematics={thematics}
            progress={progress}
            discussions={discussions}
            onSelectCourse={(c) => {
              setSelectedCourseId(c.id);
              setCurrentView('course');
            }}
            onOpenDiploma={(c) => setDiplomaCourse(c)}
            onOpenCreateCourse={() => {
              setEditingCourse(null);
              setIsCourseEditorOpen(true);
            }}
            onEditCourse={(c) => {
              setEditingCourse(c);
              setIsCourseEditorOpen(true);
            }}
            onDeleteCourse={handleDeleteCourse}
            onOpenCourseDiscussions={(c) => setGeneralDiscussionsCourse(c)}
            isInstructor={userRole === 'instructor' || userRole === 'admin'}
          />
        </main>
      ) : (
        <CoursePlayerView
          course={activeCourse}
          thematic={activeThematic}
          progress={progress}
          discussions={discussions}
          userRole={userRole}
          onBackToCatalog={() => {
            setCurrentView('catalog');
            setSelectedCourseId(null);
          }}
          onToggleVideoCompleted={handleToggleVideo}
          onPassQuiz={handlePassQuiz}
          onOpenDiploma={() => setDiplomaCourse(activeCourse)}
          onAddChapterDiscussion={handleAddChapterDiscussion}
          onAddCourseComment={handleAddCourseComment}
          onAddDiscussionReply={handleAddDiscussionReply}
          onToggleLikeDiscussion={handleToggleLikeDiscussion}
          onToggleResolveDiscussion={handleToggleResolveDiscussion}
          isInstructor={userRole === 'instructor' || userRole === 'admin'}
        />
      )}

      {/* Diploma Modal */}
      {diplomaCourse && (
        <DiplomaModal
          course={diplomaCourse}
          progress={progress}
          onClose={() => setDiplomaCourse(null)}
          onUpdateStudentName={handleUpdateStudentName}
        />
      )}

      {/* General Course Discussions / Reviews Modal */}
      {generalDiscussionsCourse && (
        <CourseGeneralDiscussionsModal
          course={generalDiscussionsCourse}
          thematic={thematics.find((t) => t.id === generalDiscussionsCourse.thematicId)}
          discussions={discussions}
          userRole={userRole}
          studentName={progress.studentName}
          isOpen={!!generalDiscussionsCourse}
          onClose={() => setGeneralDiscussionsCourse(null)}
          onAddCourseComment={(data) => handleAddCourseComment(generalDiscussionsCourse.id, data)}
          onAddReply={handleAddDiscussionReply}
          onToggleLike={handleToggleLikeDiscussion}
        />
      )}

      {/* Progress Tracker Modal */}
      {isProgressModalOpen && (
        <ProgressTrackerModal
          courses={courses}
          thematics={thematics}
          progress={progress}
          onClose={() => setIsProgressModalOpen(false)}
          onUpdateStudentInfo={handleUpdateStudentInfo}
          onOpenDiplomaForCourse={(c) => setDiplomaCourse(c)}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Course Editor Modal (Create / Edit YouTube videos, Course elements & Quizzes) */}
      {isCourseEditorOpen && (
        <CourseEditorModal
          thematics={thematics}
          initialCourse={editingCourse}
          onSave={handleSaveCourse}
          onClose={() => {
            setIsCourseEditorOpen(false);
            setEditingCourse(null);
          }}
          onCreateThematic={handleSaveThematic}
        />
      )}
    </div>
  );
}
