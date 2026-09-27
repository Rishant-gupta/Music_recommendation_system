import React from 'react';
import './LibraryGridMenu.css';


const LibraryGridMenu = ({ title, items, isLoading, handleGridClick }) => {

  
  const renderGridItem = (item) => {
    switch (item.type) {
      case 'song':
        return (
          <div className="menu-tile" key={item.data.id} onClick={() => handleGridClick(item)}>
            <img src={item.data.image} alt={item.data.name} />
            <div>{item.data.name} <span>{item.data.artist} </span></div>
          </div>
        );
      case 'genre':
        return (
          <div className="genre-tile-library" key={item.name} onClick={() => handleGridClick(item)}>
            {item.name}
          </div>
        );
      case 'artist':
        return (
          <div className="artist-tile-library" key={item.name} onClick={() => handleGridClick(item)}>
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </div>
        );
      case 'artist_name_only':
        return (
          <div className="genre-tile-library" key={item.name} onClick={() => handleGridClick(item)}>
            {item.name}
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className='grid-menus'>
        <div className='grid-menu-head'>{title}</div>
        <div className='grid-menu-content'>
          <p style={{padding: '20px', color: '#aaa'}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid-menus'>
      <div className='grid-menu-head'>{title}</div>
      <div className='grid-menu-content'>
        {items.length > 0 ? items.map(renderGridItem) : (
          <p style={{padding: '20px', color: '#aaa'}}>Nothing to show.</p>
        )}
      </div>
    </div>
  );
};

export default LibraryGridMenu;