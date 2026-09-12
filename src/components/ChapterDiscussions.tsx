import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Search,
  Filter,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import { Chapter, Course, DiscussionThread, UserRole } from '../types';

interface ChapterDiscussionsProps {
  course: Course;
  chapter: Chapter;
  discussions: DiscussionThread[];
  userRole: UserRole;
  studentName: string;
  onAddQuestion: (data: { title: string; content: string; videoTimestamp?: string }) => void;
  onAddReply: (threadId: string, content: string) => void;
  onToggleLike: (threadId: string, replyId?: string) => void;
  onToggleResolve: (threadId: string) => void;
  onOpenGeneralForum?: () => void;
}

export const ChapterDiscussions: React.FC<ChapterDiscussionsProps> = ({
  course,
  chapter,
  discussions,
  userRole,
  studentName,
  onAddQuestion,
  onAddReply,
  onToggleLike,
  onToggleResolve,
  onOpenGeneralForum,
}) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'resolved'>('all');

  // New question form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTimestamp, setNewTimestamp] = useState('');

  // Active reply inputs per thread
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [openThreadReplies, setOpenThreadReplies] = useState<Record<string, boolean>>({});

  // Filter discussions for this specific chapter
  const chapterThreads = discussions.filter(
    (t) => t.courseId === course.id && t.chapterId === chapter.id && !t.isGeneralCourseComment
  );

  const filteredThreads = chapterThreads.filter((t) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'resolved' && t.isResolved) ||
      (filterStatus === 'unresolved' && !t.isResolved);

    return matchesSearch && matchesStatus;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddQuestion({
      title: newTitle.trim(),
      content: newContent.trim(),
      videoTimestamp: newTimestamp.trim() || undefined,
    });

    setNewTitle('');
    setNewContent('');
    setNewTimestamp('');
    setIsFormOpen(false);
  };

  const handleSendReply = (threadId: string) => {
    const text = replyInputs[threadId];
    if (!text || !text.trim()) return;

    onAddReply(threadId, text.trim());
    setReplyInputs((prev) => ({ ...prev, [threadId]: '' }));
    setOpenThreadReplies((prev) => ({ ...prev, [threadId]: true }));
  };

  const toggleRepliesAccordion = (threadId: string) => {
    setOpenThreadReplies((prev) => ({
      ...prev,
      [threadId]: !prev[threadId],
    }));
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Récemment';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with stats and "Ask Question" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-xl border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-white text-sm">
              Espace d'Échange & Questions sur ce Chapitre
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Posez vos questions techniques, échangez avec les autres apprenants et recevez les explications du formateur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenGeneralForum && (
            <button
              onClick={onOpenGeneralForum}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="Voir les avis généraux et retours sur l'ensemble de la formation"
            >
              Forum Général du Cours
            </button>
          )}

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Fermer le formulaire' : 'Poser une question'}</span>
          </button>
        </div>
      </div>

      {/* New Question Collapsible Form */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateQuestion}
          className="p-4 sm:p-5 bg-slate-850 rounded-xl border border-indigo-500/40 shadow-lg space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Nouvelle question pour le {chapter.title}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Posté en tant que : <strong className="text-indigo-300">{studentName}</strong> (
              {userRole === 'instructor' ? 'Formateur 🎓' : 'Apprenant'})
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Titre de votre question *
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Pourquoi utiliser cette syntaxe dans ce cas précis ?"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Détails de votre question ou problème *
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                placeholder="Décrivez votre incompréhension, le message d'erreur ou le comportement observé..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Moment dans la vidéo (optionnel)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={newTimestamp}
                  onChange={(e) => setNewTimestamp(e.target.value)}
                  placeholder="Ex: 04:30"
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Aide les autres étudiants à se repérer dans le cours.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier la question</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans ce chapitre..."
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filtrer :
          </span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Toutes ({chapterThreads.length})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterStatus === 'resolved'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Résolues ({chapterThreads.filter((t) => t.isResolved).length})
          </button>
          <button
            onClick={() => setFilterStatus('unresolved')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterStatus === 'unresolved'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            En attente ({chapterThreads.filter((t) => !t.isResolved).length})
          </button>
        </div>
      </div>

      {/* Threads List */}
      <div className="space-y-3.5">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              {chapterThreads.length === 0
                ? 'Aucune question pour ce chapitre pour l’instant.'
                : 'Aucune question ne correspond à vos critères de recherche.'}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Soyez le premier à poser une question ou partager une astuce avec la promotion !
            </p>
            {chapterThreads.length === 0 && !isFormOpen && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition inline-flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Poser une question</span>
              </button>
            )}
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isInstructorAuthor = thread.authorRole === 'instructor';
            const isThreadRepliesOpen = openThreadReplies[thread.id] ?? true;
            const currentReplyText = replyInputs[thread.id] || '';

            return (
              <div
                key={thread.id}
                className="bg-slate-900/70 hover:bg-slate-900/90 rounded-xl border border-slate-800 p-4 transition space-y-3"
              >
                {/* Thread Top Bar: Author, Timestamp, Video Time, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isInstructorAuthor
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {thread.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">
                          {thread.authorName}
                        </span>
                        {isInstructorAuthor && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> Formateur
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">• {formatDate(thread.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {thread.videoTimestamp && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        À {thread.videoTimestamp}
                      </span>
                    )}

                    <button
                      onClick={() => onToggleResolve(thread.id)}
                      title={thread.isResolved ? 'Marquer comme non résolu' : 'Marquer comme résolu'}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition border flex items-center gap-1 ${
                        thread.isResolved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {thread.isResolved ? 'Résolu' : 'Marquer résolu'}
                    </button>
                  </div>
                </div>

                {/* Thread Body */}
                <div>
                  <h5 className="text-sm font-bold text-white leading-snug">{thread.title}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                    {thread.content}
                  </p>
                </div>

                {/* Thread Action Bar: Likes, Reply Count, Accordion Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleLike(thread.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition"
                      title="Utile / J'aime"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{thread.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleRepliesAccordion(thread.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{thread.replies.length} réponse{thread.replies.length > 1 ? 's' : ''}</span>
                      {isThreadRepliesOpen ? (
                        <ChevronUp className="w-3 h-3 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Replies Accordion */}
                {isThreadRepliesOpen && (
                  <div className="mt-3 pl-3 sm:pl-5 border-l-2 border-slate-800 space-y-3">
                    {/* List of Replies */}
                    {thread.replies.map((reply) => {
                      const isInstructorReply =
                        reply.authorRole === 'instructor' || reply.isInstructorResponse;

                      return (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-lg text-xs space-y-1.5 transition ${
                            isInstructorReply
                              ? 'bg-indigo-950/40 border border-indigo-500/30'
                              : 'bg-slate-950/50 border border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-200">{reply.authorName}</span>
                              {isInstructorReply && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1">
                                  <ShieldCheck className="w-2.5 h-2.5" /> Réponse Formateur
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">
                                • {formatDate(reply.createdAt)}
                              </span>
                            </div>

                            <button
                              onClick={() => onToggleLike(thread.id, reply.id)}
                              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 transition"
                              title="Utile"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{reply.likes}</span>
                            </button>
                          </div>

                          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}

                    {/* Quick Reply Form */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={currentReplyText}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({ ...prev, [thread.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply(thread.id);
                          }
                        }}
                        placeholder={`Répondre à ${thread.authorName}...`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
                      />
                      <button
                        onClick={() => handleSendReply(thread.id)}
                        disabled={!currentReplyText.trim()}
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition flex items-center justify-center"
                        title="Envoyer la réponse"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
