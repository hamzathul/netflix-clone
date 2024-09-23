import React, { useEffect, useState } from 'react';
import './RowPost.css';
import axios from '../../axios';
import { imageUrl, API_KEY } from '../../Constants/Constants';
import YouTube from 'react-youtube';

function RowPost(props) {
  const [movies, setMovies] = useState([]);
  const [urlId, setUrlId] = useState('');

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
    // You can implement logic to add the movie to the user's watchlist here
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>
      <div className="posters">
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
      {urlId && <YouTube videoId={urlId.key} opts={opts} />}
    </div>
  );
}

export default RowPost;
