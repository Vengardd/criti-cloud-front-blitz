import { UserDTO, MediaDTO } from './api';
/**
 * Request bodies for API calls
 */

export interface NewRatingRequest {
  userId: string;
  mediaId: string;
  rating: number;
  source: 'APP';
}
export interface NewRatingRequest {
  userId: string;
  mediaId: string;
  rating: number;
  source: 'APP';
}
