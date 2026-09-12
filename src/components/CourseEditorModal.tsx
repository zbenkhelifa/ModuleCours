import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Youtube,
  HelpCircle,
  Save,
  Clock,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  FileText,
  Link,
  CheckCircle2,
  Copy,
  ExternalLink,
  Play,
  FileDown,
  FolderPlus,
} from 'lucide-react';
import { Course, Chapter, QuizQuestion, Thematic, ChapterResource } from '../types';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';

interface CourseEditorModalProps {
  thematics: Thematic[];
  initialCourse?: Course | null;
  onSave: (course: Course) => void;
  onClose: () => void;
  onCreateThematic?: (thematic: Thematic) => void;
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = ({
  thematics,
  initialCourse,
  onSave,
  onClose,
  onCreateThematic,
}) => {
  const isEditing = !!initialCourse;

  // Basic Course Info
  const [title, setTitle] = useState(initialCourse?.title || '');
  const [thematicId, setThematicId] = useState(initialCourse?.thematicId || thematics[0]?.id || 'web-dev');
  const [description, setDescription] = useState(initialCourse?.description || '');
  const [instructorName, setInstructorName] = useState(initialCourse?.instructorName || 'Prof. Enseignant');
  const [instructorTitle, setInstructorTitle] = useState(initialCourse?.instructorTitle || 'Formateur Spécialisé');
  const [level, setLevel] = useState<Course['level']>(initialCourse?.level || 'Intermédiaire');
  const [certificateTitle, setCertificateTitle] = useState(
    initialCourse?.certificateTitle || 'Certificat d’Aptitude & Réussite de Formation'
  );

  // Quick inline thematic creation
  const [isAddingNewThematic, setIsAddingNewThematic] = useState(false);
  const [newThematicName, setNewThematicName] = useState('');

  // Active sub-tab inside chapter editor: 'video' | 'content' | 'quiz'
  const [chapterSubTab, setChapterSubTab] = useState<'video' | 'content' | 'quiz'>('video');
  const [showTestPlayer, setShowTestPlayer] = useState(false);

  // New takeaway input & new resource input state
  const [newTakeawayText, setNewTakeawayText] = useState('');
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceType, setNewResourceType] = useState<'link' | 'pdf' | 'code'>('link');

  // Chapters List
  const [chapters, setChapters] = useState<Chapter[]>(
    initialCourse?.chapters && initialCourse.chapters.length > 0
      ? initialCourse.chapters
      : [
          {
            id: 'ch-new-1',
            order: 1,
            title: 'Chapitre 1 : Introduction & Prérequis',
            description: 'Présentation générale des notions abordées dans ce premier module.',
            youtubeUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
            videoId: 'SqcY0GlETPk',
            durationMinutes: 30,
            keyTakeaways: ['Comprendre les objectifs pédagogiques', 'Installer les outils requis'],
            lectureNotes: 'Bienvenue dans cette première leçon. Assurez-vous d’avoir votre environnement de travail prêt avant de débuter les exercices pratiques.',
            resources: [
              {
                id: 'res-1',
                title: 'Documentation officielle & Guide de démarrage',
                url: 'https://developer.mozilla.org',
                type: 'link',
              },
            ],
            quiz: {
              id: 'quiz-ch-1',
              title: 'Quiz de fin de Chapitre 1',
              passingScorePercent: 70,
              questions: [
                {
                  id: 'q1',
                  question: 'Quel est l’objectif principal de ce premier chapitre ?',
                  options: [
                    'Poser les bases et comprendre les fondamentaux',
                    'Supprimer tous les fichiers',
                    'Arrêter la formation',
                    'Rien de particulier',
                  ],
                  correctOptionIndex: 0,
                  explanation: 'Ce chapitre permet d’acquérir le socle théorique nécessaire.',
                },
              ],
            },
          },
        ]
  );

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  // Helper to update current chapter
  const updateCurrentChapter = (updates: Partial<Chapter>) => {
    setChapters((prev) => {
      const copy = [...prev];
      const existing = copy[activeChapterIndex];
      if (!existing) return prev;

      let videoId = existing.videoId;
      if (updates.youtubeUrl !== undefined) {
        videoId = extractYouTubeId(updates.youtubeUrl) || existing.videoId;
      }

      copy[activeChapterIndex] = {
        ...existing,
        ...updates,
        videoId,
      };
      return copy;
    });
  };

