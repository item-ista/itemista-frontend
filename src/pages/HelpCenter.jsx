import { Link } from 'react-router';
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  User, 
  HelpCircle, 
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import './HelpCenter.css';

const HELP_TOPICS = [
  {
    icon: ShoppingCart,
    title: 'Ordering',
    desc: 'How to place orders, modify or cancel them.',
    link: '/faq',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    desc: 'Payment methods, issues, and secure transactions.',
    link: '/faq',
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    desc: 'Delivery times, tracking, and shipping areas.',
    link: '/faq',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    desc: 'Return policy, how to return, and refund process.',
    link: '/faq',
  },
  {
    icon: User,
    title: 'My Account',
    desc: 'Account settings, password, and profile management.',
    link: '/faq',
  },
  {
    icon: HelpCircle,
    title: 'General FAQ',
    desc: 'Common questions and quick answers.',
    link: '/faq',
  },
];

const HelpCenter = () => {
  return (
    <div className="help-center-page">
      <section className="help-hero">
        <h1>Help Center</h1>
        <p>How can we help you today?</p>
      </section>

      <div className="help-container">
        {/* Topics Grid */}
        <section className="help-topics">
          <h2>Browse Help Topics</h2>
          <div className="help-topics-grid">
            {HELP_TOPICS.map((topic) => (
              <Link to={topic.link} key={topic.title} className="help-topic-card">
                <topic.icon size={28} className="help-topic-icon" />
                <h3>{topic.title}</h3>
                <p>{topic.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="help-contact">
          <h2>Still Need Help?</h2>
          <p className="help-contact-desc">Our support team is here to assist you.</p>
          <div className="help-contact-options">
            <div className="help-contact-card">
              <Mail size={24} className="help-contact-icon" />
              <h4>Email Us</h4>
              <p>support@itemista.com</p>
              <span>Response within 24 hours</span>
            </div>
            <div className="help-contact-card">
              <Phone size={24} className="help-contact-icon" />
              <h4>Call Us</h4>
              <p>+92 300 1234567</p>
              <span>Mon-Sat, 9AM - 9PM</span>
            </div>
            <Link to="/contact" className="help-contact-card">
              <MessageSquare size={24} className="help-contact-icon" />
              <h4>Contact Form</h4>
              <p>Send us a message</p>
              <span>We'll respond ASAP</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
