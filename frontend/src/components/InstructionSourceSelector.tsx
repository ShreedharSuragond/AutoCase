import React from 'react';
import {
  FileText,
  Image,
  Video,
  FileCheck2,
  Code,
  Plus,
} from 'lucide-react';

interface InstructionSourceSelectorProps {
  selectedSources: string[];
  onToggleSource: (sourceId: string) => void;
  onCreateAutomation: () => void;
}

export const InstructionSourceSelector: React.FC<InstructionSourceSelectorProps> = ({
  selectedSources,
  onToggleSource,
  onCreateAutomation,
}) => {
  const sources = [
    {
      id: 'jira',
      label: 'Jira Ticket',
      icon: <span className="source-svg-icon text-jira">◆</span>,
    },
    {
      id: 'gitlab',
      label: 'GitLab Issue',
      icon: <span className="source-svg-icon text-gitlab">🦊</span>,
    },
    {
      id: 'manual',
      label: 'Manual Requirement',
      icon: <FileText size={20} className="text-purple" />,
    },
    {
      id: 'screenshot',
      label: 'Screenshot / Image',
      icon: <Image size={20} className="text-purple" />,
    },
    {
      id: 'video',
      label: 'Video / Screen Recording',
      icon: <Video size={20} className="text-purple" />,
    },
    {
      id: 'existing-tests',
      label: 'Existing Test Cases',
      icon: <FileCheck2 size={20} className="text-teal" />,
    },
    {
      id: 'api-doc',
      label: 'API Documentation',
      icon: <Code size={20} className="text-indigo" />,
    },
  ];

  return (
    <div className="instruction-section">
      <div className="section-header-flex">
        <div>
          <h2 className="section-title">Get Started</h2>
          <p className="section-description">
            Create automation using requirements from multiple sources.
          </p>
        </div>
        <button className="btn-create-automation-main" onClick={onCreateAutomation}>
          <Plus size={18} />
          <span>Create Automation</span>
        </button>
      </div>

      <div className="sources-container">
        <label className="sources-label">Select Instruction Source (You can choose multiple)</label>
        <div className="sources-grid">
          {sources.map((src) => {
            const isSelected = selectedSources.includes(src.id);
            return (
              <button
                key={src.id}
                type="button"
                className={`source-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggleSource(src.id)}
              >
                <div className="source-card-icon">{src.icon}</div>
                <span className="source-card-label">{src.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
