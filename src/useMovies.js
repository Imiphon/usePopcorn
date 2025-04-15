import { useState, useEffect } from "react";

export function useMovies(MOVIETITLE, callback) {
  const KEY = "37c126e4";

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  callback?.();  //   handleClosedMovie();

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await fetch(
            `https://www.omdbapi.com/?s=${MOVIETITLE}&apikey=${KEY}`,
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
     
      getMovies();

      return function () {
        controller.abort();
      };
    },
    [MOVIETITLE]
  );
  return { movies, isLoading, errorMessage, KEY };
}
