import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Download, Award, User, Briefcase, GraduationCap } from 'lucide-react';

export default function CandidateList({ candidates, onSelectCandidate, onExportShortlist }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Strong Match' | 'Potential Match' | 'Low Match'
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'experience' | 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredCandidates = candidates
    .filter((candidate) => {
      const matchesSearch = 
        candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skillsMatched.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterType === 'All' || candidate.recommendation === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'score') {
        comparison = a.scores.overall - b.scores.overall;
      } else if (sortBy === 'experience') {
        comparison = a.yearsOfExperience - b.yearsOfExperience;
      } else if (sortBy === 'name') {
        comparison = a.candidateName.localeCompare(b.candidateName);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getMatchBadgeClass = (rec) => {
    if (rec === 'Strong Match') return 'badge-success';
    if (rec === 'Potential Match') return 'badge-warning';
    return 'badge-error';
  };

  return (
    <div className="list-card glass-panel card-header-glow">
      <div className="list-header">
        <div className="header-title">
          <Award size={18} className="text-accent-primary" />
          <h3>Screened Candidates</h3>
        </div>
        {candidates.length > 0 && (
          <button 
            onClick={onExportShortlist} 
            className="btn btn-secondary btn-sm"
            title="Download CSV Shortlist"
          >
            <Download size={12} /> Export CSV
          </button>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <User size={32} className="text-tertiary" />
          </div>
          <p>No candidates screened yet. Upload resumes and run the screening agent.</p>
        </div>
      ) : (
        <div className="list-body">
          {/* Filters and Controls */}
          <div className="controls-row">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search candidates by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input search-input"
              />
            </div>

            <div className="filter-box">
              <Filter size={16} className="filter-icon" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input filter-select"
              >
                <option value="All">All Recommendations</option>
                <option value="Strong Match">Strong Match</option>
                <option value="Potential Match">Potential Match</option>
                <option value="Low Match">Low Match</option>
              </select>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="table-responsive">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Candidate Name <ArrowUpDown size={12} />
                  </th>
                  <th>Match Status</th>
                  <th onClick={() => handleSort('experience')} className="sortable text-center">
                    Exp. (Yrs) <ArrowUpDown size={12} />
                  </th>
                  <th>Scores Breakdown</th>
                  <th onClick={() => handleSort('score')} className="sortable text-center">
                    Overall Score <ArrowUpDown size={12} />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No candidates match your filters. Try adjusting search queries.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate, idx) => (
                    <tr 
                      key={candidate.email + idx} 
                      onClick={() => onSelectCandidate(candidate)}
                      className="candidate-row"
                    >
                      <td>
                        <div className="name-cell">
                          <span className="candidate-name-text">{candidate.candidateName}</span>
                          <span className="candidate-email-text">{candidate.email || 'No email'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getMatchBadgeClass(candidate.recommendation)}`}>
                          {candidate.recommendation}
                        </span>
                      </td>
                      <td className="text-center font-semibold">
                        {candidate.yearsOfExperience} yrs
                      </td>
                      <td>
                        <div className="table-scores">
                          <div className="score-mini-bar" title={`Skills: ${candidate.scores.skills}%`}>
                            <Briefcase size={10} className="text-accent-primary" />
                            <div className="mini-progress-track">
                              <div className="mini-progress-fill skills" style={{ width: `${candidate.scores.skills}%` }} />
                            </div>
                          </div>
                          <div className="score-mini-bar" title={`Education: ${candidate.scores.education}%`}>
                            <GraduationCap size={10} className="text-accent-secondary" />
                            <div className="mini-progress-track">
                              <div className="mini-progress-fill education" style={{ width: `${candidate.scores.education}%` }} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="overall-score-cell">
                          <span className={`overall-score-number ${
                            candidate.scores.overall >= 80 ? 'good' : candidate.scores.overall >= 60 ? 'avg' : 'bad'
                          }`}>
                            {candidate.scores.overall}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <ChevronRight size={16} className="chevron-icon text-tertiary" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .list-card {
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .empty-state {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .empty-state p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          max-width: 320px;
        }

        .controls-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
        }

        .search-input {
          padding-left: 38px;
        }

        .filter-box {
          position: relative;
          width: 220px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .filter-select {
          padding-left: 36px;
          cursor: pointer;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .candidates-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .candidates-table th {
          padding: 12px 16px;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          text-transform: uppercase;
          font-size: 0.725rem;
          letter-spacing: 0.05em;
        }

        .candidates-table th.sortable {
          cursor: pointer;
          user-select: none;
          transition: color var(--transition-fast);
        }

        .candidates-table th.sortable:hover {
          color: var(--text-primary);
        }

        .candidates-table th svg {
          display: inline-block;
          vertical-align: middle;
          margin-left: 4px;
        }

        .candidates-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          vertical-align: middle;
        }

        .candidate-row {
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .candidate-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .candidate-row:hover .chevron-icon {
          color: var(--text-primary);
          transform: translateX(2px);
        }

        .name-cell {
          display: flex;
          flex-direction: column;
          max-width: 220px;
        }

        .candidate-name-text {
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .candidate-email-text {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-center {
          text-align: center;
        }

        .font-semibold {
          font-weight: 600;
        }

        .table-scores {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 120px;
        }

        .score-mini-bar {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mini-progress-track {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          border-radius: 2px;
        }

        .mini-progress-fill.skills { background: var(--accent-primary); }
        .mini-progress-fill.education { background: var(--accent-secondary); }

        .overall-score-cell {
          display: flex;
          justify-content: center;
        }

        .overall-score-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          font-weight: 800;
          font-size: 0.9rem;
          border: 2px solid transparent;
        }

        .overall-score-number.good {
          color: var(--color-success);
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
        }

        .overall-score-number.avg {
          color: var(--color-warning);
          background: rgba(245, 158, 11, 0.05);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .overall-score-number.bad {
          color: var(--color-error);
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .chevron-icon {
          transition: transform var(--transition-fast);
        }

        .no-results {
          text-align: center;
          padding: 32px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
