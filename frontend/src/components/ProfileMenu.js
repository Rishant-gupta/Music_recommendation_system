import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import "./ProfileMenu.css"; 

const ProfileMenu = ({ isLoggedIn, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); 

  if (!isLoggedIn) return null;

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); 
  };

  return (
    <div className="container">
      
      <div className="username-display">

      </div>
      <AccountCircleIcon 
        className="avatar"
        onClick={() => setShowMenu(!showMenu)}
      />

      {showMenu && (
        <div className="menu">
          <button className="logoutBtn" onClick={handleLogoutClick}>
            <FiLogOut style={{ marginRight: "8px" }} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;