import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import { useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isLoader, setIsLoader] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.trim() !== '',
    placeholderData: keepPreviousData,
  });
  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const closeModal = () => {
    setSelectedMovie(null);
  };
  const handleMoviesSearch = async (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setPage(0);
  };
  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleMoviesSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {error && <ErrorMessage />}
      {isSuccess && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
              pageCount={data.total_pages}
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
