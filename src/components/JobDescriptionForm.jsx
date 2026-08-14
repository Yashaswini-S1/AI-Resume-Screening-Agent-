import React, { useState } from 'react';
import { Briefcase, Sliders, RefreshCw, Sparkles } from 'lucide-react';

// Sample Job Descriptions to help testing
const SAMPLE_JDS = [
  {
    title: "Senior Full Stack Engineer (React/Node)",
    content: `Position: Senior Full Stack Engineer
Experience: 5+ years of software engineering experience.
Location: Remote / Hybrid

Technical Requirements:
- Expert level proficiency in React.js and modern state management (Redux, Context API).
- Strong experience in Node.js, Express, and backend APIs.
- Experience with databases like PostgreSQL, MongoDB, or Redis.
- Familiarity with TypeScript and modern ES6+ JavaScript.
- Experience with cloud providers (AWS, GCP) and CI/CD pipelines (GitHub Actions, Docker).

Preferred Qualifications:
- Solid understanding of Web Performance Optimization and accessibility (a11y).
- Excellent written and verbal communication skills.
- Bachelor's degree in Computer Science or a related engineering field.`
  },
  {
    title: "AI/ML Product Manager",
    content: `Position: Product Manager, Artificial Intelligence
Experience: 3+ years managing AI/ML powered features or software products.
Location: San Francisco, CA / Hybrid

Key Responsibilities:
- Define product strategy and roadmap for our LLM-powered agent tools.
- Collaborate with Machine Learning engineers and Data Scientists to design model evaluations.
- Author clear, structured Product Requirement Documents (PRDs).
- Communicate roadmap and performance metrics to executive leadership.

Qualifications:
- Strong analytical skills; experience writing SQL queries and interpreting data dashboards.
- Deep understanding of NLP, Generative AI models (Gemini, GPT), and prompt engineering.
- Excellent stakeholder communication skills.
- MBA or Technical Degree (Computer Science, Data Science, Math) preferred.`
  }
];

