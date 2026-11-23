import React from 'react';
import { Check, Sparkles, Code2, Cpu } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="hero-banner-card">
      <div className="hero-content-left">
        <h1 className="hero-title">AutoCase AI</h1>
        <h2 className="hero-subtitle">AI-Powered Test Automation Generation Platform</h2>
        <p className="hero-tagline">From requirements to automated test cases.</p>

        <div className="hero-features-list">
          <div className="hero-feature-item">
            <div className="check-circle-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>Understand Requirements</span>
          </div>

          <div className="hero-feature-item">
            <div className="check-circle-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>Generate Test Scenarios</span>
          </div>

          <div className="hero-feature-item">
            <div className="check-circle-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>Create Automation Code</span>
          </div>

          <div className="hero-feature-item">
            <div className="check-circle-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>Validate & Push to GitLab</span>
          </div>
        </div>
      </div>

      <div className="hero-graphic-right">
        <div className="hero-graphic-frame">
          <div className="graphic-monitor">
            <div className="monitor-top-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="monitor-code-preview">
              <div className="code-line w-60"></div>
              <div className="code-line w-80"></div>
              <div className="code-line w-40"></div>
              <div className="code-line w-90"></div>
            </div>
          </div>
          <div className="floating-badge ai-badge">
            <Cpu size={16} />
            <span>AI+</span>
          </div>
          <div className="floating-badge code-badge">
            <Code2 size={16} />
            <span>&lt;/&gt;</span>
          </div>
          <div className="floating-badge spark-badge">
            <Sparkles size={16} />
          </div>
        </div>
      </div>
    </section>
  );
};
