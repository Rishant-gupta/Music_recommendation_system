import React, { useRef } from 'react';
import './SongGrid.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

export default function SongGrid({ 
  prop, 
  setIsAudioBarVisible, 
  showSeeAll = true, 
  setCurrentSong, 
  token, 
  songs = [],
  onSeeAllClick 
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

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

  
  const handleRecentApiCall = async (song) => {
    if (token) {
      try {

        await api.post('/api/recent/add', { 
          songId: song.id,    
          title: song.name,      
          artist: song.artist,       
          album: song.album_name || '', 
          coverImage: song.image,  
          preview: song.src        
        });
      } catch (err) {
        console.warn(
          "Note: 'Add to Recent' API failed.",
          err.response?.data?.message || err.message
        );
      }
    }
  };

  const handleTileClick = (song) => {
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    handleRecentApiCall(song); 
  };

  const handleSeeAll = onSeeAllClick ? onSeeAllClick : () => {
     navigate(`/library/${prop}`);
  };

  return (
    <>
      <div className="grid-header">
        <div className='grid-name'><span>{prop}</span></div>
        {showSeeAll && (
          <div className="see-all" onClick={handleSeeAll}>See All</div>
        )}
      </div>

      <div className="grid-flex">
        <div className="arrow-icon" onClick={scrollLeft}><ArrowBackIosIcon fontSize="large" color='primary' /></div>
        
        <div className="song-grid" ref={scrollRef}>
          {songs.length > 0 ? (
            songs.map((song) => (
              <div className="song-tile" key={song.id} onClick={() => handleTileClick(song)}>
                <img src={song.image} alt={song.name} />
                <div>{song.name}</div>
                <span>{song.artist}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#aaa', marginLeft: '20px' }}>Loading songs...</p>
          )}
        </div>
        
        <div className="arrow-icon" onClick={scrollRight}><ArrowForwardIosIcon fontSize="large" color='primary' /></div>
      </div>
    </>
  );
}