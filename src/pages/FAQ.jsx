import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ_DATA = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay via Cash on Delivery, credit/debit card, EasyPaisa, or JazzCash.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery typically takes 3-5 business days for major cities and 5-7 business days for other areas across Pakistan.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you will receive a tracking number via email/SMS. You can also track your order from the "My Orders" section in your account.',
      },
      {
        q: 'What are the delivery charges?',
        a: 'Delivery charges vary based on your location and order size. Free shipping is available on orders above a certain amount. Check the cart page for details.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD), Visa, Mastercard, EasyPaisa, JazzCash, UnionPay, and HBL bank transfers.',
      },
      {
        q: 'Is Cash on Delivery available?',
        a: 'Yes! Cash on Delivery is available across Pakistan for your convenience.',
      },
      {
        q: 'Is online payment secure?',
        a: 'Absolutely. All online transactions are encrypted and processed through secure payment gateways to protect your information.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'You can return unused and unopened products within 7 days of delivery. The item must be in its original packaging.',
      },
      {
        q: 'How do I request a return?',
        a: 'Go to "My Orders" in your account, select the order, and click "Request Return". Our team will guide you through the process.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive the returned item. The refund will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Account & General',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click on the profile icon in the top right corner and select "Register". You can sign up using your email address.',
      },
      {
        q: 'Are all products authentic?',
        a: 'Yes, we guarantee 100% authentic products. All items are sourced directly from brands or authorized distributors.',
      },
      {
        q: 'How can I contact customer support?',
        a: 'You can reach us via our Contact Us page, email us at support@itemista.com, or call us at +92 300 1234567.',
      },
    ],
  },
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="faq-page">
      <section className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to the most common questions about shopping on ItemIsta.</p>
      </section>

      <div className="faq-container">
        {FAQ_DATA.map((section) => (
          <div key={section.category} className="faq-section">
            <h2 className="faq-category-title">{section.category}</h2>
            <div className="faq-list">
              {section.questions.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
