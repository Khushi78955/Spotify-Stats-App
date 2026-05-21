import { Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth/SpotifyAuth';
import { useLenis } from './hooks/useLenis';
import Landing from './pages/Landing';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import TopTracks from './pages/TopTracks';
import TopArtists from './pages/TopArtists';
import Genres from './pages/Genres';
import Stats from './pages/Stats';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  useLenis();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracks"
          element={
            <ProtectedRoute>
              <PageTransition><TopTracks /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/artists"
          element={
            <ProtectedRoute>
              <PageTransition><TopArtists /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/genres"
          element={
            <ProtectedRoute>
              <PageTransition><Genres /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <PageTransition><Stats /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
