export const LISTENING_STATUSES = [
  "WANT_TO_LISTEN",
  "CURRENTLY_LISTENING",
  "LISTENED",
  "DROPPED",
] as const;

export type ListeningStatus = (typeof LISTENING_STATUSES)[number];


export type DiscogsSearchType = 'release' | 'master' | 'artist';
