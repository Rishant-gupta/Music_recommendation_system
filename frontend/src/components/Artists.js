import React, { useState, useEffect, useRef } from 'react';
import './Artists.css'; // Import the updated CSS
import './Genre.css'; // Borrowing styles for grid layout and arrows
import mlApi, { getArtistData } from '../apiMl'; // Import ML API and new normalizer
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Artists({ setLibraryView, setCurrentPage }) {
  const [artistData, setArtistData] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // Fetch 15 artists dynamically
        const data = await getArtistData(25);
        setArtistData(data);
      } catch (err) {
        console.error("Failed to fetch artists", err);
      }
    };
    fetchArtists();
  }, []);

  const handleArtistClick = (artistName) => {
    setLibraryView({ type: 'artist', value: artistName });
    setCurrentPage('library');
  };

  const handleSeeAllClick = () => {
    // New view type to show all artists in the library
    setLibraryView({ type: 'artists_all' });
    setCurrentPage('library');
  };

  // Scroll functions
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
    <div className='artists'>
      <div className="grid-header">
        <div className='grid-name'><span>Artists</span></div>
        <div className="see-all" onClick={handleSeeAllClick}>See All</div>
      </div>

      <div className="grid-flex">
        <div className="arrow-icon" onClick={scrollLeft}>
          <ArrowBackIosIcon fontSize="large" color='primary' />
        </div>
        
        <div className="artist-grid-container" ref={scrollRef}>
          {artistData.length > 0 ? (
            artistData.map((artist) => (
              <div 
                className="artist-tile" 
                key={artist.name} 
                onClick={() => handleArtistClick(artist.name)}
              >
                <img src={artist.image} alt={artist.name} />
                <span>{artist.name}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#aaa', marginLeft: '20px' }}>Loading artists...</p>
          )}
        </div>
        
        <div className="arrow-icon" onClick={scrollRight}>
          <ArrowForwardIosIcon fontSize="large" color='primary' />
        </div>
      </div>
    </div>
  );
}