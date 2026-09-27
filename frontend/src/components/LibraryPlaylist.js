import React from 'react';
import './LibraryPlaylist.css'; 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


const LibraryPlaylist = ({ 
  title, 
  songs, 
  isLoading, 
  handleSongClick, 
  likedSongsMap, 
  handleLikeToggle,
  customEmptyMessage 
}) => {

  if (isLoading) {
    return (
      <div className='playlist'>
        <div className='playlist-head'>{title}</div>
        <div className='playlist-content'>
          <p style={{padding: '20px', color: '#aaa'}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='playlist'>
      <div className='playlist-head'>{title}</div>
      <div className='playlist-content'>
        {songs.length > 0 ? songs.map((song) => (
          <div className="song-row" key={song.id} onClick={() => handleSongClick(song)}>
            <img src={song.image} alt="Song_poster" />
            <div>{song.name} <span>{song.artist}</span></div>
            
            <div 
              className={`heart-icon ${likedSongsMap[song.id] ? 'liked' : ''}`} 
              onClick={(e) => handleLikeToggle(song, e)}
            >
              {likedSongsMap[song.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </div>
          </div>
        )) : (
          <p style={{padding: '20px', color: '#aaa'}}>
            {customEmptyMessage || 'No songs found.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default LibraryPlaylist;