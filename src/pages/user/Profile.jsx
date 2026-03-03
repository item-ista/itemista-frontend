import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { authService } from '../../services/authService';
import { useState, useRef, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [displayAvatar, setDisplayAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // Use actual user data from auth context or fallback to mock data
  const userData = user ? {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || 'user@example.com',
    phone: user.user_metadata?.phone || '+92 300 1234567',
    avatar: user.user_metadata?.avatar || null
  } : {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+92 300 1234567',
    avatar: null
  };

  useEffect(() => {
    if (userData.avatar) {
      setDisplayAvatar(userData.avatar);
    }
  }, [userData.avatar]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!user) {
      showError('You must be logged in to update your profile.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file (JPG, PNG).');
      return;
    }
    
    // Create a local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setDisplayAvatar(objectUrl);

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showError('Image size should be less than 2MB.');
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Upload to storage
      const avatarUrl = await authService.uploadAvatar(user.id, file);
      
      // 2. Update user metadata
      // authService.updateProfile already wraps input in 'data' key
      await authService.updateProfile({ 
        avatar: avatarUrl 
      });

      // Update state with the final server URL to ensure consistency
      // Add timestamp to mock cache busting just in case
      setDisplayAvatar(avatarUrl); 

      showSuccess('Profile picture updated successfully!');
    } catch (error) {
      console.error('Avatar update failed:', error);
      // Revert to original if failed
      setDisplayAvatar(userData.avatar);
      // Show more specific error if possible
      const errorMessage = error.message || error.error_description || 'Failed to update profile picture. Please try again.';
      showError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      showSuccess('Successfully logged out. See you again soon!');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      showError('Logout failed. Please try again.');
      // Still navigate to home even if logout fails
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { icon: Package, label: 'My Orders', path: '/orders', color: '#ec4899' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: '#ec4899' },
    { icon: MapPin, label: 'Addresses', path: '/addresses', color: '#666' },
    { icon: Settings, label: 'Settings', path: '/settings', color: '#666' },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar" onClick={handleAvatarClick}>
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {isUploading && (
              <div className="profile-avatar-loading">
                <div className="spinner"></div>
              </div>
            )}
            
            <div className="profile-avatar-overlay">
              <Camera size={24} />
            </div>

            {displayAvatar ? (
              <img src={displayAvatar} alt={userData.name} key={displayAvatar} />
            ) : (
              <User size={48} />
            )}
          </div>
          <div className="profile-info">
            <h1>{userData.name}</h1>
            <div className="profile-details">
              <div className="detail-item">
                <Mail size={16} />
                <span>{userData.email}</span>
              </div>
              <div className="detail-item">
                <Phone size={16} />
                <span>{userData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="profile-menu">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="menu-item">
              <div className="menu-icon" style={{ color: item.color }}>
                <item.icon size={24} />
              </div>
              <span className="menu-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={20} />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
