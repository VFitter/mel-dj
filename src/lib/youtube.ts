export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface YouTubeMeta {
  title: string;
  artist: string;
  thumbnailUrl: string;
  durationSeconds: number;
}

export async function fetchYouTubeMeta(videoId: string): Promise<YouTubeMeta> {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const oembedRes = await fetch(oembedUrl);
  if (!oembedRes.ok) {
    throw new Error("Failed to fetch video metadata");
  }
  const oembed: { title: string; author_name: string; thumbnail_url: string } = await oembedRes.json();

  let durationSeconds = 0;
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MELPlayer/1.0)" },
    });
    const html = await pageRes.text();
    const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});\s*var\s/);
    if (match) {
      const data = JSON.parse(match[1]);
      durationSeconds = parseInt(data.videoDetails?.lengthSeconds, 10) || 0;
    }
  } catch {
    // fallback: estimate from title or default
  }

  if (!durationSeconds) {
    durationSeconds = 180;
  }

  return {
    title: oembed.title,
    artist: oembed.author_name,
    thumbnailUrl: oembed.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    durationSeconds,
  };
}
