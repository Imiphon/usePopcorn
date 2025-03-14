import { useState } from "react";
import { tempMovieData, tempWatchedData } from "./template-films";
import Nav, { Logo, Search, FoundResult } from "./Nav";
import Main, { MovieBox, WatchBox, MovieList } from "./Main";

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);

  return (
    <>
      <Nav>
        <Logo />
        <Search />
        <FoundResult movies={movies} />
      </Nav>
      <Main>
        <MovieBox>
          <MovieList movies={movies} />
        </MovieBox>
        <WatchBox movies={movies} />
      </Main>
    </>
  );
}
