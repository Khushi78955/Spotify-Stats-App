# Statify — Your Music DNA

A Spotify stats web app (stats.fm clone) built with React + Vite. See your top tracks, artists, genre breakdown, listening heatmap, mood analysis, and download a shareable music personality card.

## Setup

### 1. Create a Spotify App

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set the **Redirect URI** to `http://localhost:5173/callback`
4. Copy your **Client ID**

### 2. Configure Environment

Create `.env.local` in the project root:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/callback
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **Connect with Spotify**.

## Features

- **OAuth PKCE** — Secure login without a backend server
- **Top Tracks & Artists** — Ranked lists for 4 weeks / 6 months / all time
- **Genre Cloud** — Interactive tag cloud from your artists' genres
- **Listening Heatmap** — GitHub-style grid showing when you listen most
- **Mood Analysis** — Energy, happiness and danceability scores
- **Personality Card** — Download a shareable PNG card with your music type

## Tech Stack

- React 18 + Vite
- React Router DOM
- CSS Modules
- html2canvas (card export)
- Spotify Web API (PKCE OAuth)

## Project Structure

```
src/
├── auth/          # Spotify PKCE OAuth
├── api/           # Spotify API calls + mock data
├── pages/         # Landing, Dashboard, TopTracks, TopArtists, Callback
├── components/    # All UI components
└── utils/         # Genre, mood, export helpers
```
