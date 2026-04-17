// ============================================================
// SGDI Web — Tabs Component
// ============================================================

import React, { useState } from 'react';
import './Tabs.css';

export default function Tabs({ tabs, defaultActiveIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeIndex === index}
            className={`tabs-btn ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.icon && <span className="tabs-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content" role="tabpanel">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
}
