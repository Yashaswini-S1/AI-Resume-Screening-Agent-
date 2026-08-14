import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, Play, CheckCircle, AlertCircle, Loader, HelpCircle } from 'lucide-react';

export default function ResumeUploader({ 
  files, 
  setFiles, 
  onStartScreening, 
  isScreening, 
  screeningProgress,
  disabled
}) {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFiles = (newFiles) => {
    const validExtensions = ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
    const addedFiles = [];

    Array.from(newFiles).forEach((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (validExtensions.includes(ext)) {
        // Prevent duplicate file names
        if (!files.some(f => f.name === file.name)) {
          addedFiles.push({
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            size: file.size,
            type: ext,
            rawFile: file,
            status: 'pending', // 'pending' | 'parsing' | 'screening' | 'completed' | 'error'
            error: null
          });
        }
      }
    });

    if (addedFiles.length > 0) {
      setFiles((prev) => [...prev, ...addedFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const clearQueue = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success animate-fade-in" />;
      case 'error':
        return <AlertCircle size={16} className="text-error animate-fade-in" />;
      case 'parsing':
      case 'screening':
        return <Loader size={16} className="text-accent-primary animate-spin" />;
      default:
        return <HelpCircle size={16} className="text-tertiary" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'error': return 'badge-error';
      case 'parsing':
      case 'screening': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const totalFiles = files.length;
  const processedFilesCount = files.filter(f => f.status === 'completed' || f.status === 'error').length;
  const progressPercent = totalFiles > 0 ? Math.round((processedFilesCount / totalFiles) * 100) : 0;

  return (
    <div className="uploader-card glass-panel card-header-glow">
      <div className="uploader-header">
        <div className="header-title">
          <UploadCloud size={18} className="text-accent-primary" />
          <h3>Resume Pool</h3>
        </div>
        {files.length > 0 && !isScreening && (
          <button 
            type="button" 
            onClick={clearQueue} 
            className="btn btn-secondary btn-sm"
          >
            Clear Pool
          </button>
        )}
      </div>

      <div className="uploader-body">
        {/* Drag & Drop Area */}
        <div 
          className={`dropzone ${isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            disabled={disabled}
          />
          <UploadCloud size={40} className="upload-icon text-accent-primary" />
          <div className="dropzone-text">
            <span className="primary-text">Drag & Drop Resumes here</span>
            <span className="secondary-text">or click to browse files from your computer</span>
            <span className="formats-text">Supports PDF, DOCX, TXT, PNG, JPG (Max 10+ resumes)</span>
          </div>
        </div>

        {/* Queued Files List */}
        {files.length > 0 && (
          <div className="queue-section">
            <div className="queue-summary">
              <span>{files.length} Candidates loaded</span>
              {isScreening && (
                <span className="progress-label">
                  Processing: {processedFilesCount} / {totalFiles} ({progressPercent}%)
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {isScreening && (
              <div className="batch-progress-bar-container">
                <div className="batch-progress-bar" style={{ width: `${progressPercent}%` }} />
              </div>
            )}

            <div className="file-list">
              {files.map((file) => (
                <div key={file.id} className="file-item glass-panel">
                  <div className="file-info">
                    <FileText size={18} className="text-accent-secondary" />
                    <div className="file-meta">
                      <span className="file-name" title={file.name}>{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                  </div>

                  <div className="file-actions">
                    <span className={`badge ${getStatusBadgeClass(file.status)}`}>
                      {file.status}
                    </span>
                    {getStatusIcon(file.status)}
                    
                    {!isScreening && (
                      <button 
                        type="button" 
                        onClick={() => removeFile(file.id)}
                        className="delete-btn"
                        title="Remove Candidate"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Trigger */}
            <div className="action-row">
              <button
                type="button"
                className="btn btn-primary btn-full animate-glow"
                disabled={isScreening || files.filter(f => f.status !== 'completed').length === 0 || disabled}
                onClick={onStartScreening}
              >
                {isScreening ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Screening Candidate Resumes...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run Automated AI Screening
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .uploader-card {
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .uploader-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .dropzone {
          border: 2px dashed var(--card-border);
          border-radius: var(--radius-md);
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-normal);
          background: rgba(255, 255, 255, 0.01);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .dropzone:hover, .dropzone.drag-active {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
        }

        .dropzone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .upload-icon {
          transition: transform var(--transition-normal);
        }

        .dropzone:hover .upload-icon {
          transform: translateY(-4px);
        }

        .dropzone-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .primary-text {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .secondary-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .formats-text {
          font-size: 0.725rem;
          color: var(--text-tertiary);
          margin-top: 8px;
        }

        .queue-section {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .queue-summary {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .batch-progress-bar-container {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }

        .batch-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 99px;
          width: 0%;
          transition: width 0.4s ease;
        }

        .file-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0; /* Enable flex-truncation */
        }

        .file-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .file-name {
          font-size: 0.825rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 0.725rem;
          color: var(--text-tertiary);
        }

        .file-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .badge-neutral {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .delete-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all var(--transition-fast);
        }

        .delete-btn:hover {
          color: var(--color-error);
          background: var(--color-error-bg);
        }

        .btn-full {
          width: 100%;
        }

        .action-row {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
