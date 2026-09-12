/**
 * Utilities to parse YouTube URLs and generate thumbnail & embed links safely.
 */

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If it's already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Regex matching standard watch, shorts, embed and youtu.be links
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = trimmed.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }
  } catch {
    // Fallback if parsing fails
  }

  return null;
}

export function getYouTubeEmbedUrl(videoIdOrUrl: string, autoPlay = false): string {
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1${
    autoPlay ? '&autoplay=1' : ''
  }`;
}

export function getYouTubeThumbnailUrl(videoIdOrUrl: string, quality: 'hq' | 'max' = 'hq'): string {
  const id = extractYouTubeId(videoIdOrUrl);
  if (!id) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  }
  if (quality === 'max') {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
  return `${remainingMinutes} min`;
}
