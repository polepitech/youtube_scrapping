import {
  API_URL,
  IDS_PER_REQUEST,
  LIMIT_PER_PAGE,
  PAGE_NUMBER,
  RELEVANCE_LANGUAGE,
  SEARCH_ORDER,
  SEARCH_TYPE,
  VIDEO_DURATION,
} from '../config';
import type {
  YoutubeChannel,
  YoutubeChannelListResponse,
  YoutubeSearchListResponse,
  YoutubeVideo,
  YoutubeVideoListResponse,
} from '../type/youtube';

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error('YOUTUBE_API_KEY is missing. Ensure .env is loaded (npm run scrap).');
  }
  return key;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function youtubeGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(path, API_URL);
  url.searchParams.set('key', getApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.error) {
    const message = data.error?.message ?? response.statusText;
    throw new Error(`YouTube API error (${path}): ${message}`);
  }

  return data as T;
}

export async function searchVideosPage(
  searchQuery: string,
  pageToken: string | null = null,
): Promise<YoutubeSearchListResponse> {
  const params: Record<string, string> = {
    part: 'snippet',
    type: SEARCH_TYPE,
    order: SEARCH_ORDER,
    maxResults: LIMIT_PER_PAGE.toString(),
    relevanceLanguage: RELEVANCE_LANGUAGE,
    videoDuration: VIDEO_DURATION,
    q: searchQuery,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }

  return youtubeGet<YoutubeSearchListResponse>('search', params);
}

export async function searchAllVideos(searchQuery: string): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken: string | null = null;

  for (let i = 0; i < PAGE_NUMBER; i++) {
    const response = await searchVideosPage(searchQuery, pageToken);
    const ids = (response.items ?? [])
      .map((item) => item.id.videoId)
      .filter((id): id is string => Boolean(id));

    videoIds.push(...ids);

    pageToken = response.nextPageToken ?? null;
    if (!pageToken) break;
  }

  return videoIds;
}

export async function fetchVideosByIds(ids: string[]): Promise<YoutubeVideo[]> {
  if (ids.length === 0) return [];

  const videos: YoutubeVideo[] = [];
  for (const batch of chunk(ids, IDS_PER_REQUEST)) {
    const response = await youtubeGet<YoutubeVideoListResponse>('videos', {
      part: 'snippet',
      id: batch.join(','),
    });
    videos.push(...(response.items ?? []));
  }

  return videos;
}

export async function fetchChannelsByIds(ids: string[]): Promise<YoutubeChannel[]> {
  if (ids.length === 0) return [];

  const channels: YoutubeChannel[] = [];
  for (const batch of chunk(ids, IDS_PER_REQUEST)) {
    const response = await youtubeGet<YoutubeChannelListResponse>('channels', {
      part: 'snippet,statistics,brandingSettings',
      id: batch.join(','),
    });
    channels.push(...(response.items ?? []));
  }

  return channels;
}
