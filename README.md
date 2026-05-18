# Statify — Your Music DNA

A Spotify stats web app (stats.fm clone) built with React + Vite. Connects to Spotify via OAuth and shows your top tracks, artists, genre breakdown, 24-hour listening heatmap, mood scores, diversity/obscurity rating, and a downloadable music personality card.

No backend required — everything runs in the browser using PKCE OAuth.

---

## Setup (5 minutes)

### 1. Create a Spotify App

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and log in
2. Click **Create app**
3. Fill in any name and description
4. Under **Redirect URIs**, add exactly: `http://localhost:5173/callback`
   - This must match exactly — no trailing slash, no HTTPS
5. Set **APIs used** to: Web API
6. Save, then open the app settings and copy the **Client ID**

### 2. Configure the environment file

Create a file called `.env.local` in the project root (next to `package.json`):

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/callback
```

> `.env.local` is already in `.gitignore` — your Client ID will not be committed.

### 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **Connect with Spotify**.

### Scopes requested

The app requests these Spotify permission scopes on login:

| Scope | Why it's needed |
|---|---|
| `user-top-read` | Fetch your top tracks and artists |
| `user-read-recently-played` | Build the listening heatmap |
| `user-read-private` | Read your display name and account info |
| `user-read-email` | Show your profile in the navbar |

No write permissions are requested. The app cannot modify your library, playlists, or playback.

### Demo mode

If you run the app without a valid Client ID, it automatically falls back to realistic sample data so every feature is still visible. You'll see a **DEMO MODE** badge at the top of the dashboard.

---

## Features

| Feature | Description |
|---|---|
| **OAuth PKCE** | Secure login with no backend — tokens stored in localStorage, auto-refreshed |
| **Top Tracks** | Ranked list of up to 50 tracks across 4 weeks / 6 months / all time |
| **Top Artists** | Ranked list of up to 50 artists with genre tags and follower counts |
| **Genre Breakdown** | Bar chart showing top 8 genres with percentages + interactive tag cloud |
| **Listening Heatmap** | 24×7 grid (hour × day) built from up to 200 recent plays |
| **Mood Analysis** | Energy, happiness, danceability circles derived from genre family weights |
| **Diversity Score** | Obscurity + genre breadth score (0–100) with your rarest listens |
| **Personality Card** | Downloadable PNG card with your music type, top artist/track, and mood |
| **Mobile Share** | Native share sheet on mobile via `navigator.share()` for the personality card |

---

## Tech Stack

- **React 18 + Vite** — build tooling and component framework
- **React Router DOM** — client-side routing with protected routes
- **CSS Modules** — scoped styles, no utility framework
- **Recharts** — genre breakdown bar chart
  > Note: Recharts adds ~300KB to the bundle. This could be reduced with `React.lazy()` and dynamic imports if bundle size becomes a concern.
- **html2canvas** — renders the personality card to a PNG for download/share
- **Spotify Web API** — all data via PKCE OAuth, no backend proxy

---

## Project Structure

```
src/
├── auth/
│   ├── SpotifyAuth.js     # PKCE flow: auth URL, token exchange, refresh, logout
│   └── useAuth.js         # Auth state hook
├── api/
│   ├── spotify.js         # All API calls (getUserProfile, getTopTracks, etc.)
│   └── mockData.js        # Realistic fallback data for demo mode
├── hooks/
│   └── useTimeRange.js    # Persists time range selection to localStorage
├── pages/
│   ├── Landing.jsx        # Hero page with login button
│   ├── Callback.jsx       # OAuth redirect handler
│   ├── Dashboard.jsx      # Main stats overview
│   ├── TopTracks.jsx      # Full ranked track list
│   └── TopArtists.jsx     # Full ranked artist list
├── components/
│   ├── Navbar.jsx         # Fixed nav with mobile hamburger menu
│   ├── ErrorBoundary.jsx  # Per-card error isolation with Retry button
│   ├── GenreChart.jsx     # Recharts horizontal bar chart
│   ├── GenreCloud.jsx     # Animated tag cloud sized by frequency
│   ├── ListeningHeatmap.jsx  # 24×7 hour/day grid
│   ├── MoodScore.jsx      # SVG circular progress bars
│   ├── DiversityScore.jsx # Obscurity + genre breadth score
│   └── PersonalityCard.jsx   # Shareable card with download + native share
└── utils/
    ├── genreUtils.js      # Genre family classification and color mapping
    ├── moodUtils.js       # Mood scoring + diversity score calculation
    └── exportUtils.js     # html2canvas download + navigator.share()
```

---

## Common Issues

**"INVALID_CLIENT: Invalid redirect URI"**  
The redirect URI in `.env.local` must exactly match what you entered in the Spotify dashboard — including protocol, port, and path. No trailing slash.

**Personality card export is blank or shows CORS error**  
All `<img>` tags inside the card use `crossOrigin="anonymous"`. If you're testing locally over `file://` instead of `http://localhost`, CORS will block the canvas export.

**Heatmap shows very few dots**  
The heatmap is built from recently played tracks. If your account is new or you haven't streamed much recently, the grid will be sparse. The app collects up to 200 plays via cursor pagination.
