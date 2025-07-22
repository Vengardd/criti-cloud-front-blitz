import axios from 'axios';
import type {
  UserDTO,
  MediaDTO,
  RatingDTO,
  MovieDTO,
  GameDTO,
  SearchParams,
  MovieSearchParams,
  GameSearchParams,
  RatingSearchParams
} from '../types/api';

const API_BASE_URL = 'https://criti-cloud-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

// User API
export const userApi = {
  create: (user: UserDTO): Promise<UserDTO> =>
    api.post('/users', user).then(res => res.data),
  
  getById: (id: string): Promise<UserDTO> =>
    api.get(`/users/${id}`).then(res => res.data),
};

// Media API
export const mediaApi = {
  search: (params: SearchParams = {}): Promise<MediaDTO[]> =>
    api.get('/media', { params }).then(res => res.data),
  
  create: (media: MediaDTO): Promise<MediaDTO> =>
    api.post('/media', media).then(res => res.data),
  
  getById: (id: string): Promise<MediaDTO> =>
    api.get(`/media/${id}`).then(res => res.data),
};

// Movie API
export const movieApi = {
  search: (params: MovieSearchParams = {}): Promise<MovieDTO[]> =>
    api.get('/movies', { params }).then(res => res.data),
  
  create: (movie: MovieDTO): Promise<MovieDTO> =>
    api.post('/movies', movie).then(res => res.data),
  
  getById: (id: string): Promise<MovieDTO> =>
    api.get(`/movies/${id}`).then(res => res.data),
};

// Game API
export const gameApi = {
  search: (params: GameSearchParams = {}): Promise<GameDTO[]> =>
    api.get('/games', { params }).then(res => res.data),
  
  getById: (id: string): Promise<GameDTO> =>
    api.get(`/games/${id}`).then(res => res.data),
};

// Rating API
export const ratingApi = {
  search: (params: RatingSearchParams = {}): Promise<RatingDTO[]> =>
    api.get('/ratings', { params }).then(res => res.data),
  
  create: (rating: RatingDTO): Promise<RatingDTO> =>
    api.post('/ratings', rating).then(res => res.data),
  
  getById: (id: string): Promise<RatingDTO> =>
    api.get(`/ratings/${id}`).then(res => res.data),
};

// Test API
export const testApi = {
  test: (): Promise<string> =>
    api.get('/test').then(res => res.data),
};