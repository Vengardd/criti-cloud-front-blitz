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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="all-media" element={<AllMediaPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="movie?imbdId=:externalId" element={<MovieDetailPage />} />
          <Route path="game/:id" element={<GameDetailPage />} />
          <Route path="media/:id" element={<MediaDetailPage />} />
          <Route path="ratings" element={<RatingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;