  // Move Chapter Up
  const moveChapterUp = (index: number) => {
    if (index === 0) return;
    setChapters((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    });
    setActiveChapterIndex(index - 1);
  };

  // Move Chapter Down
  const moveChapterDown = (index: number) => {
    if (index >= chapters.length - 1) return;
    setChapters((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    });
    setActiveChapterIndex(index + 1);
  };

  // Duplicate Chapter
  const duplicateChapter = (indexToDup: number) => {
    const target = chapters[indexToDup];
    if (!target) return;
    const duplicated: Chapter = {
      ...target,
      id: `ch-${Date.now()}-${chapters.length + 1}`,
      order: chapters.length + 1,
      title: `${target.title} (Copie)`,
      quiz: {
        ...target.quiz,
        id: `quiz-${Date.now()}`,
        questions: target.quiz.questions.map((q) => ({
          ...q,
          id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        })),
      },
    };
    setChapters((prev) => [...prev, duplicated]);
    setActiveChapterIndex(chapters.length);
  };

  // Add Chapter
  const addChapter = () => {
    const nextOrder = chapters.length + 1;
    const newCh: Chapter = {
      id: `ch-${Date.now()}-${nextOrder}`,
      order: nextOrder,
      title: `Chapitre ${nextOrder} : Nouveau Module Pédagogique`,
      description: 'Objectifs et compétences clés développés dans ce chapitre...',
      youtubeUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
      videoId: 'SqcY0GlETPk',
      durationMinutes: 30,
      keyTakeaways: ['Maîtriser le concept principal', 'Mettre en pratique les exemples'],
      lectureNotes: 'Fiche mémo et guide de cours pour accompagner la vidéo.',
      resources: [],
      quiz: {
        id: `quiz-${Date.now()}`,
        title: `Quiz de fin de Chapitre ${nextOrder}`,
        passingScorePercent: 70,
        questions: [
          {
            id: `q-${Date.now()}-1`,
            question: 'Quelle est la bonne pratique essentielle vue dans ce chapitre ?',
            options: ['Option A (Correcte)', 'Option B', 'Option C', 'Option D'],
            correctOptionIndex: 0,
            explanation: 'Explication pédagogique détaillant la réponse correcte.',
          },
        ],
      },
    };

    setChapters((prev) => [...prev, newCh]);
    setActiveChapterIndex(chapters.length);
  };

