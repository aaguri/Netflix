import React, { useEffect, useState } from "react";
import axios from './axios';
import './Row.css';
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = 'https://image.tmdb.org/t/p/original/'

function Row({ title, fetchUrl,isLargeRow}) {

   

    const [movies, setMovies] = useState([]);
    const [trailerUrl,setTrailerUrl] = useState("")

    //snippet of code which runs based on a specific condition/variable

    useEffect(() => {
        //if [], run once when the row loads, and dont run again.
        //if we are using any variable which we are getting from outside then we have to mention that in [] in our case it is fetchUrl.
        //Everytime our fetchUrl changes we want to run the useEffect.
        //inside of useEffect if we want async to use to fetch then we have have async function.
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    // console.log(movies);

    const opts ={
        height:"390",
        weight:"100%",
        playerVars:{
            //https://developers.google.com/youtube/player_parameters
            autoplay:1,
        }
    }

    const handleClick = (movie) =>{
        if(trailerUrl){
            setTrailerUrl("")
        } else{
            movieTrailer(movie?.name)
            .then((url) => {
                console.log("Trailer URL:", url); 
                const urlParams= new URLSearchParams(new URL(url).search);
               setTrailerUrl(urlParams.get("v")) ;

            }).catch((error)=>console.log(error));
        }
    };


      
      

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {movies.map(movie => (
                    <img key={movie.id}  onClick={()=>handleClick(movie)} className={`row_poster ${isLargeRow&& "row_posterLarge"}`} src={`${base_url}${isLargeRow?movie.poster_path:movie.backdrop_path}`} alt={movie.name} />
            ))}
            </div>
          {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row;