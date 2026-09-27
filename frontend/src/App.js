import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import AudioPlayer from './AudioPlayer';
import MainPageBody from './components/MainPageBody';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from './api'; 

const defaultSong = {
  id: "5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b", 
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86",
  album_name: "Dangerous Woman" 
};

// Helper function to decode JWT (no changes here)
function jwtDecode(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
}


function MainAppLayout({ 
  token, 
  username, 
  onLogout, 
  isAudioBarVisible, 
  setIsAudioBarVisible, 
  currentSong, 
  setCurrentSong,
  libraryView, 
  setLibraryView,
  likedSongsMap, 
  handleLikeToggle 
}) {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <div className="App">
      <TopHeader 
        isLoggedIn={token} 
        username={username} 
        onLogout={onLogout} 
        setCurrentSong={setCurrentSong}
        setIsAudioBarVisible={setIsAudioBarVisible}
        token={token} 
      />
      <div className="main-content">
        <SideNavbar 
          setCurrentPage={setCurrentPage} 
          setLibraryView={setLibraryView} 
        />
        <div className={`page-body ${currentPage === "library" ? "page-body-library" : "page-body-home"}`}>
          <MainPageBody
            currentPage={currentPage}
            setIsAudioBarVisible={setIsAudioBarVisible}
            setCurrentSong={setCurrentSong}
            token={token} 
            libraryView={libraryView} 
            setLibraryView={setLibraryView} 
            setCurrentPage={setCurrentPage}
            likedSongsMap={likedSongsMap} 
            handleLikeToggle={handleLikeToggle} 
            currentSong={currentSong} 
          />
        </div>
      </div>

      {isAudioBarVisible && (
        <div className="audio-bar">
          <div className="song-info">
            <img
              src={currentSong.image}
              alt="Song Poster"
            />
            <div className="song-details">
              {currentSong.name} <br />
              <span>{currentSong.artist}</span>
            </div>
            <div 
              className={`heart-icon-player ${likedSongsMap[currentSong.id] ? 'liked' : ''}`}
              onClick={() => handleLikeToggle(currentSong)}
            >
              {likedSongsMap[currentSong.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </div>
          </div>
          <div className="player-wrapper">
            <AudioPlayer songSrc={currentSong.src} />
          </div>
          <div className="audio-controls-right">
            <CloseIcon
              className="audio-close-btn"
              onClick={() => setIsAudioBarVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(null); 
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(true);
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const [libraryView, setLibraryView] = useState({ type: 'liked' });
  const [likedSongsMap, setLikedSongsMap] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiked = async () => {
      if (token) {
        try {
          const response = await api.get('/api/liked/');

          const songsFromDb = response.data;
          
          const likeMap = songsFromDb.reduce((acc, song) => {
    
            
            acc[song.songId || song.track_id] = true; 
            return acc;
          }, {});
          setLikedSongsMap(likeMap);
        } catch (err) {
          console.error("Failed to fetch liked songs status", err);
        }
      }
      
      else {
        setLikedSongsMap({});
      }
    };

    fetchLiked();

    if (token) {
        const decodedUser = jwtDecode(token);
        if (decodedUser) {
          setUsername(decodedUser.username); 
        }
      }
      
    else {
        setUsername(null);
      }
  }, [token]);


  const handleLikeToggle = async (song, e) => {
    if (e) e.stopPropagation();

    if (!token) {
      alert("Please log in to like songs");
      return;
    }

    if (!song || !song.id) {
      console.error("Song ID error while Liking", song);
      return;
    }

    const trackId = song.id;
    const isLiked = likedSongsMap[trackId];

    try {
      if (isLiked) {
        await api.delete(`/api/liked/${trackId}`);
      } 
      else {
        await api.post('/api/liked/add', { 
            songId: trackId,           
            title: song.name,          
            artist: song.artist, 
            album: song.album || song.album_name || '',   
            coverImage: song.image,    
            preview: song.src          
        });
      }
      
      setLikedSongsMap(prev => ({ ...prev, [trackId]: !isLiked }));

      if (libraryView.type === 'liked') {
        setLibraryView({ type: 'liked'});
      }
    } 
    catch (err) {
      console.error("Like error:", err.response ? err.response.data : err);
      alert("Failed to update liked songs.");
    }
  };


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    const decodedUser = jwtDecode(newToken);
    if (decodedUser) {
      setUsername(decodedUser.username);
    }
    navigate('/'); 
  };

  const handleLogout = () => {
    setToken(null); 
    setUsername(null);
    navigate('/'); 
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp onSignUpSuccess={handleLogin} />} />
      <Route 
        path="/*" 
        element={
          <MainAppLayout
            token={token}
            username={username}
            onLogout={handleLogout}
            isAudioBarVisible={isAudioBarVisible}
            setIsAudioBarVisible={setIsAudioBarVisible}
            currentSong={currentSong} 
            setCurrentSong={setCurrentSong}
            libraryView={libraryView} 
            setLibraryView={setLibraryView} 
            likedSongsMap={likedSongsMap} 
            handleLikeToggle={handleLikeToggle} 
          />
        } 
      />
    </Routes>
  );
}

export default App;