  // Delete Chapter
  const deleteChapter = (indexToDelete: number) => {
    if (chapters.length <= 1) {
      alert('Une formation doit comporter au moins un chapitre.');
      return;
    }
    setChapters((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToDelete);
      return filtered.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    });
    setActiveChapterIndex(0);
  };

  // Key Takeaways Handlers
  const handleAddTakeaway = () => {
    if (!newTakeawayText.trim()) return;
    const currentList = currentChapter.keyTakeaways || [];
    updateCurrentChapter({ keyTakeaways: [...currentList, newTakeawayText.trim()] });
    setNewTakeawayText('');
  };

  const handleRemoveTakeaway = (index: number) => {
    const currentList = currentChapter.keyTakeaways || [];
    updateCurrentChapter({ keyTakeaways: currentList.filter((_, i) => i !== index) });
  };

  // Resources Handlers
  const handleAddResource = () => {
    if (!newResourceTitle.trim() || !newResourceUrl.trim()) return;
    const newRes: ChapterResource = {
      id: `res-${Date.now()}`,
      title: newResourceTitle.trim(),
      url: newResourceUrl.trim(),
      type: newResourceType,
    };
    const currentRes = currentChapter.resources || [];
    updateCurrentChapter({ resources: [...currentRes, newRes] });
    setNewResourceTitle('');
    setNewResourceUrl('');
  };

  const handleRemoveResource = (resId: string) => {
    const currentRes = currentChapter.resources || [];
    updateCurrentChapter({ resources: currentRes.filter((r) => r.id !== resId) });
  };

  // Quiz Question handlers for current chapter
  const addQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      question: 'Nouvelle question d’évaluation ?',
      options: ['Choix 1 (Correct)', 'Choix 2', 'Choix 3', 'Choix 4'],
      correctOptionIndex: 0,
      explanation: 'Explication pédagogique de la réponse...',
    };

    updateCurrentChapter({
      quiz: {
        ...currentChapter.quiz,
        questions: [...currentChapter.quiz.questions, newQ],
      },
    });
  };

  const updateQuizQuestion = (qIndex: number, updates: Partial<QuizQuestion>) => {
    const updatedQuestions = [...currentChapter.quiz.questions];
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      ...updates,
    };
    updateCurrentChapter({
      quiz: {
        ...currentChapter.quiz,
        questions: updatedQuestions,
      },
    });
  };

  const removeQuizQuestion = (qIndex: number) => {
    if (currentChapter.quiz.questions.length <= 1) {
      alert('Le quiz doit contenir au moins 1 question.');
      return;
    }
    const updated = currentChapter.quiz.questions.filter((_, idx) => idx !== qIndex);
    updateCurrentChapter({
      quiz: {
        ...currentChapter.quiz,
        questions: updated,
      },
    });
  };

  const handleCreateNewThematic = () => {
    if (!newThematicName.trim() || !onCreateThematic) return;
    const newId = `theme-${Date.now()}`;
    const newTheme: Thematic = {
      id: newId,
      name: newThematicName.trim(),
      slug: newThematicName.toLowerCase().replace(/\s+/g, '-'),
      description: `Formation en ${newThematicName.trim()}`,
      color: 'bg-indigo-600',
      iconName: 'Sparkles',
    };
    onCreateThematic(newTheme);
    setThematicId(newId);
    setNewThematicName('');
    setIsAddingNewThematic(false);
  };

  const handleSaveCourse = () => {
    if (!title.trim()) {
      alert('Veuillez renseigner un titre pour le module de formation.');
      return;
    }

    const totalMinutes = chapters.reduce((sum, ch) => sum + (ch.durationMinutes || 0), 0);
    const estimatedHours = Math.max(1, Math.round(totalMinutes / 60));

    // First chapter video preview thumbnail as default course thumbnail
    const firstVideoId = chapters[0]?.videoId || 'SqcY0GlETPk';
    const autoThumb = getYouTubeThumbnailUrl(firstVideoId, 'hq');

    const courseData: Course = {
      id: initialCourse?.id || `course-${Date.now()}`,
      title: title.trim(),
      thematicId,
      description: description.trim() || 'Formation certifiante en ligne sur EduMoodle.',
      instructorName: instructorName.trim() || 'Formateur Référent',
      instructorTitle: instructorTitle.trim() || 'Enseignant Spécialisé',
      level,
      estimatedHours,
      certificateTitle:
        certificateTitle.trim() || `Certificat de Compétences en ${title.trim()}`,
      thumbnailUrl: initialCourse?.thumbnailUrl || autoThumb,
      chapters: chapters.map((ch, idx) => ({
        ...ch,
        order: idx + 1,
        videoId: extractYouTubeId(ch.youtubeUrl) || ch.videoId || 'SqcY0GlETPk',
      })),
      createdAt: initialCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(courseData);
  };

  return (
    <div
      id="course-editor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="course-editor-container"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 border border-slate-200 flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {isEditing ? 'Éditeur de Module & Contenus' : 'Créer un Nouveau Module Pédagogique'}
                </h3>
                <span className="px-2 py-0.5 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold">
                  Mode Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gérez les cours, intégrez vos vidéos YouTube, rédigez les supports et configurez les quiz certifiants.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Informations Générales & Thématique */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-indigo-950 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>1. Paramètres Généraux du Module</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre de la Formation / Module *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Masterclass Développement Web Moderne avec React"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Thématique d’Enseignement *
                  </label>
                  {onCreateThematic && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewThematic(!isAddingNewThematic)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      {isAddingNewThematic ? 'Annuler' : '+ Nouvelle thématique'}
                    </button>
                  )}
                </div>

                {isAddingNewThematic ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newThematicName}
                      onChange={(e) => setNewThematicName(e.target.value)}
                      placeholder="Nom de la catégorie..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewThematic}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Ajouter
                    </button>
                  </div>
                ) : (
                  <select
                    value={thematicId}
                    onChange={(e) => setThematicId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {thematics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau requis</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Course['level'])}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Tous niveaux">Tous niveaux</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Formateur Référent</label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="Ex: Dr. Martin Dupont"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre Officiel du Diplôme Décerne</label>
                <input
                  type="text"
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  placeholder="Ex: Certificat de Compétences en Développement Web"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Objectifs du cours</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentez les compétences visées et les prérequis de cette formation..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Chapitres, Vidéos YouTube, Éléments de Cours & Quizz */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>2. Chapitres & Contenus Pédagogiques ({chapters.length} chapitres)</span>
              </div>
              <button
                type="button"
                id="btn-add-chapter"
                onClick={addChapter}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Ajouter un Chapitre</span>
              </button>
            </div>

            {/* Layout: Chapter List Sidebar on Left, Editor Workspace on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Chapters list / reorder panel */}
              <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-3 space-y-2 overflow-y-auto max-h-[550px]">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 pt-1 pb-1">
                  Ordre chronologique
                </p>
                {chapters.map((ch, index) => {
                  const isActive = index === activeChapterIndex;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setActiveChapterIndex(index);
                        setShowTestPlayer(false);
                      }}
                      className={`group p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between gap-2 ${
                        isActive
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold shadow-sm ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="truncate">{ch.title || `Chapitre ${index + 1}`}</span>
                      </div>

                      {/* Reorder & actions */}
                      <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveChapterUp(index)}
                          title="Monter"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === chapters.length - 1}
                          onClick={() => moveChapterDown(index)}
                          title="Descendre"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateChapter(index)}
                          title="Dupliquer ce chapitre"
                          className="p-1 text-slate-400 hover:text-indigo-600"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={chapters.length <= 1}
                          onClick={() => deleteChapter(index)}
                          title="Supprimer"
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Chapter Details & Subtabs */}
              <div className="lg:col-span-8 p-5 space-y-4 bg-white overflow-y-auto max-h-[550px]">
                {currentChapter ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                          Édition Chapitre {activeChapterIndex + 1} / {chapters.length}
                        </span>
                      </div>

                      {/* Subtabs for Chapter: Video YT | Course Content | Quiz */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setChapterSubTab('video')}
                          className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                            chapterSubTab === 'video'
                              ? 'bg-white text-indigo-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Youtube className="w-3.5 h-3.5 text-red-600" />
                          <span>Vidéo YT</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setChapterSubTab('content')}
                          className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                            chapterSubTab === 'content'
                              ? 'bg-white text-indigo-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Éléments de Cours</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setChapterSubTab('quiz')}
                          className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                            chapterSubTab === 'quiz'
                              ? 'bg-white text-indigo-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Quizz ({currentChapter.quiz?.questions?.length || 0})</span>
                        </button>
                      </div>
                    </div>

                    {/* Chapter Title & Duration always visible */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Titre du Chapitre *
                        </label>
                        <input
                          type="text"
                          value={currentChapter.title}
                          onChange={(e) => updateCurrentChapter({ title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Durée estimée (min)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={currentChapter.durationMinutes}
                          onChange={(e) =>
                            updateCurrentChapter({ durationMinutes: parseInt(e.target.value, 10) || 10 })
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    {/* SUBTAB 1: YOUTUBE VIDEO & TEST PLAYER */}
                    {chapterSubTab === 'video' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            <Youtube className="w-4 h-4 text-red-600" />
                            <span>Lien de la Vidéo YouTube du Chapitre</span>
                          </div>
                          {currentChapter.videoId && (
                            <button
                              type="button"
                              onClick={() => setShowTestPlayer(!showTestPlayer)}
                              className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 transition flex items-center gap-1.5"
                            >
                              <Play className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                              <span>{showTestPlayer ? 'Masquer le test vidéo' : 'Tester la lecture'}</span>
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={currentChapter.youtubeUrl}
                          onChange={(e) => updateCurrentChapter({ youtubeUrl: e.target.value })}
                          placeholder="Collez le lien YouTube : https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                        />

                        {/* Video extraction status & thumbnail */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                          {currentChapter.videoId ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={getYouTubeThumbnailUrl(currentChapter.videoId)}
                                alt="Aperçu vidéo"
                                referrerPolicy="no-referrer"
                                className="w-24 h-14 object-cover rounded-lg border border-slate-300 shadow-sm"
                              />
                              <div className="text-xs text-slate-600 space-y-0.5">
                                <p className="text-emerald-700 font-bold flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> ID YouTube valide : {currentChapter.videoId}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Prêt pour l'intégration automatique dans le lecteur de cours.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-amber-700">
                              Aucun lien YouTube valide détecté.
                            </p>
                          )}
                        </div>

                        {/* Test Video Embed iframe */}
                        {showTestPlayer && currentChapter.videoId && (
                          <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Vérification de la lecture vidéo intégrée :</span>
                            </p>
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                              <iframe
                                src={`https://www.youtube-nocookie.com/embed/${currentChapter.videoId}?rel=0`}
                                title="Aperçu test vidéo"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUBTAB 2: COURSE ELEMENTS (Description, Key Takeaways, Lecture Notes, Resources) */}
                    {chapterSubTab === 'content' && (
                      <div className="space-y-4">
                        {/* Description */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Description & Objectifs du chapitre
                          </label>
                          <textarea
                            rows={2}
                            value={currentChapter.description}
                            onChange={(e) => updateCurrentChapter({ description: e.target.value })}
                            placeholder="Ce que l'apprenant va apprendre..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Key Takeaways (Points clés) */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                          <label className="block text-xs font-bold text-slate-800">
                            Compétences & Points clés d'apprentissage
                          </label>

                          <div className="space-y-1.5">
                            {currentChapter.keyTakeaways?.map((point, ptIdx) => (
                              <div key={ptIdx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span className="text-xs text-slate-700 flex-1">{point}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTakeaway(ptIdx)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                  title="Supprimer ce point clé"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={newTakeawayText}
                              onChange={(e) => setNewTakeawayText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTakeaway();
                                }
                              }}
                              placeholder="Ajouter une compétence clé (ex: Savoir manipuler les hooks)..."
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={handleAddTakeaway}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>

                        {/* Written Lecture Notes / Guide de cours écrit */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Guide de Cours Écrit & Notes Pédagogiques pour les Apprenants</span>
                          </label>
                          <textarea
                            rows={4}
                            value={currentChapter.lectureNotes || ''}
                            onChange={(e) => updateCurrentChapter({ lectureNotes: e.target.value })}
                            placeholder="Rédigez ici le support de cours écrit, les instructions d’exercices, extraits de code, ou résumé théorique que les apprenants pourront consulter sous la vidéo..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans"
                          />
                        </div>

                        {/* Complementary Resources */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Link className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Ressources & Documents Complémentaires</span>
                          </label>

                          <div className="space-y-2">
                            {currentChapter.resources?.map((res) => (
                              <div
                                key={res.id}
                                className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700">
                                    {res.type || 'Lien'}
                                  </span>
                                  <span className="font-semibold text-slate-800">{res.title}</span>
                                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
                                    {res.url}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveResource(res.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                            <input
                              type="text"
                              value={newResourceTitle}
                              onChange={(e) => setNewResourceTitle(e.target.value)}
                              placeholder="Titre (ex: Fiche PDF)"
                              className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                            />
                            <input
                              type="text"
                              value={newResourceUrl}
                              onChange={(e) => setNewResourceUrl(e.target.value)}
                              placeholder="URL (https://...)"
                              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddResource}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                            >
                              + Ressource
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB 3: QUIZZ BUILDER */}
                    {chapterSubTab === 'quiz' && (
                      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200/80 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-200/60">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                            <HelpCircle className="w-4 h-4 text-indigo-600" />
                            <span>Quizz de validation de fin de chapitre</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600">Seuil de réussite requis :</span>
                            <input
                              type="number"
                              min="10"
                              max="100"
                              step="5"
                              value={currentChapter.quiz?.passingScorePercent || 70}
                              onChange={(e) =>
                                updateCurrentChapter({
                                  quiz: {
                                    ...currentChapter.quiz,
                                    passingScorePercent: parseInt(e.target.value, 10) || 70,
                                  },
                                })
                              }
                              className="w-16 px-2 py-1 text-xs text-center font-bold bg-white border border-indigo-300 rounded-md"
                            />
                            <span className="text-xs font-semibold text-indigo-900">%</span>
                          </div>
                        </div>

                        {/* Questions list */}
                        <div className="space-y-4 pt-1">
                          {currentChapter.quiz?.questions.map((q, qIndex) => (
                            <div
                              key={q.id}
                              className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-2.5 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">
                                  Question {qIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeQuizQuestion(qIndex)}
                                  className="text-rose-500 hover:text-rose-700 p-1"
                                  title="Supprimer cette question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) => updateQuizQuestion(qIndex, { question: e.target.value })}
                                placeholder="Énoncé clair de la question d'évaluation..."
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 font-medium"
                              />

                              {/* Options */}
                              <div className="space-y-1.5 pt-1">
                                <p className="text-[11px] text-slate-500 font-semibold">
                                  Cochez le bouton radio de la réponse correcte :
                                </p>
                                {q.options.map((opt, optIndex) => (
                                  <div key={optIndex} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${q.id}`}
                                      checked={q.correctOptionIndex === optIndex}
                                      onChange={() =>
                                        updateQuizQuestion(qIndex, { correctOptionIndex: optIndex })
                                      }
                                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                      title="Définir comme réponse correcte"
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const newOptions = [...q.options];
                                        newOptions[optIndex] = e.target.value;
                                        updateQuizQuestion(qIndex, { options: newOptions });
                                      }}
                                      placeholder={`Choix ${optIndex + 1}`}
                                      className={`flex-1 px-2 py-1 rounded-md text-xs border ${
                                        q.correctOptionIndex === optIndex
                                          ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-950'
                                          : 'border-slate-200 bg-white'
                                      }`}
                                    />
                                    {q.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const filtered = q.options.filter((_, i) => i !== optIndex);
                                          const newCorrect =
                                            q.correctOptionIndex >= filtered.length
                                              ? 0
                                              : q.correctOptionIndex === optIndex
                                              ? 0
                                              : q.correctOptionIndex > optIndex
                                              ? q.correctOptionIndex - 1
                                              : q.correctOptionIndex;
                                          updateQuizQuestion(qIndex, {
                                            options: filtered,
                                            correctOptionIndex: newCorrect,
                                          });
                                        }}
                                        className="text-slate-300 hover:text-rose-500"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}

                                {q.options.length < 5 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateQuizQuestion(qIndex, {
                                        options: [...q.options, `Choix ${q.options.length + 1}`],
                                      });
                                    }}
                                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold pt-0.5"
                                  >
                                    + Ajouter un choix de réponse
                                  </button>
                                )}
                              </div>

                              {/* Explanation */}
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                  Explication pédagogique (affichée après validation) :
                                </label>
                                <input
                                  type="text"
                                  value={q.explanation}
                                  onChange={(e) => updateQuizQuestion(qIndex, { explanation: e.target.value })}
                                  placeholder="Pourquoi cette réponse est correcte..."
                                  className="w-full px-2.5 py-1 border border-slate-200 rounded-md text-[11px]"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={addQuizQuestion}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-300 transition w-full justify-center shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Ajouter une question au Quiz</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Aucun chapitre sélectionné.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Annuler
          </button>

          <button
            type="button"
            id="btn-save-course"
            onClick={handleSaveCourse}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le Module & les Contenus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
