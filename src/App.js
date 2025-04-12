import { useEffect, useState } from "react";
// import { tempMovieData, tempWatchedData } from "./template-films";
import Nav, { Logo, Search, FoundResult } from "./Nav";
import Main, { Box } from "./Main";
import { MovieList } from "./MovieBoxChilds";
import { Summary, WatchedMovieList } from "./WatchBoxChilds";
import MovieDetails from "./MovieDetails";

const KEY = "37c126e4";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem('watched');
    return JSON.parse(storedValue);
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState(""); //movie title in search
  const MOVIETITLE = query || "123"; //temp query or else
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedMovieID((selectID) => (selectID === id ? null : id));
  }

  function handleClosedMovie(id) {
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

  useEffect(function () {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched]);

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await fetch(
            `http://www.omdbapi.com/?s=${MOVIETITLE}&apikey=${KEY}`,
            { signal: controller.signal }
          );
          if (!res) throw new Error("Response does not work.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found.");
          setMovies(data.Search);
          setErrorMessage("");
        } catch (error) {
          if (error.name !== "AbortError") setErrorMessage(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (MOVIETITLE.length < 3) {
        setMovies([]);
        setErrorMessage("more info");
        return;
      }
      handleClosedMovie();
      getMovies();

      return function () {
        controller.abort();
      };
    },
    [MOVIETITLE]
  );

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <FoundResult movies={movies} />
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
              onClosedMovie={handleClosedMovie}
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
