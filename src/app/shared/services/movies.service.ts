import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { IMovie } from '../interfaces/imovie';
import { getToken } from '../functions';

@Injectable()
export class MoviesService {
  private readonly API_URL = API_URL;

  constructor(private readonly http: HttpClient) {}

  getMoviesGroupedCategories() {
    return this.http.get(`${this.API_URL}/movies`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  getMoviesByCategory(category: string) {
    return this.http.get(`${this.API_URL}/movie/category/${category}`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  createEmptyWatchlist(profileId: string) {
    return this.http.post(`${this.API_URL}/create-watchlist/`, { profileId }, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  addMovieToWatchlist(profileId: string, movie: IMovie) {
    return this.http.post(`${this.API_URL}/add-movie-watchlist?profileId="${profileId}"`, movie, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  findWatchlistByProfileId(profileId: string) {
    return this.http.get(`${this.API_URL}/find-watchlist?profileId="${profileId}"`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  markMovieAsWatched(body: {
    profileId: string;
    movieId: string;
    alreadyWatched: boolean;
  }) {
    return this.http.put(`${this.API_URL}/mark-movie-as-watched`, body, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  searchMovieByTerm(term: string) {
    return this.http.get(`${this.API_URL}/search-movie?term="${term}"`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }
}
