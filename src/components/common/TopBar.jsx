import { Link } from 'react-router';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar-links">
          <Link to="/seller">Sell on ItemIsta</Link>
          <Link to="/help">Help & Support</Link>
          <Link to="/profile">My Account</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
