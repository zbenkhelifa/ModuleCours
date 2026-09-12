import React, { useState } from 'react';
import {
  X,
  Star,
  MessageSquare,
  ThumbsUp,
  Send,
  User,
  ShieldCheck,
  Award,
  Sparkles,
  Filter,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Course, DiscussionThread, Thematic, UserRole } from '../types';

interface CourseGeneralDiscussionsModalProps {
  course: Course;
  thematic?: Thematic;
  discussions: DiscussionThread[];
  userRole: UserRole;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  onAddCourseComment: (data: { title: string; content: string; rating?: number }) => void;
  onAddReply: (threadId: string, content: string) => void;
  onToggleLike: (threadId: string, replyId?: string) => void;
}

export const CourseGeneralDiscussionsModal: React.FC<CourseGeneralDiscussionsModalProps> = ({
  course,
  thematic,
  discussions,
  userRole,
  studentName,
  isOpen,
  onClose,
  onAddCourseComment,
  onAddReply,
  onToggleLike,
}) => {
  if (!isOpen) return null;

  const [filterType, setFilterType] = useState<'all' | 'reviews' | 'questions'>('all');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hasRating, setHasRating] = useState<boolean>(true);

  // Reply inputs
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // All general course comments/reviews for this course
  const generalThreads = discussions.filter(
    (t) => t.courseId === course.id && t.isGeneralCourseComment
  );

  // Ratings calculation
  const ratedThreads = generalThreads.filter((t) => typeof t.rating === 'number' && t.rating > 0);
  const averageRating =
    ratedThreads.length > 0
      ? (
          ratedThreads.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedThreads.length
        ).toFixed(1)
      : '5.0';

  // Star counts for 5, 4, 3, 2, 1
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: ratedThreads.filter((t) => t.rating === s).length,
  }));

  const filteredThreads = generalThreads.filter((t) => {
    if (filterType === 'reviews') return typeof t.rating === 'number' && t.rating > 0;
    if (filterType === 'questions') return !t.rating || t.rating === 0;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddCourseComment({
      title: title.trim(),
      content: content.trim(),
      rating: hasRating ? rating : undefined,
    });

    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleSendReply = (threadId: string) => {
    const text = replyInputs[threadId];
    if (!text || !text.trim()) return;

    onAddReply(threadId, text.trim());
    setReplyInputs((prev) => ({ ...prev, [threadId]: '' }));
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return 'Récemment';
    }
  };

  return (
    <div
      id="course-general-discussions-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Modal Top Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  Forum Général & Avis sur la Formation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-lg">
                  {course.title} • Par {course.instructorName}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Summary Banner: Ratings & Review Stats */}
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-700/80 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left: Overall Rating */}
            <div className="sm:col-span-5 text-center sm:text-left sm:border-r sm:border-slate-700/80 sm:pr-6">
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-4xl font-extrabold text-white">{averageRating}</span>
                <span className="text-xs text-slate-400">/ 5</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(averageRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Basé sur {ratedThreads.length} avis d'apprenants certifiés et inscrits.
              </p>
            </div>

            {/* Right: Action to post review or comment */}
            <div className="sm:col-span-7 flex flex-col justify-center items-center sm:items-start space-y-2">
              <p className="text-xs text-slate-300 font-medium text-center sm:text-left">
                Partagez votre retour d'expérience global, donnez une note ou posez des questions sur le cursus.
              </p>
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isCreating ? 'Masquer le formulaire' : 'Rédiger un avis ou commentaire'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Form for Course-level Comment / Review */}
          {isCreating && (
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-slate-850 rounded-xl border border-indigo-500/50 shadow-xl space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Votre avis ou commentaire sur l'ensemble de la formation
                </span>
                <span className="text-[11px] text-slate-400">
                  En tant que : <strong className="text-indigo-300">{studentName}</strong>
                </span>
              </div>

              {/* Star rating selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Attribuer une note :
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => {
                          setRating(star);
                          setHasRating(true);
                        }}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            hasRating && star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {hasRating && (
                    <span className="text-xs font-bold text-amber-400 ml-1">
                      {rating} / 5 étoiles
                    </span>
                  )}
                </div>

                <label className="text-xs text-slate-400 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hasRating}
                    onChange={(e) => setHasRating(!e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Simple question / sans notation</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Titre du commentaire / avis *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Une formation très complète et structurée..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Votre retour d'expérience détaillé *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  placeholder="Qu'avez-vous pensé de la pédagogie, des vidéos, du formateur et des quiz de validation ?"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier l'avis</span>
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Affichage :</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-md transition ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tous ({generalThreads.length})
              </button>
              <button
                onClick={() => setFilterType('reviews')}
                className={`px-3 py-1 rounded-md transition ${
                  filterType === 'reviews'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Avis notés ({ratedThreads.length})
              </button>
              <button
                onClick={() => setFilterType('questions')}
                className={`px-3 py-1 rounded-md transition ${
                  filterType === 'questions'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Échanges généraux ({generalThreads.length - ratedThreads.length})
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-4">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  Aucun avis ou échange pour le moment.
                </p>
                <p className="text-xs text-slate-500">
                  Partagez vos impressions sur cette formation pour guider les futurs apprenants !
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isInstructor = thread.authorRole === 'instructor';
                const currentReply = replyInputs[thread.id] || '';

                return (
                  <div
                    key={thread.id}
                    className="p-4 bg-slate-850/80 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isInstructor
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {thread.authorName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">
                              {thread.authorName}
                            </span>
                            {isInstructor && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" /> Formateur
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500">
                              • {formatDate(thread.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stars badge if rating */}
                      {typeof thread.rating === 'number' && thread.rating > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{thread.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-sm font-bold text-white">{thread.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                        {thread.content}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => onToggleLike(thread.id)}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{thread.likes} utile{thread.likes > 1 ? 's' : ''}</span>
                      </button>

                      <span className="text-slate-500 text-[11px]">
                        {thread.replies.length} réponse{thread.replies.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Replies */}
                    {thread.replies.length > 0 && (
                      <div className="mt-2 pl-3 sm:pl-4 border-l-2 border-slate-800 space-y-2">
                        {thread.replies.map((r) => (
                          <div
                            key={r.id}
                            className={`p-2.5 rounded-lg text-xs space-y-1 ${
                              r.authorRole === 'instructor' || r.isInstructorResponse
                                ? 'bg-indigo-950/40 border border-indigo-500/30'
                                : 'bg-slate-900/60 border border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-200">{r.authorName}</span>
                                {(r.authorRole === 'instructor' || r.isInstructorResponse) && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                                    Réponse Formateur
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => onToggleLike(thread.id, r.id)}
                                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-300 transition"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{r.likes}</span>
                              </button>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{r.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Form */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={currentReply}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({ ...prev, [thread.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply(thread.id);
                          }
                        }}
                        placeholder="Ajouter une réponse ou un mot d'encouragement..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
                      />
                      <button
                        onClick={() => handleSendReply(thread.id)}
                        disabled={!currentReply.trim()}
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition flex items-center justify-center"
                        title="Envoyer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Plateforme EduMoodle • Discussions & Avis Modérés</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
