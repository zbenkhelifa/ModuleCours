import React, { useEffect, useState } from 'react';
import { Award, Download, Printer, X, CheckCircle, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, UserProgress } from '../types';

interface DiplomaModalProps {
  course: Course;
  progress: UserProgress;
  onClose: () => void;
  onUpdateStudentName: (name: string) => void;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  course,
  progress,
  onClose,
  onUpdateStudentName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.studentName || 'Zahire Benkhelifa');
  const [copiedLink, setCopiedLink] = useState(false);

  const courseCompletion = progress.completedCourses[course.id];
  const completionDate = courseCompletion?.completedAt
    ? new Date(courseCompletion.completedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const certificateId = courseCompletion?.certificateId || `EM-${course.id.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Calculate average quiz score for honorable mention
  let totalScore = 0;
  let quizCount = 0;
  course.chapters.forEach((ch) => {
    const res = progress.quizResults[ch.id];
    if (res) {
      totalScore += res.percentage;
      quizCount += 1;
    }
  });
  const avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 100;

  let mention = 'Mention Assez Bien';
  if (avgScore >= 95) mention = 'Mention Très Honorable avec Félicitations';
  else if (avgScore >= 85) mention = 'Mention Très Bien';
  else if (avgScore >= 75) mention = 'Mention Bien';

  useEffect(() => {
    // Launch celebratory confetti burst
    const end = Date.now() + 1500;
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateStudentName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Diplôme officiel : ${course.certificateTitle} décerné à ${tempName} - ID de vérification: ${certificateId}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div
      id="diploma-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="diploma-modal-container"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200"
      >
        {/* Top actions bar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Diplôme de Fin de Formation</h3>
              <p className="text-xs text-slate-400">Certificat officiel d'accomplissement académique</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-diploma-share"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              title="Copier les références"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copié !' : 'Partager'}</span>
            </button>
            <button
              id="btn-diploma-print"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              id="btn-diploma-close"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student name customization helper banner (hidden during print) */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Certificat délivré au nom de : <strong>{tempName}</strong>.
            </span>
          </div>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="px-2.5 py-1 text-xs border border-amber-400 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Votre nom complet"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="px-2.5 py-1 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 text-xs"
              >
                Valider
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              id="btn-edit-student-name"
              onClick={() => setIsEditingName(true)}
              className="underline font-medium text-amber-800 hover:text-amber-950"
            >
              Modifier le nom sur le diplôme
            </button>
          )}
        </div>

        {/* The Official Printable Diploma Canvas */}
        <div className="p-4 sm:p-8 bg-slate-100/60 overflow-x-auto flex justify-center">
          <div
            id="printable-diploma"
            className="w-full max-w-[850px] aspect-[1.414/1] bg-white rounded-xl shadow-lg border-8 border-double border-amber-700/40 p-8 sm:p-12 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-8 print:border-amber-800"
            style={{
              backgroundImage: `radial-gradient(circle at center, #ffffff 60%, #faf8f5 100%)`,
            }}
          >
            {/* Ornamental Corner Filigrees */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

            {/* Inner fine border */}
            <div className="absolute inset-4 border border-amber-600/30 pointer-events-none" />

            {/* Top Academic Header */}
            <div className="text-center pt-2 relative z-10">
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-700">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-serif-diploma tracking-[0.25em] text-xs uppercase font-bold text-amber-800">
                  EduMoodle • Académie Numérique
                </span>
              </div>
              <h1 className="font-serif-diploma text-2xl sm:text-4xl font-black tracking-wide text-slate-900 uppercase">
                Diplôme d'Accomplissement
              </h1>
              <p className="font-serif-diploma text-xs sm:text-sm tracking-[0.18em] uppercase text-amber-700 mt-1 font-semibold">
                Certificat de Réussite & Maîtrise des Compétences
              </p>
            </div>

            {/* Central Content */}
            <div className="text-center my-auto py-4 relative z-10">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                Ce diplôme officiel est solennellement décerné à :
              </p>

              {/* Student Name */}
              <div className="my-3">
                <h2 className="font-script text-3xl sm:text-5xl font-bold text-slate-900 tracking-normal px-4 py-1 inline-block border-b-2 border-amber-500/60">
                  {tempName}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mt-2">
                Pour avoir suivi avec assiduité et validé l'intégralité des modules vidéo,
                exercices pratiques et évaluations de fin de chapitre du cursus :
              </p>

              {/* Course Title */}
              <div className="mt-3 inline-block bg-amber-50/70 border border-amber-200/80 rounded-lg px-6 py-2">
                <h3 className="font-serif-diploma text-base sm:text-xl font-bold text-amber-950 uppercase tracking-wide">
                  {course.certificateTitle || course.title}
                </h3>
                <div className="flex items-center justify-center gap-3 mt-1 text-xs text-amber-800">
                  <span>{course.chapters.length} chapitres validés</span>
                  <span>•</span>
                  <span>Score moyen aux quiz : {avgScore}%</span>
                  <span>•</span>
                  <span className="font-semibold">{mention}</span>
                </div>
              </div>
            </div>

            {/* Bottom Signatures & Seal */}
            <div className="pt-4 border-t border-slate-200/70 relative z-10 flex items-end justify-between px-2 sm:px-6">
              {/* Left: Academic Director Signature */}
              <div className="text-center w-36 sm:w-44">
                <div className="h-10 flex items-center justify-center">
                  <svg className="w-28 h-8 text-indigo-900" viewBox="0 0 120 40" fill="none">
                    <path
                      d="M10 25 C 25 10, 35 35, 50 15 C 65 -5, 75 30, 90 20 C 100 15, 110 25, 115 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-serif-diploma text-xs font-bold text-slate-800">Direction Pédagogique</p>
                  <p className="text-[10px] text-slate-500">Institut EduMoodle France</p>
                </div>
              </div>

              {/* Center: Gold Embossed Seal */}
              <div className="text-center flex flex-col items-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-300 border-2 border-amber-600 shadow-md flex items-center justify-center text-amber-950">
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-800/40 flex flex-col items-center justify-center text-center p-1">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950 mb-0.5" />
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-tighter font-extrabold text-amber-950 leading-tight">
                      VÉRIFIÉ
                    </span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-mono tracking-wider">
                  {certificateId}
                </span>
              </div>

              {/* Right: Instructor Signature */}
              <div className="text-center w-36 sm:w-44">
                <div className="h-10 flex items-center justify-center">
                  <svg className="w-28 h-8 text-amber-900" viewBox="0 0 120 40" fill="none">
                    <path
                      d="M5 30 C 20 15, 30 5, 45 25 C 60 45, 80 10, 95 15 C 105 20, 115 10, 118 22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-serif-diploma text-xs font-bold text-slate-800">{course.instructorName}</p>
                  <p className="text-[10px] text-slate-500">Formateur Référent • {completionDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer verification note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Document numérique certifié conforme aux normes de formation en ligne EduMoodle.</span>
          </div>
          <span className="font-mono text-slate-400">ID d'enregistrement : {certificateId}</span>
        </div>
      </div>
    </div>
  );
};
