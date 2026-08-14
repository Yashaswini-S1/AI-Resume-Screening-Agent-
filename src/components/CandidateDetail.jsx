import React from 'react';
import { X, Mail, Phone, Calendar, BookOpen, Star, AlertTriangle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CandidateDetail({ candidate, onClose }) {
  if (!candidate) return null;

  const getMatchBadgeClass = (rec) => {
    if (rec === 'Strong Match') return 'badge-success';
    if (rec === 'Potential Match') return 'badge-warning';
    return 'badge-error';
  };

  const downloadCandidateReport = () => {
    const reportText = `CANDIDATE SCREENING REPORT
==========================
Candidate Name: ${candidate.candidateName}
Email: ${candidate.email || 'N/A'}
Phone: ${candidate.phone || 'N/A'}
Overall Fit: ${candidate.recommendation} (Score: ${candidate.scores.overall}%)

SCORES BREAKDOWN:
- Skills Score: ${candidate.scores.skills}/100
- Experience Score: ${candidate.scores.experience}/100
- Education Score: ${candidate.scores.education}/100
- Cultural Fit Score: ${candidate.scores.culturalFit}/100

SKILLS ANALYSIS:
- Skills Matched: ${candidate.skillsMatched.join(', ') || 'None'}
- Skills Missing: ${candidate.skillsMissing.join(', ') || 'None'}

EXPERIENCE SUMMARY:
- Total Years: ${candidate.yearsOfExperience} years
- Summary: ${candidate.experienceSummary}

EDUCATION SUMMARY:
- Summary: ${candidate.educationSummary}

AI EVALUATION EXPLANATION:
${candidate.explanation}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidate.candidateName.replace(/\s+/g, '_')}_screening_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div className="detail-panel glass-panel card-header-glow animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div className="header-info">
            <span className={`badge ${getMatchBadgeClass(candidate.recommendation)}`}>
              {candidate.recommendation}
            </span>
            <h2>{candidate.candidateName}</h2>
            <div className="contact-details">
              {candidate.email && (
                <span className="contact-item">
                  <Mail size={12} /> {candidate.email}
                </span>
              )}
              {candidate.phone && (
                <span className="contact-item">
                  <Phone size={12} /> {candidate.phone}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="close-btn" title="Close Panel">
            <X size={20} />
          </button>
        </div>

        <div className="panel-body">
          {/* Overall Score Banner */}
          <div className="score-summary-banner glass-panel">
            <div className="score-metric">
              <span className="score-large">{candidate.scores.overall}%</span>
              <span className="score-label">Overall Match Score</span>
            </div>
            <div className="score-bars-container">
              <div className="score-bar-row">
                <span className="bar-label">Skills</span>
                <div className="bar-track">
                  <div className="bar-fill skills" style={{ width: `${candidate.scores.skills}%` }} />
                </div>
                <span className="bar-value">{candidate.scores.skills}%</span>
              </div>
              
              <div className="score-bar-row">
                <span className="bar-label">Experience</span>
                <div className="bar-track">
                  <div className="bar-fill experience" style={{ width: `${candidate.scores.experience}%` }} />
                </div>
                <span className="bar-value">{candidate.scores.experience}%</span>
              </div>

              <div className="score-bar-row">
                <span className="bar-label">Education</span>
                <div className="bar-track">
                  <div className="bar-fill education" style={{ width: `${candidate.scores.education}%` }} />
                </div>
                <span className="bar-value">{candidate.scores.education}%</span>
              </div>

              <div className="score-bar-row">
                <span className="bar-label">Culture / Fit</span>
                <div className="bar-track">
                  <div className="bar-fill culture" style={{ width: `${candidate.scores.culturalFit}%` }} />
                </div>
                <span className="bar-value">{candidate.scores.culturalFit}%</span>
              </div>
            </div>
          </div>

          {/* Skills Mapping section */}
          <div className="section-grid">
            <div className="skills-block glass-panel">
              <div className="block-title text-success">
                <CheckCircle2 size={16} />
                <h3>Matched Skills ({candidate.skillsMatched.length})</h3>
              </div>
              <div className="tag-cloud">
                {candidate.skillsMatched.length === 0 ? (
                  <span className="empty-tag-text">No matching skills identified</span>
                ) : (
                  candidate.skillsMatched.map((skill, i) => (
                    <span key={i} className="skill-tag matched">{skill}</span>
                  ))
                )}
              </div>
            </div>

            <div className="skills-block glass-panel">
              <div className="block-title text-error">
                <AlertTriangle size={16} />
                <h3>Missing Skills ({candidate.skillsMissing.length})</h3>
              </div>
              <div className="tag-cloud">
                {candidate.skillsMissing.length === 0 ? (
                  <span className="empty-tag-text">No missing skills identified</span>
                ) : (
                  candidate.skillsMissing.map((skill, i) => (
                    <span key={i} className="skill-tag missing">{skill}</span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="content-section glass-panel">
            <div className="section-header-row">
              <Calendar size={16} className="text-accent-primary" />
              <h3>Work Experience</h3>
              <span className="years-pill">{candidate.yearsOfExperience} Years Total</span>
            </div>
            <p className="summary-paragraph">{candidate.experienceSummary}</p>
          </div>

          {/* Education */}
          <div className="content-section glass-panel">
            <div className="section-header-row">
              <BookOpen size={16} className="text-accent-secondary" />
              <h3>Education & Qualifications</h3>
            </div>
            <p className="summary-paragraph">{candidate.educationSummary}</p>
          </div>

          {/* AI Reasoning */}
          <div className="content-section glass-panel reason-block">
            <div className="section-header-row">
              <Star size={16} className="text-warning" />
              <h3>AI Explainability & Feedback</h3>
            </div>
            <p className="reason-paragraph">{candidate.explanation}</p>
          </div>
        </div>

        <div className="panel-footer">
          <button onClick={downloadCandidateReport} className="btn btn-primary btn-icon">
            <FileText size={16} /> Export Profile Report (TXT)
          </button>
        </div>
      </div>

      <style>{`
        .detail-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(4, 5, 9, 0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          justify-content: flex-end;
        }

        .detail-panel {
          width: 100%;
          max-width: 650px;
          height: 100%;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg) 0 0 var(--radius-lg);
          border-left: 1px solid var(--card-border);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .animate-slide-in {
          animation: slideIn var(--transition-normal) forwards;
        }

        .panel-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .header-info h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .contact-details {
          display: flex;
          gap: 16px;
          margin-top: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.775rem;
          color: var(--text-secondary);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .panel-body {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .score-summary-banner {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
        }

        .score-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }

        .score-large {
          font-size: 2.25rem;
          font-weight: 900;
          color: var(--accent-primary);
          line-height: 1;
        }

        .score-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-top: 6px;
          text-align: center;
        }

        .score-bars-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .score-bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .bar-label {
          width: 80px;
          color: var(--text-secondary);
        }

        .bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 99px;
        }

        .bar-fill.skills { background: #6366f1; }
        .bar-fill.experience { background: #a855f7; }
        .bar-fill.education { background: #14b8a6; }
        .bar-fill.culture { background: #f59e0b; }

        .bar-value {
          width: 32px;
          text-align: right;
          color: var(--text-primary);
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .skills-block {
          padding: 16px;
          border-radius: var(--radius-md);
          min-height: 150px;
        }

        .block-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .block-title.text-success { color: var(--color-success); }
        .block-title.text-error { color: var(--color-error); }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-tag {
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
          border: 1px solid transparent;
        }

        .skill-tag.matched {
          background: var(--color-success-bg);
          color: var(--color-success);
          border-color: var(--color-success-border);
        }

        .skill-tag.missing {
          background: var(--color-error-bg);
          color: var(--color-error);
          border-color: var(--color-error-border);
        }

        .empty-tag-text {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-style: italic;
        }

        .content-section {
          padding: 20px;
          border-radius: var(--radius-md);
        }

        .section-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .section-header-row h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .years-pill {
          margin-left: auto;
          font-size: 0.7rem;
          background: rgba(99, 102, 241, 0.1);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: 99px;
          font-weight: 700;
        }

        .summary-paragraph {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .reason-block {
          border-left: 3px solid var(--color-warning);
        }

        .reason-paragraph {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.6;
          white-space: pre-line;
        }

        .panel-footer {
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: flex-end;
          background: rgba(0, 0, 0, 0.15);
        }

        .btn-icon {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
