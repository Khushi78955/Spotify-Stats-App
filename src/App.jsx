import { Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth/SpotifyAuth';
import Landing from './pages/Landing';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import TopTracks from './pages/TopTracks';
import TopArtists from './pages/TopArtists';
import Genres from './pages/Genres';
import Stats from './pages/Stats';

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/callback" element={<Callback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tracks"
        element={
          <ProtectedRoute>
            <TopTracks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artists"
        element={
          <ProtectedRoute>
            <TopArtists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/genres"
        element={
          <ProtectedRoute>
            <Genres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
