export type {
  YoutubeChannel,
  YoutubeChannelBrandingSettings,
  YoutubeChannelListResponse,
  YoutubeChannelSnippet,
  YoutubeChannelStatistics,
  YoutubeEnrichedItem,
  YoutubeLocalized,
  YoutubePageInfo,
  YoutubeSearchListResponse,
  YoutubeSearchResult,
  YoutubeSearchResultId,
  YoutubeSearchResultSnippet,
  YoutubeThumbnail,
  YoutubeThumbnails,
  YoutubeVideo,
  YoutubeVideoListResponse,
  YoutubeVideoSnippet,
} from './youtube';

/** Flattened shape for later DB / beatmaker mapping */
export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  channelSubscriberCount: number;
};
