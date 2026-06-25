import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}
const myKey = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesHttpResponse> {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        page: page + 1,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );
  // console.log(response.data);

  return response.data;
}
