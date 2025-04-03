import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "./template-films";
import Nav, { Logo, Search, FoundResult } from "./Nav";
import Main, { Box } from "./Main";
import { MovieList } from "./MovieBoxChilds";
import { Summary, WatchedMovieList, MovieDetails } from "./WatchBoxChilds";

const KEY = "37c126e4";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState(""); //movie title in search
  const MOVIETITLE = query || "123"; //temp query or else
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedMovieID((selectID) => (selectID ? null : id));
  }
  function handleClosedMovie(id) {
    setSelectedMovieID(null);
  }

  useEffect(
    function () {
      async function getMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await fetch(
            `http://www.omdbapi.com/?s=${MOVIETITLE}&apikey=${KEY}`
          );
          if (!res) throw new Error("Response does not work.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found.");
          setMovies(data.Search);
        } catch (error) {
          console.error(error.message);
          setErrorMessage(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (MOVIETITLE.length < 3) {
        setMovies([]);
        setErrorMessage("more info");
        return;
      }

      getMovies();
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
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// function MovieDetails({ selectedMovieID, onClosedMovie }) {
//   const [movie, setMovie] = useState({});
//   const {
//     Title: title,
//     Year: year,
//     Poster: poster,
//     Runtime: runtime,
//     imdbRatimg,
//     Plot: plot,
//     Released: released,
//     Actors: actors,
//     Director: director,
//     Genre: genre,
//   } = movie;
//   console.log(year, title);
  

//   useEffect(function () {
//     async function getMovieDetails() {
//       const res = await fetch(
//         `http://www.omdbapi.com/?i=${selectedMovieID}&apikey=${KEY}`
//       );
//       const data = await res.json();
//       setMovie(data);
//     }
//     getMovieDetails();
//   }, []);

//   return (
//     <div className="details">
//       <header>
//       <button className="btn-back" onClick={onClosedMovie}>
//         {" "}
//         &larr;
//       </button>
//       <img src={poster} alt={`Poster of ${title}`}/>
//       <div className="details-overview">
//         <h2>{title}</h2>
//         <p>{released} &bull; {runtime}</p>
//         <p>{genre}</p>
//         <p><span>⭐️</span>
//         {imdbRatimg} IMDb Rating</p>
//         </div> 
//       </header>
//       <section>
//         <p><em>{plot}</em></p>
//         <p>Starring {actors}</p>
//         <p>Directed by {director}</p>
//       </section>
//     </div>
//   );
// }

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
