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

export const MOCK_RECENTLY_PLAYED = {
  items: Array.from({ length: 50 }, (_, i) => ({
    track: { id: `r${i}`, name: `Track ${i}` },
    played_at: new Date(Date.now() - i * 3600000 * Math.random() * 6).toISOString(),
  })),
};
