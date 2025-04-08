import { useEffect, useState } from "react";
import StarRating from "./StarRatings";

export default function MovieDetails({
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

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
function () {
    function callback(e) {
        //Escape is also click on Movie in MovieList
        if (e.code === "Escape") {
          onClosedMovie();
        } 
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
},
    [onClosedMovie]
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

            {poster !== "N/A" && <img src={poster} alt={`${title}`} />}
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
                  <span>{thisMovie.userRating} &nbsp;</span>
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
