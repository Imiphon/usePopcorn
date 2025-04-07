import { useEffect, useState } from "react";
import StarRating from "./StarRatings";

export function Summary({ watched }) {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMovieList({ watched, onClearMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          watched={watched}
          onClearMovie={onClearMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onClearMovie }) {
  const hasPoster = movie.poster !== "N/A";
  return (
    <li key={movie.imdbID}>
      {hasPoster ? (
        <img src={movie.poster} alt={`${movie.title}`} />
      ) : (
        <div style={{ gridRow: "1 / -1", margin: "auto" }}>🍿</div>
      )}
      <h3>{movie.title}</h3>
      <button className="btn-delete" onClick={() => onClearMovie(movie.imdbID)}>
        <span>X</span>
      </button>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

export function MovieDetails({
  selectedMovieID,
  onClosedMovie,
  KEY,
  onAddWatched,
  watched,
  onClearMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((e) => e.imdbID).includes(selectedMovieID);
  const thisMovie = watched.find((film) => film.imdbID === selectedMovieID);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd(movie) {
    const newWatchedMovie = {
      imdbID: selectedMovieID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating: userRating,
      runtime: parseInt(runtime, 10),
    };
    onAddWatched(newWatchedMovie);
    onClosedMovie(movie);
  }

  useEffect(
    function () {
      setIsDetailLoading(true);
      async function getMovieDetails() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?i=${selectedMovieID}&apikey=${KEY}`
          );
          const data = await res.json();
          setMovie(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsDetailLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedMovieID, KEY]
  );

  return (
    <div className="details">
      {isDetailLoading ? (
        <p className="loader">...loading</p>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClosedMovie}>
              {" "}
              &larr;
            </button>

            {poster !== "N/A" && (
              <img src={movie.poster} alt={`${movie.title}`} />
            )}
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    defaultRating={userRating}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You still rated this movie with{" "}
                  <span>{thisMovie.userRating} </span>
                  <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
            <p>in {year}</p>
          </section>
        </>
      )}
    </div>
  );
}
