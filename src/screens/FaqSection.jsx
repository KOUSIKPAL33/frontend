import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqData = [
  {
    question: "How do I track my food order?",
    answer: "Go to the 'My Orders' section in your profile to see live updates on your delivery."
  },
  {
    question: "Can I cancel or change my order?",
    answer: "Yes, but only before the acceptance of the order. After that, it's sent to the kitchen."
  },
  {
    question: "What payment methods are available?",
    answer: "We support UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery."
  },
  {
    question: "Is there a minimum order value?",
    answer: "No minimum order value. But delivery is free on orders above ₹300."
  },
  {
    question: "How do I report a missing item?",
    answer: "Use the 'Help' option in your order summary and submit a support ticket."
  }
];

function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary">Frequently Asked Questions</h2>
      <div className="accordion" id="faqAccordion">
        {faqData.map((faq, index) => (
          <div className="card mb-2 border-0 shadow-sm" key={index}>
            <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{faq.question}</h5>
              <button
                className="btn btn-sm btn-light border rounded-circle"
                onClick={() => toggleFAQ(index)}
              >
                {activeIndex === index ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
              </button>
            </div>
            {activeIndex === index && (
              <div className="card-body border-top">
                <p className="mb-0 text-secondary">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqSection;
