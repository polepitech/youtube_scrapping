import { prisma } from './prisma';

export type BeatmakerInput = {
  youtubeId?: string;
  name?: string;
  follower?: string | number;
  email?: string;
  insta?: string;
  country?: string;
};

function emptyToNull(value: string | undefined): string | null {
  return value ? value : null;
}

function toFollower(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  const parsed = Number.parseInt(value ?? '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function insertNewBeatmakers(beatmakers: BeatmakerInput[]): Promise<number> {
  const candidates = beatmakers.filter(
    (b): b is BeatmakerInput & { youtubeId: string; name: string } =>
      Boolean(b.youtubeId && b.name),
  );

  const uniqueByYoutubeId = new Map(candidates.map((b) => [b.youtubeId, b]));
  const youtubeIds = [...uniqueByYoutubeId.keys()];
  if (youtubeIds.length === 0) return 0;

  const existing = await prisma.beatmaker.findMany({
    where: { youtubeId: { in: youtubeIds } },
    select: { youtubeId: true },
  });
  const existingIds = new Set(existing.map((row) => row.youtubeId));

  const toInsert = [...uniqueByYoutubeId.values()]
    .filter((b) => !existingIds.has(b.youtubeId))
    .map((b) => ({
      youtubeId: b.youtubeId,
      name: b.name,
      follower: toFollower(b.follower),
      email: emptyToNull(b.email),
      insta: emptyToNull(b.insta),
      country: emptyToNull(b.country),
    }));

  if (toInsert.length === 0) return 0;

  const result = await prisma.beatmaker.createMany({ data: toInsert });
  return result.count;
}
