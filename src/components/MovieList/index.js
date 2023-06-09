import { APIKey } from '../../config/key'
import { useState, useEffect, useRef } from 'react'

import MovieCardLogged from '../MovieCard/indexLogged'
import MovieCardUnlogged from '../MovieCard/indexUnlogged'

import useAuth from '../../hooks/useAuth'

import { MovieListContainer, ListContainer, NextPageButton } from './style.js'



const MovieList = props => {
  
  const { isLogged } = useAuth()
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const previousFilter = useRef('')

  // Raises the page number for the fetch
  const handlePage = () => {
    setPage(Number(page)+1)
    
    window.scrollTo({
      top: 0
    })
  }

  // Is called everytime the page is reloaded and when the page or the filter gets modified
  useEffect(() => {
    // Reset the Movies array
    setMovies([])

    // Verifies if the filter was modified to reset the page
    if (props.filter !== previousFilter.current) {
      setPage('1')
    }

    // Does the fetch in cases when the filter is not 'latest'
    fetch(`https://api.themoviedb.org/3/movie/${props.filter}?api_key=${APIKey}&language=en-US&page=${page}`)
      .then(response => response.json())
      .then(data => setMovies(data.results))

    previousFilter.current = props.filter;

  }, [props.filter, page])

  return (
    <MovieListContainer>
      <ListContainer>
        {
          isLogged && 
            movies.map(movie => 
              <MovieCardLogged key={movie.id} movie={movie}/>
            )
        }
        {
          !isLogged && 
            movies.map(movie => 
              <MovieCardUnlogged key={movie.id} movie={movie}/>
            )
        }
      </ListContainer>

      <NextPageButton onClick={handlePage}>
        --- Mais filmes ---
      </NextPageButton>
    </MovieListContainer>
  )
}

export default MovieList