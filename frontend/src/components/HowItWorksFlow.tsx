import React from 'react';
import { ClipboardList, Sparkles, Code2, CheckCircle, GitPullRequest, ArrowRight } from 'lucide-react';

export const HowItWorksFlow: React.FC = () => {
  const steps = [
    {
      title: 'Provide Requirements',
      icon: <ClipboardList size={18} className="step-icon text-indigo" />,
    },
    {
      title: 'AI Analysis & Test Scenarios',
      icon: <Sparkles size={18} className="step-icon text-purple" />,
    },
    {
      title: 'Generate Automation Code',
      icon: <Code2 size={18} className="step-icon text-blue" />,
    },
    {
      title: 'Validate Code',
      icon: <CheckCircle size={18} className="step-icon text-teal" />,
    },
    {
      title: 'Push to GitLab',
      subtitle: '(Branch + Merge Request)',
      icon: <GitPullRequest size={18} className="step-icon text-violet" />,
    },
  ];

  return (
    <div className="how-it-works-card">
      <div className="how-it-works-label">How It Works</div>
      <div className="how-it-works-steps">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flow-step-item">
              <div className="flow-step-icon-box">{step.icon}</div>
              <div className="flow-step-texts">
                <span className="flow-step-title">{step.title}</span>
                {step.subtitle && <span className="flow-step-subtitle">{step.subtitle}</span>}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="flow-step-arrow">
                <ArrowRight size={14} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
