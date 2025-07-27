// API Types based on OpenAPI specification

export interface UserDTO {
  id?: string;
  nickname: string;
}

export interface MediaDTO {
  id?: string;
  name: string;
  posterUrl?: string;
  detailsType: 'MOVIE' | 'SERIES' | 'GAME';
  detailsId?: string;
  externalIdType?: 'IMBD_ID' | 'IGDB_ID';
  externalId?: string;
}

export interface RatingDTO {
  id?: string;
  user: UserDTO;
  media: MediaDTO;
  rating: number;
  source: 'APP';
}

export interface NewRatingRequestDTO {
  mediaId: string;
  rating: number;
  source: 'APP';
}

export interface MovieDTO {
  id?: string;
  title: string;
  year?: number;
  runtime?: number;
  director?: string;
  plot?: string;
  imbdId?: string;
  posterUrl?: string;
}

export interface GameDTO {
  id?: string;
  title: string;
  summary?: string;
  igdbId?: string;
  posterUrl?: string;
}

export type MediaType = 'MEDIA' | 'MOVIE' | 'GAME';

export interface SearchParams {
  type?: MediaType;
  external?: boolean;
  title?: string;
  page?: number;
  size?: number;
}

export interface MovieSearchParams {
  imbdId?: string;
  title?: string;
}

export interface GameSearchParams {
  title?: string;
  igdbId?: string;
}

export interface RatingSearchParams {
  userId?: string;
  mediaId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  nickname: string;
  email: string;
}