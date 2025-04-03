import { useState } from "react";
import { tempMovieData, tempWatchedData } from "./template-films";
import Nav, { Logo, Search, FoundResult } from "./Nav";
import Main, { Box } from "./Main";
import { MovieList } from "./MovieBoxChilds";
import { Summary, WatchedMovieList } from "./WatchBoxChilds";

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <>
      <Nav>
        <Logo />
        <Search />
        <FoundResult movies={movies} />
      </Nav>

      <Main>
        <Box>
          <MovieList movies={movies} />
        </Box>
        <Box>
          <Summary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
