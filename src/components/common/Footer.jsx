import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Globe,
  ShieldCheck
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Section 1: Links & App Download */}
        <div className="footer-section-top">
          <div className="footer-column">
            <h3 className="footer-title">Customer Care</h3>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">ItemIsta</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/flash-sale">Flash Sale</Link></li>
              <li><Link to="/categories">Categories</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">My Account</h3>
            <ul className="footer-links">
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/addresses">My Addresses</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          <div className="footer-column app-download-section">
            <div className="download-app-header">
              <div className="app-icon-placeholder">
                <img src="/logos/ItemIstaPink.png" alt="ItemIsta App" />
              </div>
              <div className="download-text">
                <span className="happy-shopping">Happy Shopping</span>
                <span className="download-subtitle">Download App</span>
              </div>
            </div>
            {/* <div className="app-stores">
              <div className="app-store-btn">Available on the App Store</div>
              <div className="app-store-btn">Get it on Google Play</div>
              <div className="app-store-btn">Explore it on AppGallery</div>
            </div> */}
          </div>
        </div>

        {/* Section 2: Payment & Verified */}
        <div className="footer-section-middle">
          <div className="payment-methods">
            <h3 className="footer-title">Payment Methods</h3>
            <div className="payment-icons">
               <img src="/payment methods/cashondelivery.png" alt="Cash on Delivery" className="payment-img" />
               <img src="/payment methods/visacard.png" alt="Visa" className="payment-img" />
               <img src="/payment methods/mastercard.png" alt="Mastercard" className="payment-img" />
               <img src="/payment methods/easypaisa.png" alt="EasyPaisa" className="payment-img" />
               <img src="/payment methods/jazzcash.png" alt="JazzCash" className="payment-img" />
               <img src="/payment methods/unionpaycard.png" alt="UnionPay" className="payment-img" />
               <img src="/payment methods/HBLbabibbankcard.png" alt="HBL" className="payment-img" />
            </div>
          </div>
            {/* <div className="verified-by">
              <h3 className="footer-title">Verified by</h3>
              <div className="verified-icons">
                <div className="verified-icon"><ShieldCheck size={20}/> PCI DSS</div>
              </div>
            </div> */}
        </div>

        {/* Section 3: Bottom Info */}
        <div className="footer-section-bottom">
          <div className="footer-bottom-row">
            <div className="international-sites">
              <h3 className="footer-title-small">ItemIsta</h3>
              <div className="country-links">
                <span className="country-link">
                  <img src="/country/pakistan.png" alt="Pakistan" className="country-flag" /> 
                  Pakistan
                </span>
                {/* <span className="country-link"><Globe size={14} /> Bangladesh</span>
                <span className="country-link"><Globe size={14} /> Sri Lanka</span>
                <span className="country-link"><Globe size={14} /> Myanmar</span>
                <span className="country-link"><Globe size={14} /> Nepal</span> */}
              </div>
            </div>

            <div className="social-links-container">
               <h3 className="footer-title-small">Follow Us</h3>
               <div className="social-links">
                 <a href="#" className="social-icon">
                    <img src="/social media/facebook.png" alt="Facebook" className="social-img" />
                 </a>
                 <a href="#" className="social-icon">
                    <img src="/social media/instagram.png" alt="Instagram" className="social-img" />
                 </a>
                 <a href="#" className="social-icon">
                    <img src="/social media/youtube.png" alt="Youtube" className="social-img" />
                 </a>
               </div>
            </div>

            <div className="copyright">
              © ItemIsta 2026
            </div>
          </div>
        </div>

      </div>

      {/* Chat Widget - Commented out as using Chatbot component instead
      <div className="chat-widget">
        {isChatOpen && (
          <div className="chat-window">
             <div className="chat-header">
                <span>Messages</span>
                <button className="close-chat" onClick={() => setIsChatOpen(false)}>
                  <X size={18} />
                </button>
             </div>
             <div className="chat-body">
                <div className="chat-placeholder-icon">
                   <MessageSquare size={48} color="#ccc" />
                   <p>Once you start a new conversation, you'll see it listed here.</p>
                </div>
             </div>
          </div>
        )}
        
        {!isChatOpen && (
          <button className="chat-toggle-btn" onClick={() => setIsChatOpen(true)}>
             <MessageSquare size={20} className="chat-icon-desktop" />
             <Bot size={24} className="chat-icon-mobile" />
             <span className="chat-btn-text">Messages</span>
          </button>
        )}
      </div>
      */}
    </footer>
  );
};

export default Footer;