export default function JobDescriptionForm({ jd, setJd, weights, setWeights }) {
  const [showSamples, setShowSamples] = useState(false);

  const totalWeight = weights.skills + weights.experience + weights.education + weights.culturalFit;
  const isValidWeight = totalWeight === 100;

  const handleWeightChange = (key, value) => {
    const numericValue = parseInt(value, 10) || 0;
    setWeights((prev) => ({
      ...prev,
      [key]: numericValue
    }));
  };

  const autoNormalize = () => {
    const sum = weights.skills + weights.experience + weights.education + weights.culturalFit;
    if (sum === 0) {
      setWeights({ skills: 25, experience: 25, education: 25, culturalFit: 25 });
      return;
    }
    
    // Normalize to sum to 100
    const factor = 100 / sum;
    const rawSkills = Math.round(weights.skills * factor);
    const rawExp = Math.round(weights.experience * factor);
    const rawEdu = Math.round(weights.education * factor);
    const rawFit = 100 - (rawSkills + rawExp + rawEdu); // Avoid rounding errors

    setWeights({
      skills: Math.max(0, rawSkills),
      experience: Math.max(0, rawExp),
      education: Math.max(0, rawEdu),
      culturalFit: Math.max(0, rawFit)
    });
  };

  const handleSelectSample = (sampleContent) => {
    setJd(sampleContent);
    setShowSamples(false);
  };

  return (
    <div className="jd-card glass-panel card-header-glow">
      <div className="jd-header">
        <div className="header-title">
          <Briefcase size={18} className="text-accent-primary" />
          <h3>Job Requirements</h3>
        </div>
        <div className="sample-dropdown-wrapper">
          <button 
            type="button" 
            onClick={() => setShowSamples(!showSamples)} 
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={12} /> Samples
          </button>
          {showSamples && (
            <div className="samples-dropdown glass-panel">
              {SAMPLE_JDS.map((sample, idx) => (
                <div 
                  key={idx} 
                  className="sample-item"
                  onClick={() => handleSelectSample(sample.content)}
                >
                  {sample.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="jd-body">
        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description, technical requirements, and target experience here..."
            className="form-textarea jd-textarea"
          />
        </div>

        <div className="weights-section">
          <div className="weights-title">
            <Sliders size={16} className="text-accent-secondary" />
            <h4>Evaluation Weights</h4>
          </div>

          {/* Stacked weight visualizer */}
          <div className="weight-visualizer">
            <div className="weight-segment skills" style={{ width: `${(weights.skills / (totalWeight || 1)) * 100}%` }} title={`Skills: ${weights.skills}%`} />
            <div className="weight-segment experience" style={{ width: `${(weights.experience / (totalWeight || 1)) * 100}%` }} title={`Experience: ${weights.experience}%`} />
            <div className="weight-segment education" style={{ width: `${(weights.education / (totalWeight || 1)) * 100}%` }} title={`Education: ${weights.education}%`} />
            <div className="weight-segment cultural" style={{ width: `${(weights.culturalFit / (totalWeight || 1)) * 100}%` }} title={`Fit: ${weights.culturalFit}%`} />
          </div>

          <div className="sliders-grid">
            <div className="slider-item">
              <div className="slider-label-row">
                <span>Skills</span>
                <span className="weight-badge skills-badge">{weights.skills}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.skills}
                onChange={(e) => handleWeightChange('skills', e.target.value)}
                className="weight-slider slider-skills"
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>Experience</span>
                <span className="weight-badge experience-badge">{weights.experience}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.experience}
                onChange={(e) => handleWeightChange('experience', e.target.value)}
                className="weight-slider slider-experience"
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>Education</span>
                <span className="weight-badge education-badge">{weights.education}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.education}
                onChange={(e) => handleWeightChange('education', e.target.value)}
                className="weight-slider slider-education"
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>Cultural Fit</span>
                <span className="weight-badge cultural-badge">{weights.culturalFit}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.culturalFit}
                onChange={(e) => handleWeightChange('culturalFit', e.target.value)}
                className="weight-slider slider-cultural"
              />
            </div>
          </div>

          <div className="weights-status-row">
            <div className={`status-indicator ${isValidWeight ? 'valid' : 'invalid'}`}>
              Total Weight: <strong className={isValidWeight ? 'text-success' : 'text-error'}>{totalWeight}%</strong>
              {!isValidWeight && ' (Must equal 100%)'}
            </div>
            {!isValidWeight && (
              <button 
                type="button" 
                onClick={autoNormalize} 
                className="btn btn-secondary btn-sm auto-normalize-btn"
              >
                <RefreshCw size={10} /> Auto-Balance
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .jd-card {
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .jd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-title h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .sample-dropdown-wrapper {
          position: relative;
        }

        .btn-sm {
          padding: 6px 10px;
          font-size: 0.75rem;
          border-radius: 6px;
        }

        .samples-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 8px;
          width: 250px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          z-index: 10;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
        }

        .sample-item {
          padding: 10px 14px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background var(--transition-fast);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sample-item:last-child {
          border-bottom: none;
        }

        .sample-item:hover {
          background: rgba(99, 102, 241, 0.15);
          color: white;
        }

        .jd-textarea {
          min-height: 200px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .weights-section {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .weights-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .weights-title h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .weight-visualizer {
          display: flex;
          height: 8px;
          border-radius: 99px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 20px;
        }

        .weight-segment {
          height: 100%;
          transition: width var(--transition-normal);
        }

        .weight-segment.skills { background: #6366f1; }
        .weight-segment.experience { background: #a855f7; }
        .weight-segment.education { background: #14b8a6; }
        .weight-segment.cultural { background: #f59e0b; }

        .sliders-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .slider-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .weight-badge {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .skills-badge { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .experience-badge { background: rgba(168, 85, 247, 0.1); color: #c084fc; }
        .education-badge { background: rgba(20, 184, 166, 0.1); color: #2dd4bf; }
        .cultural-badge { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }

        .weight-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.05);
          outline: none;
          transition: background var(--transition-fast);
        }

        .weight-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .weight-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-skills::-webkit-slider-thumb { background: #6366f1; }
        .slider-experience::-webkit-slider-thumb { background: #a855f7; }
        .slider-education::-webkit-slider-thumb { background: #14b8a6; }
        .slider-cultural::-webkit-slider-thumb { background: #f59e0b; }

        .weights-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 0.825rem;
        }

        .status-indicator {
          color: var(--text-secondary);
        }

        .text-success { color: var(--color-success); }
        .text-error { color: var(--color-error); }

        .auto-normalize-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.725rem;
          padding: 4px 8px;
        }
      `}</style>
    </div>
  );
}
