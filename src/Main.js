// import { useState } from "react";
// import { tempMovieData, tempWatchedData } from "./template-films";
import MovieBox from "./MovieBox";
import WatchBox from "./WatchBox";



export default function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  );
}
