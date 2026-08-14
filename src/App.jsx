import React, { useState, useEffect } from 'react';
import { Settings, BrainCircuit, RefreshCw, Key, Download, AlertTriangle } from 'lucide-react';
import APIKeyModal from './components/APIKeyModal';
import JobDescriptionForm from './components/JobDescriptionForm';
import ResumeUploader from './components/ResumeUploader';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { parseResumeFile } from './utils/fileParsers';
import { screenResume } from './utils/geminiClient';
import './App.css';

export default function App() {
  // Core states
  const [apiKey, setApiKey] = useState('');
  const [jd, setJd] = useState('');
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    culturalFit: 10
  });

  const [files, setFiles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  
  // UI states
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isScreening, setIsScreening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load API Key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setIsKeyModalOpen(true);
    }
  }, []);

  // Save API Key helper
  const handleSaveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setErrorMessage('');
  };

  // Start Batch Screening process
  const startScreening = async () => {
    if (!apiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    if (!jd.trim()) {
      setErrorMessage('Please provide a Job Description before running the screening agent.');
      return;
    }

    const totalWeight = weights.skills + weights.experience + weights.education + weights.culturalFit;
    if (totalWeight !== 100) {
      setErrorMessage('Screening weights must equal exactly 100%. Please adjust evaluation weights.');
      return;
    }

    // Identify pending files
    const pendingFiles = files.filter(f => f.status !== 'completed');
    if (pendingFiles.length === 0) {
      setErrorMessage('No resumes in the queue to process.');
      return;
    }

    setIsScreening(true);
    setErrorMessage('');

    // Process files sequentially to respect API rate limits and update progress in real-time
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status === 'completed') continue;

      // Update file status to 'parsing'
      updateFileStatus(file.id, 'parsing');

      try {
        // Step 1: Parse the file client-side
        const parsedPayload = await parseResumeFile(file.rawFile);

        // Update status to 'screening'
        updateFileStatus(file.id, 'screening');

        // Step 2: Screen via Gemini
        const result = await screenResume({
          apiKey,
          jobDescription: jd,
          weights,
          fileData: parsedPayload
        });

        // Update status to 'completed'
        updateFileStatus(file.id, 'completed');

        // Append to candidates list
        setCandidates((prev) => {
          // Prevent duplicating candidates based on name/email
          const filtered = prev.filter(c => c.email !== result.email || c.candidateName !== result.candidateName);
          return [...filtered, result];
        });

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        updateFileStatus(file.id, 'error', error.message || 'Screening failed');
      }
    }

    setIsScreening(false);
  };

  const updateFileStatus = (id, status, errorMsg = null) => {
    setFiles((prev) => prev.map((f) => {
      if (f.id === id) {
        return { ...f, status, error: errorMsg };
      }
      return f;
    }));
  };

  // Export ranked shortlist as CSV
  const handleExportShortlist = () => {
    if (candidates.length === 0) return;

    // Sort candidates by score first
    const sorted = [...candidates].sort((a, b) => b.scores.overall - a.scores.overall);

    const headers = [
      'Rank', 
      'Candidate Name', 
      'Email', 
      'Phone', 
      'Recommendation', 
      'Overall Match (%)', 
      'Skills Score', 
      'Experience Score', 
      'Education Score', 
      'Cultural Fit Score',
      'Years of Experience'
    ];

    const rows = sorted.map((c, index) => [
      index + 1,
      `"${c.candidateName.replace(/"/g, '""')}"`,
      `"${c.email || 'N/A'}"`,
      `"${c.phone || 'N/A'}"`,
      `"${c.recommendation}"`,
      c.scores.overall,
      c.scores.skills,
      c.scores.experience,
      c.scores.education,
      c.scores.culturalFit,
      c.yearsOfExperience
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ranked_candidate_shortlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Top Navigation / Header */}
      <header className="app-header glass-panel">
        <div className="logo-wrapper">
          <BrainCircuit size={28} className="text-accent-primary animate-pulse-glow" />
          <h1 className="text-gradient">AI Resume Screening Agent</h1>
        </div>

        <div className="header-actions">
          <div className={`api-status-badge ${apiKey ? 'active' : 'inactive'}`}>
            <span className="pulse-dot" />
            <span>Gemini 1.5 Flash: {apiKey ? 'Connected' : 'Setup Required'}</span>
          </div>

          <button 
            type="button" 
            onClick={() => setIsKeyModalOpen(true)}
            className="btn btn-secondary btn-icon"
            title="Configure API Settings"
          >
            <Settings size={16} /> API Key
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="app-layout">
        
        {/* Left Hand side configuration sidebar */}
        <section className="app-sidebar">
          {errorMessage && (
            <div className="error-banner glass-panel animate-fade-in">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <JobDescriptionForm 
            jd={jd} 
            setJd={setJd} 
            weights={weights} 
            setWeights={setWeights} 
          />
        </section>

        {/* Right Hand side content pool & results panel */}
        <section className="app-main-content">
          <div className="content-grid-stack">
            
            {/* Step 1: Resume Upload queue */}
            <ResumeUploader 
              files={files} 
              setFiles={setFiles} 
              onStartScreening={startScreening} 
              isScreening={isScreening}
              disabled={isScreening}
            />

            {/* Step 2: Pool Analytics Dash */}
            {candidates.length > 0 && (
              <AnalyticsDashboard candidates={candidates} />
            )}

            {/* Step 3: Candidate Ranked Output Table */}
            <CandidateList 
              candidates={candidates} 
              onSelectCandidate={setSelectedCandidate} 
              onExportShortlist={handleExportShortlist}
            />
          </div>
        </section>

      </main>

      {/* API Configuration Overlay */}
      <APIKeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)} 
        onSave={handleSaveApiKey} 
        currentKey={apiKey}
      />

      {/* Detailed Candidate Analysis Drawer */}
      <CandidateDetail 
        candidate={selectedCandidate} 
        onClose={() => setSelectedCandidate(null)} 
      />
    </div>
  );
}
