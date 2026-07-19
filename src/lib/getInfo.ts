import type { YoutubeEnrichedItem } from '../type/youtube';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:com|fr)\b/i;
const INSTA_HANDLE_REGEX = /(?:^|[^a-zA-Z0-9._%+-])@([a-zA-Z0-9._]{2,30})\b/;
const INSTA_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]{2,30})\/?/i;
/** Label must be a whole word + separator (Instagram :, IG -, etc.) — avoids matching "insta" inside "Instagram" or "ig" inside "obligatoire" */
const INSTA_LABEL_REGEX =
  /\b(?:instagram|insta|ig)\b\s*[:\-–]\s*@?(?!https?:\/\/)([a-zA-Z0-9._]{2,30})\b/i;

const INSTA_RESERVED = new Set([
  'accounts',
  'p',
  'reel',
  'reels',
  'stories',
  'explore',
  'direct',
  'legal',
  'about',
  'privacy',
  'share',
  'tv',
  'tags',
  'directory',
  'http',
  'https',
  'www',
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
]);

function getDescriptions(item: YoutubeEnrichedItem): string {
  return [
    item.video.snippet.description,
    item.channel?.snippet.description,
    item.channel?.brandingSettings?.channel?.description,
  ]
    .filter(Boolean)
    .join('\n');
}

function isValidInsta(handle: string | undefined): handle is string {
  return Boolean(handle) && !INSTA_RESERVED.has(handle!.toLowerCase());
}

export const getEmail = (item: YoutubeEnrichedItem): string => {
  const match = getDescriptions(item).match(EMAIL_REGEX);
  return match?.[0] ?? '';
};

export const getInsta = (item: YoutubeEnrichedItem): string => {
  const text = getDescriptions(item);

  const urlMatch = text.match(INSTA_URL_REGEX)?.[1];
  const labelMatch = text.match(INSTA_LABEL_REGEX)?.[1];
  const handleMatch = text.match(INSTA_HANDLE_REGEX)?.[1];

  if (isValidInsta(urlMatch)) return urlMatch;
  if (isValidInsta(labelMatch)) return labelMatch;
  if (isValidInsta(handleMatch)) return handleMatch;

  return '';
};

export const getCountry = (item: YoutubeEnrichedItem): string => {
  return item.channel?.snippet?.country ?? item.video.snippet.defaultLanguage ?? '';
};
