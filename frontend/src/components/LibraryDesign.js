import React, { useState, useEffect } from 'react';
import './LibraryDesign.css'; 
import LibraryPlaylist from './LibraryPlaylist'; 
import LibraryGridMenu from './LibraryGridMenu'; 
import api from '../api'; 
import mlApi, { getSongData, getArtistData } from '../apiMl'; 

export default function LibraryDesign({ 
  token, 
  setCurrentSong, 
  setIsAudioBarVisible, 
  libraryView, 
  setLibraryView,
  likedSongsMap, 
  handleLikeToggle,
  currentSong
}) {
  
  const [playlistTitle, setPlaylistTitle] = useState("Liked Songs");
  const [playlistContent, setPlaylistContent] = useState([]);
  const [gridTitle, setGridTitle] = useState("Recommended");
  const [gridContent, setGridContent] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [allArtists, setAllArtists] = useState([]);

  useEffect(() => {
    const fetchAllArtists = async () => {
      const artistList = await getArtistData(20);
      setAllArtists(artistList);
    };
    fetchAllArtists();
  }, [currentSong]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const getOtherArtists = (excludeName = null) => {
        const otherArtists = allArtists.filter(
          a => a.name.toLowerCase() !== excludeName?.toLowerCase()
        );
        return otherArtists.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(Math.random()*(25-5)+1));
      };

      if (libraryView.type === 'liked') {
        setPlaylistTitle("Liked Songs");
        setGridTitle("Recommended For You");
        
        if (!token) {
          setPlaylistContent([]);
          setGridContent([]);
          setIsLoading(false);
          return;
        }
        try {
          const response = await api.get('/api/liked/');
          const likedSongs = (response.data || []).map(getSongData);
          setPlaylistContent(likedSongs);

          const recommendResponse = await mlApi.get(`/recommend/${currentSong.id}?limit=16`);
          const recommendGridSongs = (recommendResponse.data.similar_songs || []).map(getSongData);
          setGridContent(recommendGridSongs.map(song => ({ type: 'song', data: song })));

        } 
        catch (err) {
          console.error("Failed to fetch liked songs or recommendations", err);
        }

      } else if (libraryView.type === 'genre') {
        setPlaylistTitle(libraryView.value);
        setGridTitle("Other Genres");
        try {
          const songsResponse = await mlApi.get(`/songs_by_genre?genre=${libraryView.value}&limit=50`);
          setPlaylistContent(songsResponse.data.map(getSongData));
          const genresResponse = await mlApi.get('/genres');
          const otherGenres = genresResponse.data.filter(g => g.toLowerCase() !== libraryView.value.toLowerCase());
          setGridContent(otherGenres.map(g => ({ type: 'genre', name: g })));
        } catch (err) {
          console.error("Failed to fetch genre data", err);
        }

      } else if (libraryView.type === 'artist') {
        const artistName = libraryView.value;
        setPlaylistTitle(artistName);
        setGridTitle("Other Artists");
        try {
          const songsResponse = await mlApi.get(`/search?query=${artistName}&limit=50`);
          const artistSongs = songsResponse.data
            .map(getSongData)
            .filter(song => song.artist.toLowerCase() === artistName.toLowerCase());
          setPlaylistContent(artistSongs);
          setGridContent(getOtherArtists(artistName));
        }
        
        catch (err) {
          console.error("Failed to fetch artist data", err);
        }
      
     
      } else if (libraryView.type === 'recommended') {
        setPlaylistTitle("Recommended Songs");
        setGridTitle("More To Discover"); 
        
        if (!currentSong || !currentSong.id) {
          
          setPlaylistContent([]);
          setGridContent([]);
          console.warn("No current song to fetch recommendations on.");
        } 
        else {
          try {
           
            const recResponse = await mlApi.get(`/recommend/${currentSong.id}?limit=60`);
            const allRecs = (recResponse.data.similar_songs || []).map(getSongData);
            setPlaylistContent(allRecs.slice(0, 48));
    
            const gridSongs = allRecs.slice(48, 60);
            setGridContent(gridSongs.map(song => ({ type: 'song', data: song })));

          }
          catch (err) {
            console.error("Failed to fetch recommendations", err);
            setPlaylistContent([]);
            setGridContent([]);
          }
        }
      
      } else if (libraryView.type === 'popular') {
        setPlaylistTitle("Popular Songs"); 
        setGridTitle("Popular Artists"); 
        try {
          const songsResponse = await mlApi.get('/popular?limit=50');
          setPlaylistContent(songsResponse.data.map(getSongData));
          setGridContent(allArtists.slice(0, Math.ceil(Math.random()*(25-5)+5))); 
        } 
        catch (err) {
          console.error("Failed to fetch popular/artist data", err);
        }
      
      } else if (libraryView.type === 'artists_all') {
        setPlaylistTitle("All Artists");
        setPlaylistContent([]); 
        setGridTitle("All Artists");
        setGridContent(allArtists.slice(0, Math.ceil(Math.random()*(25-10)+10)));
      }

      setIsLoading(false);
    };

    
    if (allArtists.length > 0 || (libraryView.type !== 'artist' && libraryView.type !== 'artists_all' && libraryView.type !== 'popular')) {
      fetchData();
    }
  
  }, [libraryView, token, allArtists, currentSong]); 

 
  const handleSongClick = (song) => {
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    
    if (token) {
      api.post('/api/recent/add', { 
          songId: song.id,
          title: song.name,
          artist: song.artist,
          album: song.album_name || '',
          coverImage: song.image,
          preview: song.src
        }).
        catch(err => console.warn("Failed to add to recent", err.response?.data?.message || err.message));
    }
  };

  
  const handleGridClick = (item) => {
    if (item.type === 'song') {
      handleSongClick(item.data); 
    }
    else if (item.type === 'genre') {
      setLibraryView({ type: 'genre', value: item.name });
    }
    else if (item.type === 'artist' || item.type === 'artist_name_only') {
      setLibraryView({ type: 'artist', value: item.name });
    }
  };
  
  return (
    <div className='page-container'>
      <div className='page-head'>
        {/* <h1>My Library</h1> */}
      </div>

      <div className='playlist-grid'>
        <LibraryPlaylist
          title={playlistTitle}
          songs={playlistContent}
          isLoading={isLoading}
          handleSongClick={handleSongClick}
          likedSongsMap={likedSongsMap}
          handleLikeToggle={handleLikeToggle}
          customEmptyMessage={
            libraryView.type === 'recommended' ? 'Play a song to see recommendations.' :
            libraryView.type === 'artists_all' ? 'Select an artist to see their songs.' : 'No songs found.'
          }
        />
        
        <LibraryGridMenu
          title={gridTitle}
          items={gridContent}
          isLoading={isLoading}
          handleGridClick={handleGridClick}
        />
      </div>
    </div>
  );
}