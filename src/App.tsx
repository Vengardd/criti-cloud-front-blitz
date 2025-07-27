import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AllMediaPage } from './pages/AllMediaPage';
import { MoviesPage } from './pages/MoviesPage';
import { GamesPage } from './pages/GamesPage';
import { MediaPage } from './pages/MediaPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { MediaDetailPage } from './pages/MediaDetailPage';
import { RatingsPage } from './pages/RatingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="all-media" element={<AllMediaPage />} />
            <Route path="movies" element={<MoviesPage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="movie/:id" element={<MovieDetailPage />} />
            <Route path="movie?imbdId=:externalId" element={<MovieDetailPage />} />
            <Route path="games/:id" element={<GameDetailPage />} />
            <Route path="media/:id" element={<MediaDetailPage />} />

            {/* Auth routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="ratings" element={
              <ProtectedRoute>
                <RatingsPage />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;