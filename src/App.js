import { useEffect, useState } from "react";
import Nav, { Logo, Search, FoundResult } from "./Nav";
import Main, { Box } from "./Main";
import { MovieList } from "./MovieBoxChilds";
import { Summary, WatchedMovieList } from "./WatchBoxChilds";
import MovieDetails from "./MovieDetails";
import { useMovies } from "./useMovies";

export default function App() {
  const [watched, setWatched] = useState(
    () => JSON.parse(localStorage.getItem("watched")) || []
  );

  const [query, setQuery] = useState(""); //movie title in search
  const MOVIETITLE = query || "123"; //temp query or else
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedMovieID((selectID) => (selectID === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedMovieID(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleClearMovie(id) {
    setWatched((prevWatched) =>
      prevWatched.filter((film) => film.imdbID !== id)
    );
  }
  //useMovies is custom hook
  const { isLoading, errorMessage, movies, KEY } = useMovies(MOVIETITLE);

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <Nav>
        <Logo />
        <>
          {/* functiondeclaration like handleCloseMovie are hoisted in react */}
          <Search
            query={query}
            setQuery={setQuery}
            onCloseMovie={handleCloseMovie}
          />
          <FoundResult movies={movies} />
        </>
      </Nav>

      <Main>
        <Box>
          {!errorMessage && isLoading && <Loader />}
          {!errorMessage && !isLoading && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {errorMessage && <ErrorLoading message={errorMessage} />}
        </Box>
        <Box>
          {selectedMovieID ? (
            <MovieDetails
              selectedMovieID={selectedMovieID}
              onClosedMovie={handleCloseMovie}
              KEY={KEY}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onClearMovie={handleClearMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">...loading</p>;
}

function ErrorLoading({ message }) {
  return (
    <>
      <p className="error">
        <span>⛔️ </span>
        {message}
      </p>
    </>
  );
}
