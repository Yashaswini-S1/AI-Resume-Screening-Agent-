import React from 'react';
import { BarChart3, Users, Percent, UserCheck, TrendingUp, Award } from 'lucide-react';

export default function AnalyticsDashboard({ candidates }) {
  if (!candidates || candidates.length === 0) return null;

  const totalCount = candidates.length;
  
  // Averages
  const averageScore = Math.round(
    candidates.reduce((sum, c) => sum + c.scores.overall, 0) / totalCount
  );
  
  // Recommendations breakdown
  const strongCount = candidates.filter(c => c.recommendation === 'Strong Match').length;
  const potentialCount = candidates.filter(c => c.recommendation === 'Potential Match').length;
  const lowCount = candidates.filter(c => c.recommendation === 'Low Match').length;

  const strongPct = Math.round((strongCount / totalCount) * 100);
  const potentialPct = Math.round((potentialCount / totalCount) * 100);
  const lowPct = 100 - (strongPct + potentialPct); // Clean sum

  // Skills aggregation
  const matchedSkillsMap = {};
  const missingSkillsMap = {};

  candidates.forEach(c => {
    c.skillsMatched.forEach(s => {
      const skillName = s.trim().toLowerCase();
      matchedSkillsMap[skillName] = (matchedSkillsMap[skillName] || 0) + 1;
    });
    c.skillsMissing.forEach(s => {
      const skillName = s.trim().toLowerCase();
      missingSkillsMap[skillName] = (missingSkillsMap[skillName] || 0) + 1;
    });
  });

  // Sort and pick top skills
  const topMatchedSkills = Object.entries(matchedSkillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topMissingSkills = Object.entries(missingSkillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="analytics-card glass-panel card-header-glow animate-fade-in">
      <div className="analytics-header">
        <BarChart3 size={18} className="text-accent-primary" />
        <h3>Pool Analytics</h3>
      </div>

      <div className="analytics-body">
        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card glass-panel">
            <Users size={20} className="metric-icon text-accent-primary" />
            <div className="metric-info">
              <span className="metric-val">{totalCount}</span>
              <span className="metric-label">Total Candidates</span>
            </div>
          </div>

          <div className="metric-card glass-panel">
            <Percent size={20} className="metric-icon text-accent-secondary" />
            <div className="metric-info">
              <span className="metric-val">{averageScore}%</span>
              <span className="metric-label">Average Match</span>
            </div>
          </div>

          <div className="metric-card glass-panel">
            <UserCheck size={20} className="metric-icon text-success" />
            <div className="metric-info">
              <span className="metric-val">{strongCount}</span>
              <span className="metric-label">Strong Matches</span>
            </div>
          </div>
        </div>

        {/* Shortlist Distribution */}
        <div className="distribution-section">
          <div className="section-title-row">
            <TrendingUp size={14} className="text-accent-primary" />
            <h4>Match Recommendations Distribution</h4>
          </div>
          
          <div className="distribution-bar">
            {strongCount > 0 && (
              <div 
                className="dist-segment strong" 
                style={{ width: `${(strongCount / totalCount) * 100}%` }}
                title={`Strong Match: ${strongCount} (${strongPct}%)`}
              />
            )}
            {potentialCount > 0 && (
              <div 
                className="dist-segment potential" 
                style={{ width: `${(potentialCount / totalCount) * 100}%` }}
                title={`Potential Match: ${potentialCount} (${potentialPct}%)`}
              />
            )}
            {lowCount > 0 && (
              <div 
                className="dist-segment low" 
                style={{ width: `${(lowCount / totalCount) * 100}%` }}
                title={`Low Match: ${lowCount} (${lowPct}%)`}
              />
            )}
          </div>

          <div className="distribution-legend">
            <div className="legend-item">
              <span className="dot strong" />
              <span>Strong: <strong>{strongCount}</strong> ({strongPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot potential" />
              <span>Potential: <strong>{potentialCount}</strong> ({potentialPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot low" />
              <span>Low Match: <strong>{lowCount}</strong> ({lowPct}%)</span>
            </div>
          </div>
        </div>

        {/* Skills Insights */}
        <div className="skills-insights-grid">
          <div className="skills-trend-box glass-panel">
            <h4 className="text-success text-xs font-bold uppercase tracking-wider mb-3">
              Top Strengths In Pool
            </h4>
            <div className="skills-list">
              {topMatchedSkills.length === 0 ? (
                <span className="empty-insights-text">No skill trends available</span>
              ) : (
                topMatchedSkills.map(([skill, count], i) => (
                  <div key={i} className="skill-row">
                    <span className="skill-name">{skill}</span>
                    <div className="bar-track">
                      <div className="bar-fill matched" style={{ width: `${(count / totalCount) * 100}%` }} />
                    </div>
                    <span className="skill-count">{count} cands</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="skills-trend-box glass-panel">
            <h4 className="text-error text-xs font-bold uppercase tracking-wider mb-3">
              Top Talent Gaps In Pool
            </h4>
            <div className="skills-list">
              {topMissingSkills.length === 0 ? (
                <span className="empty-insights-text">No talent gap trends available</span>
              ) : (
                topMissingSkills.map(([skill, count], i) => (
                  <div key={i} className="skill-row">
                    <span className="skill-name">{skill}</span>
                    <div className="bar-track">
                      <div className="bar-fill missing" style={{ width: `${(count / totalCount) * 100}%` }} />
                    </div>
                    <span className="skill-count">{count} cands</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .analytics-card {
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .analytics-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .analytics-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.01);
        }

        .metric-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
        }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1;
        }

        .metric-label {
          font-size: 0.725rem;
          color: var(--text-tertiary);
          margin-top: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .distribution-section {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 24px;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .section-title-row h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .distribution-bar {
          display: flex;
          height: 12px;
          border-radius: 99px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 16px;
        }

        .dist-segment {
          height: 100%;
          transition: width var(--transition-normal);
        }

        .dist-segment.strong { background: var(--color-success); }
        .dist-segment.potential { background: var(--color-warning); }
        .dist-segment.low { background: var(--color-error); }

        .distribution-legend {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.775rem;
          color: var(--text-secondary);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot.strong { background: var(--color-success); }
        .dot.potential { background: var(--color-warning); }
        .dot.low { background: var(--color-error); }

        .skills-insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .skills-trend-box {
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .skills-trend-box h4 {
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
        }

        .skill-name {
          width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 600;
          color: var(--text-primary);
        }

        .skill-count {
          width: 50px;
          text-align: right;
          color: var(--text-tertiary);
          font-weight: 600;
        }

        .skill-row .bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 99px;
          overflow: hidden;
        }

        .skill-row .bar-fill {
          height: 100%;
          border-radius: 99px;
        }

        .skill-row .bar-fill.matched { background: var(--color-success); }
        .skill-row .bar-fill.missing { background: var(--color-error); }

        .empty-insights-text {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
