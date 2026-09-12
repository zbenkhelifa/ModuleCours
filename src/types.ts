export interface Thematic {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // Tailwind color class or hex for badge
  iconName: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScorePercent: number; // e.g. 70
  questions: QuizQuestion[];
}

export interface ChapterResource {
  id: string;
  title: string;
  url: string;
  type?: 'link' | 'pdf' | 'code';
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  description: string;
  youtubeUrl: string;
  videoId: string;
  durationMinutes: number;
  keyTakeaways: string[];
  lectureNotes?: string;
  resources?: ChapterResource[];
  quiz: Quiz;
}

export interface Course {
  id: string;
  title: string;
  thematicId: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  estimatedHours: number;
  certificateTitle: string;
  thumbnailUrl?: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt?: string;
}

export interface QuizAttemptResult {
  passed: boolean;
  score: number; // e.g. 3
  total: number; // e.g. 3
  percentage: number; // e.g. 100
  answers: Record<string, number>; // questionId -> chosenOptionIndex
  attemptedAt: string;
}

export interface UserProgress {
  studentName: string;
  studentEmail: string;
  completedVideos: Record<string, boolean>; // chapterId -> true
  quizResults: Record<string, QuizAttemptResult>; // chapterId -> latest result
  completedCourses: Record<
    string,
    {
      completedAt: string;
      certificateId: string;
      finalGrade: string; // e.g., 'Mention Très Bien'
      averageScore: number;
    }
  >;
  unlockedChaptersOverride?: Record<string, boolean>; // For instructor/preview mode
}

export type AppView = 'catalog' | 'course' | 'stats' | 'admin';
export type UserRole = 'student' | 'instructor' | 'admin';

export interface DiscussionReply {
  id: string;
  threadId?: string;
  authorName: string;
  authorRole: UserRole;
  authorEmail?: string;
  content: string;
  createdAt: string;
  likes: number;
  isInstructorResponse?: boolean;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  chapterId?: string; // If undefined or empty, this is a course-level general review/discussion
  isGeneralCourseComment?: boolean;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  authorEmail?: string;
  videoTimestamp?: string; // e.g. "04:15"
  rating?: number; // 1 to 5 stars for general course comments/reviews
  createdAt: string;
  likes: number;
  isResolved?: boolean;
  replies: DiscussionReply[];
}
