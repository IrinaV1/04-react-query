import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import { useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isError, setIsError] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const closeModal = () => {
    setSelectedMovie(null);
  };
  const handleMoviesSearch = async (query: string) => {
    try {
      setIsError(false);
      setMovies([]);
      setIsLoader(true);
      const data = await fetchMovies(query);

      if (data.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(data);
    } catch (error) {
      setIsError(true);
      console.log(error);
    } finally {
      setIsLoader(false);
    }
  };
  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleMoviesSearch} />
      {isLoader && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
