import React, { useEffect, useState, useRef } from 'react';
import './RowPost.css';
import axios from '../../axios';
import { imageUrl, API_KEY } from '../../Constants/Constants';
import YouTube from 'react-youtube';

function RowPost(props) {
  const [movies, setMovies] = useState([]);
  const [urlId, setUrlId] = useState('');
  const postersRef = useRef(null); // Use a reference for the posters container

  useEffect(() => {
    axios.get(props.url).then((response) => {
      console.log(response.data);
      setMovies(response.data.results);
    });
  }, [props.url]); // Added dependency array to prevent infinite requests

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  const handleMovie = (id) => {
    console.log(id);
    axios.get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`).then((response) => {
      if (response.data.results.length !== 0) {
        setUrlId(response.data.results[0]);
      } else {
        console.log('Array empty');
      }
    });
  };

  const handleAddToWatchlist = (movie) => {
    console.log("Added to Watchlist:", movie);
  };

  // Scroll handler function
  const scrollRow = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300;
    postersRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>

      {/* Left arrow */}
      <div className="arrow left" onClick={() => scrollRow('left')}>
        {/* Empty as it's handled in CSS */}
      </div>

      {/* Posters row */}
      <div className="posters" ref={postersRef}>
        {movies.map((obj) => (
          <div className="poster-container" key={obj.id}>
            <img
              onClick={() => handleMovie(obj.id)}
              className={props.isSmall ? 'smallPoster' : 'poster'}
              src={`${imageUrl + obj.backdrop_path}`}
              alt="poster"
            />
            <div className="overlay">
              <button className="button" onClick={() => handleMovie(obj.id)}>
                Play
              </button>
              <button className="button" onClick={() => handleAddToWatchlist(obj)}>
                Add to Watchlist
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <div className="arrow right" onClick={() => scrollRow('right')}>
        {/* Empty as it's handled in CSS */}
      </div>

      {urlId && <YouTube videoId={urlId.key} opts={opts} />}
    </div>
  );
}

export default RowPost;
