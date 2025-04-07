export function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie}) {
  const hasPoster = movie.Poster !== "N/A";
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      {hasPoster ? (
        <img src={movie.Poster} alt={`${movie.Title}`} />
      ) : (
        <div style={{ gridRow: "1 / -1", margin: "auto" }}>🍿</div>
      )}
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
