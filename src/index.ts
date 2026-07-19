import { ARTIST_NAME } from './config';
import { insertNewBeatmakers } from './lib/db';
import { fetchChannelsByIds, fetchVideosByIds, searchAllVideos } from './lib/fetch';
import { getCountry, getEmail, getInsta } from './lib/getInfo';
import type { YoutubeEnrichedItem } from './type/youtube';

function formatScrapDate(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}h${min}`;
}

const artistName = ARTIST_NAME[Math.floor(Math.random() * ARTIST_NAME.length)];
const searchQuery = `typebeat ${artistName}`;

let process_code = 0
try {
  console.log('-------');
  console.log(`debut du scrap ${artistName} /${formatScrapDate()}`);
  const videoIds = await searchAllVideos(searchQuery);
  console.log(`${videoIds.length} vidéo trouvé`);
  
  const videos = await fetchVideosByIds(videoIds);
  const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))];
  const channels = await fetchChannelsByIds(channelIds);
  console.log(`${channels.length} chaine trouvé`);
  
  const channelById = new Map(channels.map((c) => [c.id, c]));
  
  const items: YoutubeEnrichedItem[] = videos.map((video) => ({
    video,
    channel: channelById.get(video.snippet.channelId) ?? null,
  }));
  
  const beatmakers = items.map((item) => ({
    youtubeId: item.channel?.id,
    name: item.channel?.snippet?.title,
    follower: item.channel?.statistics?.subscriberCount,
    email: getEmail(item),
    insta: getInsta(item),
    country: getCountry(item),
  }));
  
  const inserted = await insertNewBeatmakers(beatmakers);
  console.log(`${inserted} nouvelles beatmakers ajoutées`);
  
} catch (error) {
  process_code = 1;
  console.error(error);
}
finally {
  console.log('---------');
  process.exit(process_code);
}
