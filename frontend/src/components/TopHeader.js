import './TopHeader.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from "./ProfileMenu";
import React, { useState, useEffect, useCallback } from 'react';
import mlApi, { getSongData } from '../apiMl'; 
import { debounce } from 'lodash'; 
import audientlogo from './assets/audientlogo.png'

export default function TopHeader({ 
  isLoggedIn, 
  username, 
  onLogout, 
  setCurrentSong, 
  setIsAudioBarVisible,
  token
}) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const fetchSearch = useCallback(
    debounce(async (search) => {
      if (search.trim() !== '') {
        try {
          const response = await mlApi.get('/search', {
            params: { query: search }
          });
          const normalizedResults = response.data.map(getSongData);
          setSearchResults(normalizedResults);
        }
        catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      }
      
      else {
        setSearchResults([]);
      }
    }, 300), []
  );

  useEffect(() => {
    fetchSearch(search);
  }, [search, fetchSearch]);

  const handleSongClick = (song) => {
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    
    setCurrentSong(song);
    setIsAudioBarVisible(true);
    // setSearch('');
    // setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <div className="top-header">
      <div className="header-left">
        <img src={audientlogo} alt='app-logo-image'/>
      </div>

      <div className="header-center">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for songs, artists..."
            className="search-input"
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
            value={search}
          />
          <div className="search-lens">
            <SearchIcon fontSize="large" />
          </div>

          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map(song => (
                  <li key={song.id} onMouseDown={() => handleSongClick(song)}>
                    {song.name} - <span>{song.artist}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <>
            <span className="header-username">Welcome {username}</span>
            <ProfileMenu isLoggedIn={isLoggedIn} onLogout={onLogout} />
          </>
        ) : (
          <>
            <button className="header-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="header-btn" onClick={() => navigate('/signup')}>Signup</button>
          </>
        )}
      </div>
    </div>
  );
}