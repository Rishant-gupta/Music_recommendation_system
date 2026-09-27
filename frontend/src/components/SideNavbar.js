import React from 'react';
import './SideNavbar.css';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CategoryIcon from '@mui/icons-material/Category';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import RecommendIcon from '@mui/icons-material/Recommend';

export default function SideNavbar({ setCurrentPage, setLibraryView }) {

  const handleHomeClick = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLibraryClick = () => {
    setLibraryView({ type: 'liked' });
    setCurrentPage("library");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaylistClick = () => {
    setCurrentPage("home"); 
    setTimeout(() => {
      const genreElement = document.getElementById("genre-section");
      if (genreElement) {
        genreElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  
  const handleRecommendedClick = () => {
    setLibraryView({ type: 'recommended' });
    setCurrentPage("library");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="left-sidebar">
      <ul className="sidebar-menu">
        <li onClick={handleHomeClick}>
          <HomeFilledIcon />
          <span>Home</span>
        </li>
        <li onClick={handleLibraryClick}>
          <LibraryMusicIcon />
          <span>Library</span>
        </li>
        <li onClick={handlePlaylistClick}>
          <CategoryIcon />
          <span>Playlist</span>
        </li>
        
        <li onClick={handleRecommendedClick}> 
          <RecommendIcon />
          <span>Recommended</span>
        </li>
      </ul>
    </div>
  );
}