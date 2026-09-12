import { Course, Thematic, UserProgress, DiscussionThread, DiscussionReply } from '../types';
import { INITIAL_COURSES, INITIAL_THEMATICS } from '../data/mockData';
import { INITIAL_DISCUSSIONS } from '../data/mockDiscussions';

const STORAGE_KEYS = {
  COURSES: 'edumoodle_courses_v1',
  THEMATICS: 'edumoodle_thematics_v1',
  PROGRESS: 'edumoodle_user_progress_v1',
  DISCUSSIONS: 'edumoodle_discussions_v1',
};

export const DEFAULT_USER_PROGRESS: UserProgress = {
  studentName: 'Zahire Benkhelifa',
  studentEmail: 'zahire.benkhelifa@gmail.com',
  completedVideos: {},
  quizResults: {},
  completedCourses: {},
  unlockedChaptersOverride: {},
};

export function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COURSES;
  } catch (err) {
    console.error('Failed to load courses from storage, fallback to default', err);
    return INITIAL_COURSES;
  }
}

export function saveCourses(courses: Course[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (err) {
    console.error('Failed to save courses to localStorage', err);
  }
}

export function loadThematics(): Thematic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEMATICS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.THEMATICS, JSON.stringify(INITIAL_THEMATICS));
      return INITIAL_THEMATICS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_THEMATICS;
  } catch (err) {
    console.error('Failed to load thematics', err);
    return INITIAL_THEMATICS;
  }
}

export function saveThematics(thematics: Thematic[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEMATICS, JSON.stringify(thematics));
  } catch (err) {
    console.error('Failed to save thematics to localStorage', err);
  }
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_USER_PROGRESS));
      return DEFAULT_USER_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load progress', err);
    return DEFAULT_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress', err);
  }
}

/**
 * Progression logic:
 * A chapter is unlocked if:
 * 1. It is the very first chapter (index 0)
 * 2. OR the previous chapter's video is completed AND its quiz is passed
 * 3. OR the instructor override is enabled
 */
export function isChapterUnlocked(
  course: Course,
  chapterIndex: number,
  progress: UserProgress,
  isInstructor = false
): boolean {
  if (isInstructor) return true;
  if (chapterIndex === 0) return true;

  const targetChapter = course.chapters[chapterIndex];
  if (progress.unlockedChaptersOverride?.[targetChapter.id]) {
    return true;
  }

  const prevChapter = course.chapters[chapterIndex - 1];
  if (!prevChapter) return true;

  const videoDone = !!progress.completedVideos[prevChapter.id];
  const quizPassed = !!progress.quizResults[prevChapter.id]?.passed;

  return videoDone && quizPassed;
}

export function isChapterCompleted(chapterId: string, progress: UserProgress): boolean {
  const videoDone = !!progress.completedVideos[chapterId];
  const quizPassed = !!progress.quizResults[chapterId]?.passed;
  return videoDone && quizPassed;
}

export interface CourseProgressStats {
  percentage: number;
  completedChapters: number;
  totalChapters: number;
  isCompleted: boolean;
  totalQuizzesPassed: number;
  averageScorePercent: number;
}

export function calculateCourseProgress(course: Course, progress: UserProgress): CourseProgressStats {
  const totalChapters = course.chapters.length;
  if (totalChapters === 0) {
    return {
      percentage: 0,
      completedChapters: 0,
      totalChapters: 0,
      isCompleted: false,
      totalQuizzesPassed: 0,
      averageScorePercent: 0,
    };
  }

  let completedChapters = 0;
  let totalQuizzesPassed = 0;
  let totalScoreSum = 0;
  let scoredQuizzesCount = 0;

  course.chapters.forEach((ch) => {
    const videoDone = !!progress.completedVideos[ch.id];
    const quizResult = progress.quizResults[ch.id];
    const quizPassed = !!quizResult?.passed;

    if (videoDone && quizPassed) {
      completedChapters += 1;
    }
    if (quizPassed) {
      totalQuizzesPassed += 1;
    }
    if (quizResult && quizResult.percentage !== undefined) {
      totalScoreSum += quizResult.percentage;
      scoredQuizzesCount += 1;
    }
  });

  const percentage = Math.round((completedChapters / totalChapters) * 100);
  const isCompleted = completedChapters === totalChapters;
  const averageScorePercent =
    scoredQuizzesCount > 0 ? Math.round(totalScoreSum / scoredQuizzesCount) : 0;

  return {
    percentage,
    completedChapters,
    totalChapters,
    isCompleted,
    totalQuizzesPassed,
    averageScorePercent,
  };
}

export function generateCertificateId(courseId: string, studentName: string): string {
  const cleanCourse = courseId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const cleanStudent = studentName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EM-${cleanCourse}-${cleanStudent}-${randomNum}`;
}

export function loadDiscussions(): DiscussionThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(INITIAL_DISCUSSIONS));
      return INITIAL_DISCUSSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DISCUSSIONS;
  } catch (err) {
    console.error('Failed to load discussions from storage, fallback to default', err);
    return INITIAL_DISCUSSIONS;
  }
}

export function saveDiscussions(threads: DiscussionThread[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(threads));
  } catch (err) {
    console.error('Failed to save discussions to localStorage', err);
  }
}

export function getCourseDiscussionStats(courseId: string, threads: DiscussionThread[]) {
  const courseThreads = threads.filter((t) => t.courseId === courseId);
  const chapterThreads = courseThreads.filter((t) => !t.isGeneralCourseComment);
  const generalReviews = courseThreads.filter((t) => t.isGeneralCourseComment);

  let totalReplies = 0;
  courseThreads.forEach((t) => {
    totalReplies += t.replies.length;
  });

  const ratings = generalReviews.filter((t) => typeof t.rating === 'number' && t.rating > 0);
  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratings.length).toFixed(1))
      : 5.0;

  return {
    totalThreads: courseThreads.length,
    chapterThreadsCount: chapterThreads.length,
    generalReviewsCount: generalReviews.length,
    totalReplies,
    averageRating,
    ratingCount: ratings.length,
  };
}
