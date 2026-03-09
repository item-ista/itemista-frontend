import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: integrate with backend/email service
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <Mail size={22} className="contact-info-icon" />
                <div>
                  <h4>Email</h4>
                  <p>support@itemista.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <Phone size={22} className="contact-info-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+92 300 1234567</p>
                </div>
              </div>
              <div className="contact-info-item">
                <MapPin size={22} className="contact-info-icon" />
                <div>
                  <h4>Address</h4>
                  <p>Lahore, Punjab, Pakistan</p>
                </div>
              </div>
              <div className="contact-info-item">
                <Clock size={22} className="contact-info-icon" />
                <div>
                  <h4>Business Hours</h4>
                  <p>Mon - Sat: 9:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className="contact-success">
                <Send size={40} className="contact-success-icon" />
                <h3>Thank you!</h3>
                <p>Your message has been sent. We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-input-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                  <label htmlFor="name">Full Name</label>
                </div>
                <div className="contact-input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="contact-input-group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                  <label htmlFor="subject">Subject</label>
                </div>
                <div className="contact-input-group">
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                  <label htmlFor="message">Message</label>
                </div>
                <button type="submit" className="contact-submit-btn">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
