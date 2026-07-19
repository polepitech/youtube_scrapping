/** Shared */

export type YoutubeThumbnail = {
  url: string;
  width: number;
  height: number;
};

export type YoutubeThumbnails = {
  default?: YoutubeThumbnail;
  medium?: YoutubeThumbnail;
  high?: YoutubeThumbnail;
  standard?: YoutubeThumbnail;
  maxres?: YoutubeThumbnail;
};

export type YoutubeLocalized = {
  title: string;
  description: string;
};

export type YoutubePageInfo = {
  totalResults: number;
  resultsPerPage: number;
};

export type YoutubeListResponse<T> = {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo?: YoutubePageInfo;
  items: T[];
};

/** Search: list */

export type YoutubeSearchResultId = {
  kind: string;
  videoId?: string;
  channelId?: string;
  playlistId?: string;
};

export type YoutubeSearchResultSnippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  liveBroadcastContent?: string;
  publishTime?: string;
};

export type YoutubeSearchResult = {
  kind: 'youtube#searchResult';
  etag: string;
  id: YoutubeSearchResultId;
  snippet: YoutubeSearchResultSnippet;
};

export type YoutubeSearchListResponse = YoutubeListResponse<YoutubeSearchResult> & {
  kind: 'youtube#searchListResponse';
};

/** Videos: list */

export type YoutubeVideoSnippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId?: string;
  liveBroadcastContent?: string;
  defaultLanguage?: string;
  localized?: YoutubeLocalized;
  defaultAudioLanguage?: string;
};

export type YoutubeVideo = {
  kind: 'youtube#video';
  etag: string;
  id: string;
  snippet: YoutubeVideoSnippet;
};

export type YoutubeVideoListResponse = YoutubeListResponse<YoutubeVideo> & {
  kind: 'youtube#videoListResponse';
};

/** Channels: list */

export type YoutubeChannelSnippet = {
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: YoutubeThumbnails;
  localized?: YoutubeLocalized;
  country?: string;
};

export type YoutubeChannelStatistics = {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
};

export type YoutubeChannelBrandingSettings = {
  channel?: {
    title?: string;
    description?: string;
    keywords?: string;
    unsubscribedTrailer?: string;
    country?: string;
  };
  image?: {
    bannerExternalUrl?: string;
  };
};

export type YoutubeChannel = {
  kind: 'youtube#channel';
  etag: string;
  id: string;
  snippet: YoutubeChannelSnippet;
  statistics?: YoutubeChannelStatistics;
  brandingSettings?: YoutubeChannelBrandingSettings;
};

export type YoutubeChannelListResponse = YoutubeListResponse<YoutubeChannel> & {
  kind: 'youtube#channelListResponse';
};

/** Enriched item (pipeline output) */

export type YoutubeEnrichedItem = {
  video: YoutubeVideo;
  channel: YoutubeChannel | null;
};
