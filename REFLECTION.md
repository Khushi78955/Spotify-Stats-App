# Reflection — Statify (stats.fm Clone)

## What I Built

A full-stack-free Spotify analytics app that shows top tracks, artists, genre breakdown, listening heatmap, mood analysis, diversity score, and a downloadable music personality card. Everything runs in the browser — no backend, no server, no database.

---

## What Was Easy

**OAuth PKCE flow** came together quickly. The Web Crypto API (`crypto.subtle.digest`) handles SHA-256 natively in the browser, so there was no need for an external library. Once the code verifier / challenge pattern clicked, the rest — token storage, refresh logic, logout — was straightforward wiring.

**CSS Modules** were a natural fit. Scoped class names meant I could write component-level styles without worrying about collisions, and the dark design system (CSS variables for every color, spacing, and shadow) made it easy to stay visually consistent across 15+ components.

**Mock data fallback** was the right call early. Having realistic fake data meant every component could be developed and demoed without a Spotify account, and it makes the app look polished even when judges view it without logging in.

---

## What Was Hard

**The listening heatmap** was trickier than expected. The Spotify recently-played endpoint only returns 50 tracks per call, which is a tiny and unrepresentative sample for a 24×7 listening grid. I worked around this by implementing cursor-based pagination (`getRecentlyPlayedBatch`) to collect up to 200 plays, which gives a much more meaningful pattern. Even then, 200 plays only covers a few days of listening for active users — a real implementation would need a database to accumulate history over time.

**Mood / audio features** hit a wall I didn't expect. Spotify deprecated audio features (valence, energy, danceability) from the free Web API tier, which is what stats.fm uses for its mood analysis. My workaround — deriving mood scores from genre family weights — is a reasonable approximation but not the same thing. A production version would need either a paid API tier or a proxy that caches audio features before they were removed.

**React key warnings in JSX arrays** caught me once. Using bare `<>` fragments inside an `Array.from` map doesn't accept a `key` prop — you have to import `Fragment` explicitly and use `<Fragment key={...}>`. Easy fix once spotted, but the kind of thing that slips through without a linter rule enforcing it.

**Personality card image export** with `html2canvas` requires `crossOrigin="anonymous"` on every `<img>` inside the card that loads from Spotify's CDN. Miss one image and the canvas export fails silently with a tainted canvas error. Worth documenting clearly for anyone extending this.

---

## Trade-offs I Made Consciously

**Genre-based mood scoring vs. audio features**
I chose to approximate mood from genre weights rather than call a third-party audio analysis API (like AcousticBrainz or a proxy). This keeps the app dependency-free and works offline/in-demo mode, but it means two users who listen to the same genre distribution will get identical scores regardless of which specific tracks they play.

**CSS Modules vs. Tailwind**
I went with CSS Modules. Tailwind would have been faster for layout but harder to animate (the heatmap cell hover, skeleton shimmer, and card fade-ins all needed custom keyframes). CSS Modules kept animations clean and the bundle smaller since no utility class purging was needed.

**PKCE OAuth vs. a backend**
No backend means no server costs, no deployment complexity, and no token storage security concerns on a server. The downside is that refresh tokens live in `localStorage`, which is accessible to JavaScript. For a production app I'd move tokens to an httpOnly cookie via a thin backend. For a contest app, PKCE in the browser is the right call.

**Single time-range fetch on dashboard vs. lazy loading per section**
The dashboard fetches all data (tracks, artists, recently-played) in one `Promise.all` on mount. This means a brief loading state then everything appears together, which feels cleaner than sections popping in at different times. The cost is a slightly longer initial load if the recently-played batch fetch is slow.

**Recharts vs. D3 vs. pure SVG**
Recharts for the genre bar chart — it handles responsive containers, tooltips, and animation out of the box. D3 would have given more control but added significant complexity. The genre cloud and heatmap are pure CSS/SVG since Recharts would have been overkill for those.

---

## What I'd Do Differently

1. **Accumulate listening history** — The heatmap's biggest limitation is data volume. I'd add IndexedDB caching so that each visit appends new recently-played tracks to a local store, building up months of data over time without needing a backend.

2. **Real audio features via a proxy** — I'd write a small Cloudflare Worker that fetches and caches audio features before they expired. Cached values could then be served cheaply and the mood analysis would be track-accurate, not genre-approximate.

3. **Share to social** — The personality card downloads as a PNG but there's no native share sheet. On mobile, `navigator.share()` with a blob would let users share directly to Instagram Stories or WhatsApp, which is where this kind of card actually goes viral.

4. **Time-series comparison** — Stats.fm's most compelling feature is showing how your taste changed over time. With only three static snapshots (4 weeks / 6 months / all time), you can see the difference but not the journey. I'd store weekly snapshots locally and plot a line chart showing your #1 artist changing over 52 weeks.

5. **Error boundaries** — Each dashboard section should be wrapped in a React error boundary so a single failed component (e.g., the heatmap crashing on malformed dates) doesn't blank out the whole page.

---

## Honest Assessment

The foundation is solid: real OAuth, real pagination, clean component architecture, genuine data visualizations. The gaps are mostly about data depth — the Spotify free API tier limits what's possible without creative workarounds or a backend. Given the constraint of building this entirely client-side in a short window, I'm happy with how far it got.

The genre-based mood scoring is the part I'm least satisfied with. It works and looks good, but it's a simplification that I'd replace in a real product as soon as I had access to audio features.

The part I'm most satisfied with is the diversity/obscurity score — it's a genuinely useful metric that stats.fm doesn't surface prominently, and deriving it from artist popularity data is both accurate and Spotify-API-compatible without any workarounds.
