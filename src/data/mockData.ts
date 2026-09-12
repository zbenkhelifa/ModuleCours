import { Course, Thematic } from '../types';

export const INITIAL_THEMATICS: Thematic[] = [
  {
    id: 'web-dev',
    name: 'Développement Web',
    slug: 'developpement-web',
    description: 'Technologies frontend, frameworks modernes et architectures logicielles',
    color: 'from-blue-600 to-indigo-700',
    iconName: 'Code',
  },
  {
    id: 'ai-data',
    name: 'Intelligence Artificielle',
    slug: 'intelligence-artificielle',
    description: 'LLM, ingénierie de prompt, automatisation et modèles génératifs',
    color: 'from-purple-600 to-pink-600',
    iconName: 'Cpu',
  },
  {
    id: 'design-uiux',
    name: 'Design & UI/UX',
    slug: 'design-ui-ux',
    description: 'Conception ergonomique, typographie, design systems et prototypage',
    color: 'from-emerald-600 to-teal-700',
    iconName: 'Palette',
  },
  {
    id: 'cybersec',
    name: 'Cybersécurité',
    slug: 'cybersecurite',
    description: 'Bonnes pratiques de sécurité, protection des données et audits',
    color: 'from-amber-600 to-red-600',
    iconName: 'ShieldCheck',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-react-ts',
    title: 'Masterclass React 19 & TypeScript Moderne',
    thematicId: 'web-dev',
    description:
      'Apprenez à concevoir des applications web réactives et robustes avec React 19, TypeScript et l’architecture basée sur les composants modulaires.',
    instructorName: 'Alexandre Moreau',
    instructorTitle: 'Lead Architect Frontend & Formateur certifié',
    level: 'Intermédiaire',
    estimatedHours: 6,
    certificateTitle: 'Certificat d’Expertise Développement Web React & TypeScript',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
    chapters: [
      {
        id: 'c1-react-basics',
        order: 1,
        title: 'Chapitre 1 : Fondations de React 19 & Composants Typés',
        description:
          'Découverte des concepts fondamentaux de React 19, syntaxe JSX, typage TypeScript strict des props et mise en place d’un environnement de développement moderne avec Vite.',
        youtubeUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        videoId: 'SqcY0GlETPk',
        durationMinutes: 45,
        keyTakeaways: [
          'Différence entre le DOM virtuel et le rendu déclaratif',
          'Typage strict des Props et Children en TypeScript',
          'Bonnes pratiques de découpage en composants réutilisables',
        ],
        resources: [
          { id: 'r1', title: 'Documentation Officielle React 19', url: 'https://react.dev' },
          { id: 'r2', title: 'Guide TypeScript pour React', url: 'https://www.typescriptlang.org' },
        ],
        quiz: {
          id: 'quiz-react-1',
          title: 'Validation Chapitre 1 : Syntaxe et Composants',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q1-1',
              question: 'Quelle est la principale caractéristique d’un composant fonctionnel en React ?',
              options: [
                'Il doit obligatoirement hériter de React.Component',
                'C’est une fonction pure JavaScript/TypeScript qui retourne du JSX',
                'Il ne peut pas recevoir de paramètres (props)',
                'Il s’exécute uniquement côté serveur',
              ],
              correctOptionIndex: 1,
              explanation:
                'En React moderne, un composant fonctionnel est une fonction recevant des props en argument et retournant un rendu JSX déclaratif.',
            },
            {
              id: 'q1-2',
              question: 'Comment type-t-on correctement les props d’un composant en TypeScript ?',
              options: [
                'En utilisant le type `any` partout',
                'En déclarant une `interface` ou un `type` définissant la structure attendue',
                'En créant une variable globale dans window',
                'TypeScript déduit toujours tout sans aucune indication',
              ],
              correctOptionIndex: 1,
              explanation:
                'Définir une interface dédiée (ex: `interface ButtonProps { label: string }`) permet d’assurer un contrat fort et l’auto-complétion.',
            },
            {
              id: 'q1-3',
              question: 'Pourquoi chaque élément d’une liste générée via `.map()` doit-il posséder une prop `key` unique ?',
              options: [
                'Pour le référencement naturel (SEO)',
                'Pour permettre au moteur de réconciliation de React d’identifier les éléments modifiés ou déplacés',
                'C’est une exigence du langage CSS',
                'Pour définir la couleur de la bordure',
              ],
              correctOptionIndex: 1,
              explanation:
                'La prop `key` aide React à identifier de manière stable quels items ont été changés, ajoutés ou supprimés lors du re-rendu.',
            },
          ],
        },
      },
      {
        id: 'c2-react-hooks',
        order: 2,
        title: 'Chapitre 2 : Gestion d’État & Hooks Avancés',
        description:
          'Maîtrisez les hooks fondamentaux : useState, useEffect, useMemo, useCallback ainsi que la création de hooks personnalisés pour encapsuler la logique métier.',
        youtubeUrl: 'https://www.youtube.com/watch?v=TNhaISAUy68',
        videoId: 'TNhaISAUy68',
        durationMinutes: 55,
        keyTakeaways: [
          'Cycle de vie et tableau de dépendances de useEffect',
          'Optimisation des calculs avec useMemo',
          'Création de Custom Hooks pour factoriser le code',
        ],
        resources: [
          { id: 'r3', title: 'Guide des Hooks Réactifs', url: 'https://react.dev/reference/react' },
        ],
        quiz: {
          id: 'quiz-react-2',
          title: 'Validation Chapitre 2 : Hooks & Performance',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q2-1',
              question: 'Que se passe-t-il si vous passez un tableau vide `[]` comme deuxième argument à `useEffect` ?',
              options: [
                'L’effet s’exécute à chaque milliseconde',
                'L’effet ne s’exécute qu’une seule fois après le premier montage du composant',
                'Le composant crash immédiatement',
                'L’effet est désactivé et ne s’exécute jamais',
              ],
              correctOptionIndex: 1,
              explanation:
                'Un tableau de dépendances vide indique à React que l’effet ne dépend d’aucune valeur variable des props ou du state, et s’exécute donc au montage initial.',
            },
            {
              id: 'q2-2',
              question: 'Dans quel cas est-il pertinent d’utiliser le hook `useMemo` ?',
              options: [
                'Pour remplacer tous les appels de fonctions simples',
                'Pour mémoriser le résultat d’un calcul coûteux afin d’éviter de le recalculer à chaque rendu',
                'Pour forcer le rechargement de la page web',
                'Uniquement pour les formulaires HTML',
              ],
              correctOptionIndex: 1,
              explanation:
                'useMemo permet d’éviter de ré-exécuter une opération mathématique ou de tri gourmande tant que ses dépendances restent inchangées.',
            },
            {
              id: 'q2-3',
              question: 'Quelle est la règle fondamentale des Hooks React ?',
              options: [
                'Ils doivent être appelés uniquement au niveau racine du composant, jamais dans des conditions ou des boucles',
                'On peut les appeler n’importe où dans n’importe quelle fonction classique',
                'Ils doivent comporter au moins 10 paramètres',
                'On ne peut avoir qu’un seul hook par fichier',
              ],
              correctOptionIndex: 0,
              explanation:
                'Les Hooks doivent toujours être appelés dans le même ordre à chaque rendu, donc jamais à l’intérieur d’instructions `if`, de boucles ou de fonctions imbriquées.',
            },
          ],
        },
      },
      {
        id: 'c3-react-prod',
        order: 3,
        title: 'Chapitre 3 : Architecture Pro, Tests & Déploiement',
        description:
          'Organisation d’un projet d’envergure, mise en place des routes, gestion du cache, sécurisation des flux et préparation du build de production.',
        youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        videoId: 'bMknfKXIFA8',
        durationMinutes: 60,
        keyTakeaways: [
          'Structure de dossiers par fonctionnalités (Feature-based structure)',
          'Code splitting et Lazy loading des routes',
          'Mesure de performance Core Web Vitals',
        ],
        resources: [
          { id: 'r4', title: 'Checklist de Production Frontend', url: 'https://web.dev/vitals/' },
        ],
        quiz: {
          id: 'quiz-react-3',
          title: 'Validation Finale Chapitre 3 : Architecture & Production',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q3-1',
              question: 'Quel est l’avantage principal du "Lazy Loading" (chargement différé) avec `React.lazy()` ?',
              options: [
                'Il réduit la taille du bundle initial téléchargé par le navigateur client',
                'Il supprime le besoin d’avoir une connexion internet',
                'Il crypte automatiquement le code source',
                'Il augmente artificiellement la vitesse du processeur',
              ],
              correctOptionIndex: 0,
              explanation:
                'Le Lazy Loading découpe l’application en petits morceaux (chunks) qui ne sont téléchargés que lorsque l’utilisateur visite l’écran concerné.',
            },
            {
              id: 'q3-2',
              question: 'Pourquoi est-il crucial de ne jamais exposer les clés secrètes d’API privées dans le code client React ?',
              options: [
                'Parce que le navigateur ne supporte pas les chaînes de caractères secrètes',
                'Parce que tout le code client est visible et inspectable publiquement dans les DevTools',
                'Parce que cela ralentit l’affichage du logo',
                'Parce que le fichier HTML deviendrait trop volumineux',
              ],
              correctOptionIndex: 1,
              explanation:
                'Tout code exécuté dans le navigateur est accessible à n’importe quel utilisateur. Les clés privées doivent impérativement rester sur un serveur sécurisé.',
            },
            {
              id: 'q3-3',
              question: 'Quelle commande Vite prépare les fichiers statiques optimisés pour la mise en production ?',
              options: [
                '`vite dev`',
                '`vite build`',
                '`vite serve --debug`',
                '`npm run start-local`',
              ],
              correctOptionIndex: 1,
              explanation:
                'La commande `vite build` compile, minifie et génère l’ensemble des assets optimisés dans le dossier de distribution `dist/`.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'course-ai-prompt',
    title: 'Intelligence Artificielle Générative & Prompt Engineering',
    thematicId: 'ai-data',
    description:
      'Comprenez le fonctionnement interne des modèles de langage (LLMs) et maîtrisez l’art du prompt engineering pour automatiser vos tâches et créer des solutions intelligentes.',
    instructorName: 'Dr. Sarah Benali',
    instructorTitle: 'Chercheuse en IA appliquée & Consultante Data',
    level: 'Débutant',
    estimatedHours: 4,
    certificateTitle: 'Certificat Supérieur en Ingénierie de Prompts & IA Générative',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01',
    chapters: [
      {
        id: 'c1-ai-intro',
        order: 1,
        title: 'Chapitre 1 : Comprendre les LLMs et les Transformers',
        description:
          'Introduction aux fondements de l’intelligence artificielle moderne : architecture Transformer, mécanismes d’attention, tokens et fenêtres de contexte.',
        youtubeUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
        videoId: 'zjkBMFhNj_g',
        durationMinutes: 40,
        keyTakeaways: [
          'Fonctionnement de la prédiction du token suivant',
          'Différence entre modèle de base et modèle affiné (fine-tuned)',
          'Compréhension des limites et des hallucinations',
        ],
        resources: [
          { id: 'r5', title: 'Introduction aux Transformers', url: 'https://huggingface.co' },
        ],
        quiz: {
          id: 'quiz-ai-1',
          title: 'Validation Chapitre 1 : Fondements des Modèles de Langage',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-ai-1-1',
              question: 'Qu’est-ce qu’un "token" dans le contexte d’un grand modèle de langage (LLM) ?',
              options: [
                'Une crypto-monnaie utilisée pour payer le serveur',
                'Un fragment de mot ou groupe de caractères utilisé comme unité de traitement par le modèle',
                'Un mot de passe chiffré',
                'Un pixel d’image',
              ],
              correctOptionIndex: 1,
              explanation:
                'Les LLMs découpent les textes en sous-mots appelés tokens (en moyenne 1 token correspond à environ 4 caractères ou 0,75 mot en français).',
            },
            {
              id: 'q-ai-1-2',
              question: 'Qu’appelle-t-on une "hallucination" chez une intelligence artificielle générative ?',
              options: [
                'Une image en 3D générée par erreur',
                'Une réponse affirmée avec assurance par le modèle mais factuellement fausse ou inventée',
                'Un virus informatique qui infecte le réseau',
                'Une mise en veille programmée du serveur',
              ],
              correctOptionIndex: 1,
              explanation:
                'Les hallucinations surviennent lorsque le modèle génère une suite de tokens statistiquement plausible sans ancrage dans la réalité des faits.',
            },
          ],
        },
      },
      {
        id: 'c2-ai-techniques',
        order: 2,
        title: 'Chapitre 2 : Techniques Avancées : Few-Shot & Chain-of-Thought',
        description:
          'Apprenez à structurer des requêtes complexes : rôle, contexte, contraintes, exemples (few-shot prompting) et raisonnement étape par étape (Chain of Thought).',
        youtubeUrl: 'https://www.youtube.com/watch?v=jC4v5AS4RIM',
        videoId: 'jC4v5AS4RIM',
        durationMinutes: 50,
        keyTakeaways: [
          'Format standardisé de prompt (Persona + Objectif + Contraintes + Format)',
          'Le pouvoir de l’incitation au raisonnement pas-à-pas',
          'Techniques de réduction drastique des hallucinations',
        ],
        quiz: {
          id: 'quiz-ai-2',
          title: 'Validation Chapitre 2 : Ingénierie de Prompts Efficace',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-ai-2-1',
              question: 'En quoi consiste le "Few-Shot Prompting" ?',
              options: [
                'Fournir quelques exemples concrets d’entrées/sorties attendues dans le prompt pour guider le modèle',
                'Répéter la même question dix fois très vite',
                'Limiter la longueur de la question à trois mots',
                'Prendre une photo de l’écran',
              ],
              correctOptionIndex: 0,
              explanation:
                'Le few-shot prompting donne au modèle 2 à 3 exemples de format cible, ce qui augmente considérablement la fidélité de la réponse.',
            },
            {
              id: 'q-ai-2-2',
              question: 'Pourquoi l’instruction "Réfléchis étape par étape avant de conclure" améliore-t-elle les résultats ?',
              options: [
                'Elle force le modèle à utiliser des tokens de raisonnement intermédiaires (Chain-of-Thought)',
                'Elle désactive la connexion wifi pour économiser de la bande passante',
                'Elle active la traduction automatique en latin',
                'Elle ne change rien du tout',
              ],
              correctOptionIndex: 0,
              explanation:
                'En décomposant la tâche, le modèle génère son propre contexte intermédiaire, réduisant drastiquement les erreurs de logique.',
            },
          ],
        },
      },
      {
        id: 'c3-ai-agents',
        order: 3,
        title: 'Chapitre 3 : Agents Autonomes & Appels d’Outils (Tool Use)',
        description:
          'Comprendre comment doter un modèle d’outils externes (recherche web, exécution de code, calculatrice, API tierces) pour créer des agents intelligents.',
        youtubeUrl: 'https://www.youtube.com/watch?v=5p248yoa3oE',
        videoId: '5p248yoa3oE',
        durationMinutes: 50,
        keyTakeaways: [
          'Boucle de raisonnement Agent : Perception -> Décision -> Action -> Synthèse',
          'Format de function calling et génération de schémas JSON stricts',
          'Sécurité et supervision humaine (Human-in-the-loop)',
        ],
        quiz: {
          id: 'quiz-ai-3',
          title: 'Validation Chapitre 3 : Écosystème des Agents IA',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-ai-3-1',
              question: 'Qu’est-ce que le "Function Calling" (ou Tool Calling) pour un LLM ?',
              options: [
                'La capacité du modèle à identifier le moment opportun et les paramètres précis pour invoquer une fonction externe',
                'Un appel téléphonique vocal passé par l’IA',
                'Le redémarrage du système d’exploitation',
                'Une méthode pour bloquer l’accès à internet',
              ],
              correctOptionIndex: 0,
              explanation:
                'Le function calling permet au modèle de structurer un appel d’outil (en JSON) pour interroger une base de données, une météo ou une API réelle.',
            },
            {
              id: 'q-ai-3-2',
              question: 'Quel est le rôle du principe "Human-in-the-loop" dans les workflows d’agents IA ?',
              options: [
                'Laisser un humain valider ou superviser les actions sensibles avant leur exécution finale',
                'Remplacer complètement l’ordinateur par une personne physique',
                'Interdire toute utilisation de l’intelligence artificielle',
                'Créer un dessin animé sur les robots',
              ],
              correctOptionIndex: 0,
              explanation:
                'La supervision humaine garantit la sécurité et la conformité lors d’actions critiques comme un virement, une suppression de données ou un envoi d’e-mail massif.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'course-uiux-design',
    title: 'UI/UX Design : Concevoir des Produits Digitaux Engageants',
    thematicId: 'design-uiux',
    description:
      'Apprenez les règles d’or du design d’interface : hiérarchie visuelle, psychologie cognitive, typographie, design systems modulaires et tests d’utilisabilité.',
    instructorName: 'Camille Leroy',
    instructorTitle: 'Directrice Artistique & Consultante UX Senior',
    level: 'Tous niveaux',
    estimatedHours: 5,
    certificateTitle: 'Certificat Professionnel en Design d’Interface & Expérience Utilisateur',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-20',
    chapters: [
      {
        id: 'c1-uiux-laws',
        order: 1,
        title: 'Chapitre 1 : Psychologie Cognitive & Lois Fondamentales de l’UX',
        description:
          'Découvrez la loi de Fitts, la loi de Hick, la loi de Jakob et l’effet d’isolement de Von Restorff pour créer des interfaces intuitives et sans friction.',
        youtubeUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
        videoId: 'c9Wg6Cb_YlU',
        durationMinutes: 35,
        keyTakeaways: [
          'Loi de Hick : limiter les choix pour accélérer la décision',
          'Loi de Fitts : taille et distance des cibles cliquables',
          'Loi de Jakob : respecter les conventions familières des utilisateurs',
        ],
        quiz: {
          id: 'quiz-ui-1',
          title: 'Validation Chapitre 1 : Lois Psychologiques de l’UX',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-ui-1-1',
              question: 'Que stipule la Loi de Hick en design d’expérience utilisateur ?',
              options: [
                'Plus le nombre de choix proposés est grand, plus le temps nécessaire pour prendre une décision augmente',
                'Tous les boutons doivent être bleus',
                'Les utilisateurs lisent l’intégralité de chaque paragraphe de texte',
                'Il faut toujours afficher au minimum 15 options différentes',
              ],
              correctOptionIndex: 0,
              explanation:
                'La loi de Hick démontre qu’un trop grand nombre d’options engendre de la surcharge cognitive et paralyse la décision de l’utilisateur.',
            },
            {
              id: 'q-ui-1-2',
              question: 'Selon la Loi de Jakob, pourquoi est-il recommandé de respecter les conventions graphiques existantes ?',
              options: [
                'Parce que les utilisateurs passent la majorité de leur temps sur d’autres sites et s’attendent à un fonctionnement familier',
                'Parce que la loi impose une amende en cas d’originalité',
                'Pour obliger les utilisateurs à réapprendre le web',
                'Pour copier servilement ses concurrents sans réfléchir',
              ],
              correctOptionIndex: 0,
              explanation:
                'Jakob Nielsen rappelle que les utilisateurs transfèrent leurs habitudes acquises sur les autres plateformes ; respecter ces conventions réduit la courbe d’apprentissage.',
            },
          ],
        },
      },
      {
        id: 'c2-uiux-system',
        order: 2,
        title: 'Chapitre 2 : Systèmes de Design, Typographie & Espacement',
        description:
          'Mise en place d’une échelle typographique harmonique, grille de 8 points, gestion cohérente des contrastes WCAG et création de bibliothèques d’assets réutilisables.',
        youtubeUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        videoId: 'FTFaQWZBqQ8',
        durationMinutes: 45,
        keyTakeaways: [
          'Règle du système d’espacement basé sur des multiples de 8px (ou 4px)',
          'Importance du contraste de couleurs (ratio 4.5:1 pour le texte courant)',
          'Architecture de tokens de design (Couleurs, Typo, Radius, Ombres)',
        ],
        quiz: {
          id: 'quiz-ui-2',
          title: 'Validation Chapitre 2 : Design Systems & Accessibilité',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-ui-2-1',
              question: 'Quel est le ratio de contraste minimal recommandé par les normes WCAG AA pour le texte de corps de page ?',
              options: [
                '1:1',
                '4.5:1',
                '20:1',
                'Il n’y a aucune norme de contraste',
              ],
              correctOptionIndex: 1,
              explanation:
                'Les critères WCAG 2.1 niveau AA exigent un contraste d’au moins 4.5:1 pour le texte normal afin d’assurer la lisibilité pour les personnes malvoyantes.',
            },
            {
              id: 'q-ui-2-2',
              question: 'Pourquoi la grille d’espacement de 8 pixels (8pt grid system) est-elle si populaire ?',
              options: [
                'Parce que 8 est divisible par 2 et 4, et s’adapte parfaitement aux densités d’écrans modernes (1x, 2x, 3x)',
                'Parce qu’elle a été inventée en l’an 800',
                'Parce que les navigateurs refusent d’afficher des marges de 10px',
                'C’est un mythe sans aucune utilité pratique',
              ],
              correctOptionIndex: 0,
              explanation:
                'Le multiple de 8px permet un redimensionnement net et sans sous-pixels flous sur toutes les résolutions d’écrans (retina, mobile, desktop).',
            },
          ],
        },
      },
    ],
  },
];
