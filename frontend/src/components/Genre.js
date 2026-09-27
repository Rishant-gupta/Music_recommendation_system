import React, { useRef } from 'react';
import './Genre.css';
import mlApi from '../apiMl'; 
import { useEffect, useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Genre({ setLibraryView, setCurrentPage }) {
  const [genres, setGenres] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await mlApi.get('/genres');
        setGenres(response.data); 
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreClick = (genreName) => {
    setLibraryView({ type: 'genre', value: genreName });
    setCurrentPage('library');
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className='genre' id="genre-section">
      <div className="grid-header">
        <div className='grid-name'><span>Genre <AlbumIcon /></span></div>
      </div>
      
      <div className="grid-flex">
        <div className="arrow-icon" onClick={scrollLeft}>
          <ArrowBackIosIcon fontSize="large" color='primary' />
        </div>

        <div className="genre-grid-container" ref={scrollRef}>
          {genres.length > 0 ? (
            genres.map((genreName) => (
              <div 
                className="genre-tile" 
                key={genreName}
                onClick={() => handleGenreClick(genreName)}
              >
                {genreName}
              </div>
            ))
          ) : (
            <p style={{ color: '#aaa', marginLeft: '20px' }}>Loading genres...</p>
          )}
        </div>

        <div className="arrow-icon" onClick={scrollRight}>
          <ArrowForwardIosIcon fontSize="large" color='primary' />
        </div>
      </div>
    </div>
  );
}