import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { validateApiKey } from '../utils/geminiClient';

export default function APIKeyModal({ isOpen, onClose, onSave, currentKey }) {
  const [keyInput, setKeyInput] = useState(currentKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    if (isOpen) {
      setKeyInput(currentKey || '');
      setValidationStatus(null);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleValidateAndSave = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setValidationStatus('error');
      return;
    }

    setIsValidating(true);
    setValidationStatus(null);

    const isValid = await validateApiKey(keyInput.trim());
    setIsValidating(false);

    if (isValid) {
      setValidationStatus('success');
      onSave(keyInput.trim());
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setValidationStatus('error');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel card-header-glow animate-fade-in">
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="icon-badge accent">
              <Key size={20} className="text-accent-primary" />
            </div>
            <h2>Configure Gemini API Key</h2>
          </div>
        </div>

        <form onSubmit={handleValidateAndSave} className="modal-body">
          <p className="modal-description">
            To analyze resumes, this application uses Google's <strong>Gemini 1.5 Flash</strong>. 
            Your API key is stored securely inside your browser's local storage and is never sent to any external server other than Google's official Gemini endpoint.
          </p>

          <div className="api-key-link-wrapper">
            <span>Don't have a key?</span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-link"
            >
              Get a free Gemini API Key from Google AI Studio <ExternalLink size={12} />
            </a>
          </div>

          <div className="form-group">
            <label className="form-label">Gemini API Key</label>
            <div className="input-with-icon">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="form-input"
                autoFocus
              />
            </div>
          </div>

          {validationStatus === 'error' && (
            <div className="api-status-box error animate-fade-in">
              <AlertCircle size={16} />
              <span>Invalid API key or network connection issue. Please double-check and try again.</span>
            </div>
          )}

          {validationStatus === 'success' && (
            <div className="api-status-box success animate-fade-in">
              <CheckCircle size={16} />
              <span>API key validated successfully! Saving...</span>
            </div>
          )}

          <div className="modal-footer">
            {currentKey && (
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-secondary"
                disabled={isValidating}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isValidating || !keyInput.trim()}
            >
              {isValidating ? 'Validating Key...' : 'Validate & Save'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(4, 5, 9, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 520px;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
        }

        .modal-header {
          padding: 24px 24px 16px 24px;
        }

        .modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-title-wrapper h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .modal-body {
          padding: 0 24px 24px 24px;
        }

        .modal-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .api-key-link-wrapper {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          font-size: 0.8rem;
          margin-bottom: 24px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .api-key-link-wrapper span {
          color: var(--text-tertiary);
        }

        .inline-link {
          color: var(--accent-primary);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .inline-link:hover {
          text-decoration: underline;
          color: var(--accent-secondary);
        }

        .api-status-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.825rem;
          margin-bottom: 20px;
          border: 1px solid transparent;
        }

        .api-status-box.error {
          background: var(--color-error-bg);
          border-color: var(--color-error-border);
          color: var(--color-error);
        }

        .api-status-box.success {
          background: var(--color-success-bg);
          border-color: var(--color-success-border);
          color: var(--color-success);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
