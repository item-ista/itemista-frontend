import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import './Header.css';

const Header = () => {
  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  );
};

export default Header;
