import { DiscussionThread } from '../types';

export const INITIAL_DISCUSSIONS: DiscussionThread[] = [
  // --- React 19 Course: Chapter 1 ---
  {
    id: 'disc-react-ch1-1',
    courseId: 'course-react-ts',
    chapterId: 'c1-react-basics',
    isGeneralCourseComment: false,
    title: 'Différence concrète avec les formulaires dans React 19 ?',
    content:
      'Dans la vidéo à 12:40, le formateur évoque les nouvelles actions de formulaire. Est-ce qu’on n’a plus du tout besoin de preventDefault() ni de gérer manuellement isLoading avec useState ?',
    authorName: 'Sarah Benali',
    authorRole: 'student',
    authorEmail: 'sarah.b@etudiant.fr',
    videoTimestamp: '12:40',
    createdAt: '2026-02-10T14:30:00Z',
    likes: 7,
    isResolved: true,
    replies: [
      {
        id: 'reply-1',
        authorName: 'Alexandre Moreau',
        authorRole: 'instructor',
        content:
          'Exactement Sarah ! Avec le nouveau hook useActionState et l’attribut action={asyncFunction} natif sur les balises <form>, React gère automatiquement la transition asynchrone, les états d’attente (pending) et les valeurs de retour sans boilerplate.',
        createdAt: '2026-02-10T15:15:00Z',
        likes: 12,
        isInstructorResponse: true,
      },
      {
        id: 'reply-2',
        authorName: 'Thomas Leroy',
        authorRole: 'student',
        content:
          'Merci pour cette précision Alexandre, je viens de tester sur mon projet et ça réduit de moitié le code des formulaires !',
        createdAt: '2026-02-10T16:05:00Z',
        likes: 3,
        isInstructorResponse: false,
      },
    ],
  },
  {
    id: 'disc-react-ch1-2',
    courseId: 'course-react-ts',
    chapterId: 'c1-react-basics',
    isGeneralCourseComment: false,
    title: 'Erreur TS2322 : Type "string" is not assignable to type "ReactNode"',
    content:
      'Bonjour, j’ai une erreur TypeScript quand j’essaie de typer un composant conteneur avec des children optionnels. Quelle est l’interface recommandée en 2026 ?',
    authorName: 'Lucas Vigneron',
    authorRole: 'student',
    videoTimestamp: '08:20',
    createdAt: '2026-02-14T09:12:00Z',
    likes: 4,
    isResolved: true,
    replies: [
      {
        id: 'reply-3',
        authorName: 'Alexandre Moreau',
        authorRole: 'instructor',
        content:
          'Utilisez `children?: React.ReactNode;` dans votre interface de props. C’est le type le plus permissif et recommandé car il accepte les éléments JSX, les chaînes, les nombres, et null.',
        createdAt: '2026-02-14T10:00:00Z',
        likes: 8,
        isInstructorResponse: true,
      },
    ],
  },

  // --- React 19 Course: Chapter 2 ---
  {
    id: 'disc-react-ch2-1',
    courseId: 'course-react-ts',
    chapterId: 'c2-react-hooks',
    isGeneralCourseComment: false,
    title: 'Quand utiliser useCallback plutôt que useMemo ?',
    content:
      'Est-ce que useCallback(fn, deps) est strictement équivalent à useMemo(() => fn, deps) sous le capot ? Est-ce qu’on doit l’utiliser systématiquement sur toutes nos fonctions ?',
    authorName: 'Élodie Mercier',
    authorRole: 'student',
    videoTimestamp: '21:15',
    createdAt: '2026-02-18T11:45:00Z',
    likes: 6,
    isResolved: true,
    replies: [
      {
        id: 'reply-4',
        authorName: 'Alexandre Moreau',
        authorRole: 'instructor',
        content:
          'Oui, sous le capot useCallback(fn, deps) équivaut à useMemo(() => fn, deps). Attention toutefois : ne mémoïsez pas aveuglément toutes vos fonctions ! Utilisez-le principalement lorsqu’une fonction est passée en prop à un composant enfant mémoïsé (via React.memo) ou injectée dans le tableau de dépendances d’un useEffect.',
        createdAt: '2026-02-18T12:20:00Z',
        likes: 9,
        isInstructorResponse: true,
      },
    ],
  },

  // --- React 19 Course: General Course Comments & Reviews ---
  {
    id: 'disc-react-general-1',
    courseId: 'course-react-ts',
    isGeneralCourseComment: true,
    title: 'Une masterclass indispensable pour se mettre à niveau sur React 19 !',
    content:
      'Les explications sont limpides, les chapitres s’enchaînent avec une vraie logique pédagogique et le principe de validation vidéo + quiz oblige à bien assimiler chaque brique. Je recommande à 100% !',
    authorName: 'Karim Haddad',
    authorRole: 'student',
    rating: 5,
    createdAt: '2026-02-20T17:10:00Z',
    likes: 18,
    replies: [
      {
        id: 'reply-gen-1',
        authorName: 'Alexandre Moreau',
        authorRole: 'instructor',
        content:
          'Merci beaucoup Karim pour ce retour précieux ! Félicitations pour l’obtention de votre certification 🎓',
        createdAt: '2026-02-20T18:00:00Z',
        likes: 5,
        isInstructorResponse: true,
      },
    ],
  },
  {
    id: 'disc-react-general-2',
    courseId: 'course-react-ts',
    isGeneralCourseComment: true,
    title: 'Des quiz bien ciblés et des exercices pertinents',
    content:
      'Le système de déblocage progressif style Moodle est motivant. Mention spéciale pour le diplôme final téléchargeable et imprimable avec le sceau officiel, très valorisant sur un CV ou LinkedIn.',
    authorName: 'Claire Duprès',
    authorRole: 'student',
    rating: 5,
    createdAt: '2026-02-22T08:30:00Z',
    likes: 11,
    replies: [],
  },
  {
    id: 'disc-react-general-3',
    courseId: 'course-react-ts',
    isGeneralCourseComment: true,
    title: 'Avez-vous des recommandations de projets pour s’entraîner ?',
    content:
      'Bonjour à tous et au formateur ! Quel type d’application conseillez-vous de développer pour consolider les acquis de ce cours ?',
    authorName: 'Julien Perrot',
    authorRole: 'student',
    createdAt: '2026-02-25T14:15:00Z',
    likes: 5,
    replies: [
      {
        id: 'reply-gen-2',
        authorName: 'Alexandre Moreau',
        authorRole: 'instructor',
        content:
          'Bonjour Julien ! Un excellent projet d’entraînement consiste à coder un tableau de bord de gestion de tâches ou un catalogue e-commerce avec panier persistant, filtrage multicritères typé et gestion des erreurs.',
        createdAt: '2026-02-25T15:40:00Z',
        likes: 6,
        isInstructorResponse: true,
      },
    ],
  },

  // --- AI Course: Chapter 1 ---
  {
    id: 'disc-ai-ch1-1',
    courseId: 'course-genai-llm',
    chapterId: 'c1-ai-intro',
    isGeneralCourseComment: false,
    title: 'Différence entre Temperature et Top-P dans la pratique ?',
    content:
      'Pouvez-vous donner un exemple concret où l’on préfère baisser la température à 0.1 plutôt que de modifier le Top-P ?',
    authorName: 'Maxime Bertrand',
    authorRole: 'student',
    videoTimestamp: '15:20',
    createdAt: '2026-02-26T16:00:00Z',
    likes: 8,
    isResolved: true,
    replies: [
      {
        id: 'reply-ai-1',
        authorName: 'Dr. Sophie Lin',
        authorRole: 'instructor',
        content:
          'Bonjour Maxime ! Pour l’extraction de données structurées (JSON, code SQL, analyse de conformité), on fixe Temperature = 0 ou 0.2 afin d’obtenir une réponse déterministe et factuelle. Pour la rédaction créative ou le brainstorming, on remonte à 0.7-0.9.',
        createdAt: '2026-02-26T17:15:00Z',
        likes: 11,
        isInstructorResponse: true,
      },
    ],
  },

  // --- AI Course: General Reviews ---
  {
    id: 'disc-ai-general-1',
    courseId: 'course-genai-llm',
    isGeneralCourseComment: true,
    title: 'Très accessible même sans doctorat en maths !',
    content:
      'Une vulgarisation remarquable des LLM et des techniques de prompt engineering. La vidéo sur les embeddings a enfin rendu ce concept clair pour moi.',
    authorName: 'Amélie Rousseau',
    authorRole: 'student',
    rating: 5,
    createdAt: '2026-02-27T10:00:00Z',
    likes: 14,
    replies: [],
  },
];
