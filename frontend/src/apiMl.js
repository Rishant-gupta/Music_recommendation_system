import axios from 'axios';

const ML_BASE_URL = 'https://music-recommendation-system-71od.onrender.com';

const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getSongData = (mlSong) => {
  return {
    id: mlSong.track_id || mlSong._id || mlSong.songId, 
    name: mlSong.track_name || mlSong.title,
    artist: mlSong.artists || mlSong.artist,
    image: mlSong.img || mlSong.coverImage,
    src: mlSong.preview || mlSong.src,
    album_name: mlSong.album_name || mlSong.album,
  };
};


export const getArtistData = async (limit = 20) => {
  try {
    // Fetch a larger list of popular songs to get a good variety of artists
    const response = await mlApi.get('/popular?limit=5000');
    const songs = response.data;

    const artistMap = new Map();

    for (const song of songs) {
      if (song.artists && !artistMap.has(song.artists)) {
        artistMap.set(song.artists, {
          type: 'artist',
          name: song.artists,
          image: song.img || '/logo192.png',
        });
      }
    }

    return Array.from(artistMap.values()).slice(0, limit);

  } catch (err) {
    console.error("Failed to fetch and normalize artist data", err);
    return [];
  }
};


export default mlApi;