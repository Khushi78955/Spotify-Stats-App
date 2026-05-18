export const MOCK_USER = {
  id: 'mockuser',
  display_name: 'Music Lover',
  email: 'user@example.com',
  images: [],
  followers: { total: 42 },
};

export const MOCK_TOP_TRACKS = {
  items: [
    { id: '1', name: 'Blinding Lights', artists: [{ name: 'The Weeknd' }], album: { name: 'After Hours', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874' }] }, duration_ms: 200040, popularity: 95 },
    { id: '2', name: 'Shape of You', artists: [{ name: 'Ed Sheeran' }], album: { name: '÷', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96' }] }, duration_ms: 233712, popularity: 90 },
    { id: '3', name: 'Levitating', artists: [{ name: 'Dua Lipa' }], album: { name: 'Future Nostalgia', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2737f305f99a7a2c0c0b0a7b0a0' }] }, duration_ms: 203064, popularity: 88 },
    { id: '4', name: 'Peaches', artists: [{ name: 'Justin Bieber' }], album: { name: 'Justice', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02' }] }, duration_ms: 198082, popularity: 85 },
    { id: '5', name: 'Good 4 U', artists: [{ name: 'Olivia Rodrigo' }], album: { name: 'SOUR', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a' }] }, duration_ms: 178147, popularity: 87 },
    { id: '6', name: 'Stay', artists: [{ name: 'The Kid LAROI' }, { name: 'Justin Bieber' }], album: { name: 'F*CK LOVE 3', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2737d7d6a5b6b4b5b4b5b4b5b4b' }] }, duration_ms: 141805, popularity: 86 },
    { id: '7', name: "drivers license", artists: [{ name: 'Olivia Rodrigo' }], album: { name: 'SOUR', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a' }] }, duration_ms: 242014, popularity: 84 },
    { id: '8', name: 'Montero', artists: [{ name: 'Lil Nas X' }], album: { name: 'MONTERO', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2738b52c6a9d86ecc1a12a33f86' }] }, duration_ms: 137433, popularity: 83 },
    { id: '9', name: 'Save Your Tears', artists: [{ name: 'The Weeknd' }], album: { name: 'After Hours', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874' }] }, duration_ms: 215627, popularity: 89 },
    { id: '10', name: 'Bad Guy', artists: [{ name: 'Billie Eilish' }], album: { name: 'When We All Fall Asleep', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e' }] }, duration_ms: 194088, popularity: 91 },
  ],
};

export const MOCK_TOP_ARTISTS = {
  items: [
    { id: 'a1', name: 'The Weeknd', genres: ['pop', 'r&b', 'soul'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5ebb99cacf7b776d0e839d5fd7e' }], popularity: 96, followers: { total: 45000000 } },
    { id: 'a2', name: 'Dua Lipa', genres: ['pop', 'dance pop', 'electronic'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb087bf3bca9cdf96af012daae' }], popularity: 90, followers: { total: 38000000 } },
    { id: 'a3', name: 'Billie Eilish', genres: ['pop', 'indie pop', 'electropop'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb9ae7f5a79b3f4fcbf7e1ceef' }], popularity: 93, followers: { total: 50000000 } },
    { id: 'a4', name: 'Drake', genres: ['hip-hop', 'rap', 'r&b'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9' }], popularity: 95, followers: { total: 55000000 } },
    { id: 'a5', name: 'Olivia Rodrigo', genres: ['pop', 'indie pop', 'bedroom pop'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4' }], popularity: 88, followers: { total: 28000000 } },
    { id: 'a6', name: 'Post Malone', genres: ['pop', 'hip-hop', 'trap'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb6be070445b03e0b63147c2c1' }], popularity: 87, followers: { total: 35000000 } },
    { id: 'a7', name: 'Taylor Swift', genres: ['pop', 'country pop', 'singer-songwriter'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0' }], popularity: 99, followers: { total: 80000000 } },
    { id: 'a8', name: 'Ed Sheeran', genres: ['pop', 'singer-songwriter', 'acoustic pop'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba' }], popularity: 91, followers: { total: 60000000 } },
    { id: 'a9', name: 'Ariana Grande', genres: ['pop', 'dance pop', 'r&b'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb40b4038e49f9edab0278b63d' }], popularity: 92, followers: { total: 55000000 } },
    { id: 'a10', name: 'Kendrick Lamar', genres: ['hip-hop', 'rap', 'conscious hip hop'], images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022' }], popularity: 90, followers: { total: 28000000 } },
  ],
};

// Fixed distribution — deterministic so the demo heatmap looks intentional.
// Pattern: heavy evening listening (20-22h), morning commute (8-9h),
// light afternoons, nearly silent 2-6am. Weekends skew earlier.
// Each entry is [dayOfWeek 0-6, hourOfDay 0-23, weeksAgo 0-3].
const FIXED_PLAYS = [
  // Sunday — relaxed afternoon + evening
  [0,14,0],[0,15,0],[0,16,0],[0,20,0],[0,21,0],[0,21,0],[0,22,0],
  [0,14,1],[0,16,1],[0,20,1],[0,21,1],[0,22,1],
  [0,15,2],[0,16,2],[0,20,2],[0,21,2],[0,22,2],[0,23,2],
  [0,13,3],[0,15,3],[0,20,3],[0,21,3],
  // Monday — commute + heavy evening
  [1,8,0],[1,9,0],[1,12,0],[1,20,0],[1,20,0],[1,21,0],[1,21,0],[1,22,0],
  [1,8,1],[1,9,1],[1,20,1],[1,21,1],[1,22,1],
  [1,8,2],[1,12,2],[1,20,2],[1,21,2],[1,22,2],
  [1,8,3],[1,9,3],[1,20,3],[1,21,3],[1,22,3],
  // Tuesday
  [2,8,0],[2,9,0],[2,13,0],[2,20,0],[2,21,0],[2,22,0],[2,23,0],
  [2,8,1],[2,20,1],[2,21,1],[2,22,1],
  [2,8,2],[2,9,2],[2,20,2],[2,21,2],[2,22,2],
  [2,8,3],[2,20,3],[2,21,3],
  // Wednesday
  [3,8,0],[3,12,0],[3,20,0],[3,21,0],[3,22,0],
  [3,8,1],[3,9,1],[3,20,1],[3,21,1],[3,22,1],[3,23,1],
  [3,8,2],[3,20,2],[3,21,2],
  [3,8,3],[3,12,3],[3,20,3],[3,21,3],[3,22,3],
  // Thursday
  [4,8,0],[4,9,0],[4,20,0],[4,21,0],[4,21,0],[4,22,0],[4,22,0],[4,23,0],
  [4,8,1],[4,20,1],[4,21,1],[4,22,1],
  [4,8,2],[4,9,2],[4,13,2],[4,20,2],[4,21,2],[4,22,2],
  [4,8,3],[4,20,3],[4,21,3],
  // Friday — biggest evening, stays up late
  [5,8,0],[5,9,0],[5,17,0],[5,19,0],[5,20,0],[5,21,0],[5,21,0],[5,22,0],[5,22,0],[5,23,0],[5,23,0],
  [5,8,1],[5,18,1],[5,20,1],[5,21,1],[5,22,1],[5,23,1],
  [5,8,2],[5,17,2],[5,20,2],[5,21,2],[5,22,2],[5,23,2],
  [5,8,3],[5,20,3],[5,21,3],[5,22,3],[5,23,3],
  // Saturday — afternoon and late evening
  [6,12,0],[6,13,0],[6,15,0],[6,19,0],[6,20,0],[6,21,0],[6,22,0],[6,23,0],
  [6,13,1],[6,15,1],[6,20,1],[6,21,1],[6,22,1],[6,23,1],
  [6,12,2],[6,14,2],[6,20,2],[6,21,2],[6,22,2],[6,23,2],
  [6,13,3],[6,15,3],[6,20,3],[6,21,3],[6,22,3],
];

export const MOCK_RECENTLY_PLAYED = {
  items: FIXED_PLAYS.map(([day, hour, weeksAgo], i) => {
    // Anchor each entry to the most recent occurrence of that day/hour
    const now = new Date();
    const currentDay = now.getDay();
    const daysBack = ((currentDay - day + 7) % 7) + weeksAgo * 7;
    const ts = new Date(now);
    ts.setDate(ts.getDate() - daysBack);
    ts.setHours(hour, (i * 7) % 60, 0, 0);
    return {
      track: { id: `r${i}`, name: `Track ${i}` },
      played_at: ts.toISOString(),
    };
  }),
};
