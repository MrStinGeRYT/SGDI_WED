// ============================================================
// SGDI Web — Accordion Component
// ============================================================

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`accordion__item ${isOpen ? 'open' : ''}`}>
            <button
              className="accordion__header"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion__title">{item.title}</span>
              <ChevronDown className="accordion__icon" size={20} />
            </button>
            <div className="accordion__content" hidden={!isOpen}>
              <div className="accordion__content-inner">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
