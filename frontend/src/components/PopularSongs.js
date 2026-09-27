import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './PopularSongs.css' 
import mlApi, { getSongData } from '../apiMl'; 

export default function PopularSongs({ 
  setIsAudioBarVisible, 
  setCurrentSong, 
  token,
  setLibraryView, 
  setCurrentPage 
}) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        
        const response = await mlApi.get('/popular?limit=20');
        const normalized = response.data.map(getSongData);
        setSongs(normalized);
      } 
      catch (err) {
        console.error("Failed to fetch popular songs", err);
      }
    };
    fetchPopular();
  }, []); 

  const handleSeeAllClick = () => {
    setLibraryView({ type: 'popular' });
    setCurrentPage('library');
  };

  return (
    <div className='popular-songs'>
        <div>
            <SongGrid 
              prop="Popular"
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
              songs={songs} 
              showSeeAll={true}
              onSeeAllClick={handleSeeAllClick} 
            />
        </div>
    </div>
  )
}