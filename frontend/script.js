// Core State Management
let apiKey = '';
let jobsList = [];
let activeJob = null;
let weights = { skills: 40, experience: 30, education: 20, culturalFit: 10 };
let uploadedFiles = []; // { id, name, size, type, file, status, error }
let screenedCandidates = [];
let activeCandidate = null;

// Sort Configuration
let currentSortField = 'score';
let currentSortOrder = 'desc'; // 'asc' | 'desc'

// Sample Job Descriptions
const SAMPLE_JDS = [
  {
    title: "Senior Full Stack Engineer (React/Node)",
    content: `Position: Senior Full Stack Engineer\nExperience: 5+ years of software engineering experience.\nLocation: Remote / Hybrid\n\nTechnical Requirements:\n- Expert level proficiency in React.js and modern state management (Redux, Context API).\n- Strong experience in Node.js, Express, and backend APIs.\n- Experience with databases like PostgreSQL, MongoDB, or Redis.\n- Familiarity with TypeScript and modern ES6+ JavaScript.\n- Experience with cloud providers (AWS, GCP) and CI/CD pipelines (GitHub Actions, Docker).\n\nPreferred Qualifications:\n- Solid understanding of Web Performance Optimization and accessibility (a11y).\n- Excellent written and verbal communication skills.\n- Bachelor's degree in Computer Science or a related engineering field.`
  },
  {
    title: "AI/ML Product Manager",
    content: `Position: Product Manager, Artificial Intelligence\nExperience: 3+ years managing AI/ML powered features or software products.\nLocation: San Francisco, CA / Hybrid\n\nKey Responsibilities:\n- Define product strategy and roadmap for our LLM-powered agent tools.\n- Collaborate with Machine Learning engineers and Data Scientists to design model evaluations.\n- Author clear, structured Product Requirement Documents (PRDs).\n- Communicate roadmap and performance metrics to executive leadership.\n\nQualifications:\n- Strong analytical skills; experience writing SQL queries and interpreting data dashboards.\n- Deep understanding of NLP, Generative AI models (Gemini, GPT), and prompt engineering.\n- Excellent stakeholder communication skills.\n- MBA or Technical Degree (Computer Science, Data Science, Math) preferred.`
  }
];

// Document Elements
const els = {
  apiStatus: document.getElementById('api-status'),
  apiStatusText: document.getElementById('api-status-text'),
  btnSettings: document.getElementById('btn-settings'),
  settingsModal: document.getElementById('settings-modal'),
  settingsForm: document.getElementById('settings-form'),
  inputApiKey: document.getElementById('input-api-key'),
  btnSettingsCancel: document.getElementById('btn-settings-cancel'),
  apiValidateError: document.getElementById('api-validate-error'),
  apiValidateSuccess: document.getElementById('api-validate-success'),
  
  jdTextarea: document.getElementById('jd-textarea'),
  jobSelect: document.getElementById('job-select'),
  btnSaveJob: document.getElementById('btn-save-job'),
  btnNewJob: document.getElementById('btn-new-job'),
  btnDeleteJob: document.getElementById('btn-delete-job'),
  newJobModal: document.getElementById('new-job-modal'),
  newJobForm: document.getElementById('new-job-form'),
  inputJobTitle: document.getElementById('input-job-title'),
  btnNewJobCancel: document.getElementById('btn-new-job-cancel'),
  btnNewJobSave: document.getElementById('btn-new-job-save'),
  
  sliderSkills: document.getElementById('slider-skills'),
  sliderExperience: document.getElementById('slider-experience'),
  sliderEducation: document.getElementById('slider-education'),
  sliderCultural: document.getElementById('slider-cultural'),
  
  labelSkills: document.getElementById('label-skills'),
  labelExperience: document.getElementById('label-experience'),
  labelEducation: document.getElementById('label-education'),
  labelCultural: document.getElementById('label-cultural'),
  
  segmentSkills: document.getElementById('segment-skills'),
  segmentExperience: document.getElementById('segment-experience'),
  segmentEducation: document.getElementById('segment-education'),
  segmentCultural: document.getElementById('segment-cultural'),
  
  totalWeightText: document.getElementById('total-weight-text'),
  btnBalance: document.getElementById('btn-balance'),
  errorBanner: document.getElementById('error-banner'),
  errorText: document.getElementById('error-text'),
  
  dropzone: document.getElementById('dropzone'),
  fileInput: document.getElementById('file-input'),
  btnClearPool: document.getElementById('btn-clear-pool'),
  queueSection: document.getElementById('queue-section'),
  queueCountText: document.getElementById('queue-count-text'),
  progressLabel: document.getElementById('progress-label'),
  batchProgressBarContainer: document.getElementById('batch-progress-bar-container'),
  batchProgressBar: document.getElementById('batch-progress-bar'),
  fileList: document.getElementById('file-list'),
  btnRunScreening: document.getElementById('btn-run-screening'),
  
  analyticsCard: document.getElementById('analytics-card'),
  metricTotalCount: document.getElementById('metric-total-count'),
  metricAvgScore: document.getElementById('metric-avg-score'),
  metricStrongCount: document.getElementById('metric-strong-count'),
  distStrong: document.getElementById('dist-strong'),
  distPotential: document.getElementById('dist-potential'),
  distLow: document.getElementById('dist-low'),
  legendStrongText: document.getElementById('legend-strong-text'),
  legendPotentialText: document.getElementById('legend-potential-text'),
  legendLowText: document.getElementById('legend-low-text'),
  strengthsList: document.getElementById('strengths-list'),
  gapsList: document.getElementById('gaps-list'),
  
  listCard: document.getElementById('list-card'),
  emptyListState: document.getElementById('empty-list-state'),
  listBody: document.getElementById('list-body'),
  exportActions: document.getElementById('export-actions'),
  btnExportCsv: document.getElementById('btn-export-csv'),
  btnExportJson: document.getElementById('btn-export-json'),
  searchInput: document.getElementById('search-input'),
  filterSelect: document.getElementById('filter-select'),
  candidatesTbody: document.getElementById('candidates-tbody'),
  
  thName: document.getElementById('th-name'),
  thExp: document.getElementById('th-exp'),
  thScore: document.getElementById('th-score'),
  
  detailModal: document.getElementById('detail-modal'),
  btnDetailClose: document.getElementById('btn-detail-close'),
  detailRecBadge: document.getElementById('detail-rec-badge'),
  detailName: document.getElementById('detail-name'),
  detailEmail: document.getElementById('detail-email'),
  detailPhone: document.getElementById('detail-phone'),
  detailScoreLarge: document.getElementById('detail-score-large'),
  barSkills: document.getElementById('bar-skills'),
  barExperience: document.getElementById('bar-experience'),
  barEducation: document.getElementById('bar-education'),
  barCultural: document.getElementById('bar-cultural'),
  valSkills: document.getElementById('val-skills'),
  valExperience: document.getElementById('val-experience'),
  valEducation: document.getElementById('val-education'),
  valCultural: document.getElementById('val-cultural'),
  titleSkillsMatched: document.getElementById('title-skills-matched'),
  titleSkillsMissing: document.getElementById('title-skills-missing'),
  detailSkillsMatched: document.getElementById('detail-skills-matched'),
  detailSkillsMissing: document.getElementById('detail-skills-missing'),
  detailYearsBadge: document.getElementById('detail-years-badge'),
  detailExpSummary: document.getElementById('detail-exp-summary'),
  detailEduSummary: document.getElementById('detail-edu-summary'),
  detailCertSection: document.getElementById('detail-cert-section'),
  detailCertifications: document.getElementById('detail-certifications'),
  detailReasoning: document.getElementById('detail-reasoning'),
  btnExportProfile: document.getElementById('btn-export-profile')
};

// Initial Setup on Page Load
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Setup Event Handlers
  setupWeightsListeners();
  setupSettingsModalHandlers();
  setupJobManagerHandlers();
  setupDropzoneHandlers();
  setupQueueActionHandlers();
  setupListControlsHandlers();
  setupDetailModalHandlers();

  // Load API Key and check server environment configuration
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) {
    apiKey = savedKey;
    updateAPIStatusBadge(true);
    fetchJobs();
  } else {
    checkServerConfig();
  }
});

// Helper: Toggle Visibility
function toggleElement(el, visible) {
  if (visible) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function toggleModal(modal, open) {
  toggleElement(modal, open);
}

// API Key Management UI
function updateAPIStatusBadge(active, isServer = false) {
  if (active) {
    els.apiStatus.className = 'api-status-badge active';
    els.apiStatusText.textContent = isServer ? 'Gemini 1.5 Flash: Connected (Server)' : 'Gemini 1.5 Flash: Connected';
  } else {
    els.apiStatus.className = 'api-status-badge inactive';
    els.apiStatusText.textContent = 'Gemini 1.5 Flash: Setup Required';
  }
}

async function checkServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.has_gemini_key) {
      apiKey = 'SERVER_ENV';
      updateAPIStatusBadge(true, true);
      toggleModal(els.settingsModal, false);
    } else {
      toggleModal(els.settingsModal, true);
    }
  } catch (err) {
    toggleModal(els.settingsModal, true);
  }
  
  // Load job positions
  fetchJobs();
}

function setupSettingsModalHandlers() {
  els.btnSettings.addEventListener('click', () => {
    els.inputApiKey.value = apiKey;
    els.apiValidateError.classList.add('hidden');
    els.apiValidateSuccess.classList.add('hidden');
    toggleModal(els.settingsModal, true);
  });

  els.btnSettingsCancel.addEventListener('click', () => {
    toggleModal(els.settingsModal, false);
  });

  els.settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const keyVal = els.inputApiKey.value.trim();
    if (!keyVal) return;

    toggleElement(els.apiValidateError, false);
    toggleElement(els.apiValidateSuccess, false);
    
    // Validate by executing a dummy check on the local backend (using the header check)
    els.btnSettingsSave.disabled = true;
    els.btnSettingsSave.textContent = 'Validating Key...';

    try {
      // Direct validate endpoint or dummy query
      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'X-Gemini-API-Key': keyVal },
        body: getDummyFormData()
      });

      // Status 400 is fine if the error is "no resume files" (since key worked!)
      // Status 400 with "API Key is missing/invalid" indicates failure.
      let valid = response.status === 400 || response.status === 200;
      if (response.status === 400) {
        const errData = await response.json();
        if (errData.detail && errData.detail.includes('API Key is missing')) {
          valid = false;
        }
      }

      if (valid) {
        apiKey = keyVal;
        localStorage.setItem('gemini_api_key', apiKey);
        updateAPIStatusBadge(true);
        toggleElement(els.apiValidateSuccess, true);
        setTimeout(() => {
          toggleModal(els.settingsModal, false);
        }, 1000);
      } else {
        toggleElement(els.apiValidateError, true);
      }
    } catch (err) {
      toggleElement(els.apiValidateError, true);
    } finally {
      els.btnSettingsSave.disabled = false;
      els.btnSettingsSave.textContent = 'Validate & Save';
    }
  });
}

function getDummyFormData() {
  const fd = new FormData();
  fd.append('job_description', 'React Developer');
  fd.append('weights_json', JSON.stringify(weights));
  // Empty files list to trigger validation error without file uploading
  return fd;
}

// Weights Slider Actions
function setupWeightsListeners() {
  const sliders = ['skills', 'experience', 'education', 'cultural'];
  
  sliders.forEach(s => {
    const slider = document.getElementById(`slider-${s}`);
    slider.addEventListener('input', (e) => {
      weights[s === 'cultural' ? 'culturalFit' : s] = parseInt(e.target.value, 10);
      updateWeightsUI();
    });
  });

  els.btnBalance.addEventListener('click', autoBalanceWeights);
}

function updateWeightsUI() {
  const total = weights.skills + weights.experience + weights.education + weights.culturalFit;
  
  els.labelSkills.textContent = `${weights.skills}%`;
  els.labelExperience.textContent = `${weights.experience}%`;
  els.labelEducation.textContent = `${weights.education}%`;
  els.labelCultural.textContent = `${weights.culturalFit}%`;
  
  els.segmentSkills.style.width = `${(weights.skills / (total || 1)) * 100}%`;
  els.segmentExperience.style.width = `${(weights.experience / (total || 1)) * 100}%`;
  els.segmentEducation.style.width = `${(weights.education / (total || 1)) * 100}%`;
  els.segmentCultural.style.width = `${(weights.culturalFit / (total || 1)) * 100}%`;
  
  els.totalWeightText.textContent = `${total}%`;
  
  if (total === 100) {
    els.totalWeightText.className = 'text-success';
    toggleElement(els.btnBalance, false);
  } else {
    els.totalWeightText.className = 'text-error';
    toggleElement(els.btnBalance, true);
  }
}

function autoBalanceWeights() {
  const sum = weights.skills + weights.experience + weights.education + weights.culturalFit;
  if (sum === 0) {
    weights = { skills: 25, experience: 25, education: 25, culturalFit: 25 };
  } else {
    const factor = 100 / sum;
    const s = Math.round(weights.skills * factor);
    const exp = Math.round(weights.experience * factor);
    const edu = Math.round(weights.education * factor);
    const fit = 100 - (s + exp + edu);
    
    weights = {
      skills: Math.max(0, s),
      experience: Math.max(0, exp),
      education: Math.max(0, edu),
      culturalFit: Math.max(0, fit)
    };
  }

  els.sliderSkills.value = weights.skills;
  els.sliderExperience.value = weights.experience;
  els.sliderEducation.value = weights.education;
  els.sliderCultural.value = weights.culturalFit;
  
  updateWeightsUI();
}

// Job positions management and actions
async function fetchJobs() {
  try {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    jobsList = await res.json();
    populateJobDropdown();
  } catch (err) {
    showError('Error loading job positions: ' + err.message);
  }
}

function populateJobDropdown() {
  els.jobSelect.innerHTML = '';
  if (jobsList.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '-- No Positions Created --';
    els.jobSelect.appendChild(opt);
    return;
  }
  
  jobsList.forEach(job => {
    const opt = document.createElement('option');
    opt.value = job.id;
    opt.textContent = job.title;
    els.jobSelect.appendChild(opt);
  });

  const lastActiveId = localStorage.getItem('active_job_id');
  const found = jobsList.find(j => j.id === lastActiveId);
  if (found) {
    els.jobSelect.value = found.id;
    selectJob(found.id);
  } else if (jobsList.length > 0) {
    els.jobSelect.value = jobsList[0].id;
    selectJob(jobsList[0].id);
  }
}

async function selectJob(jobId) {
  const job = jobsList.find(j => j.id === jobId);
  if (!job) return;
  activeJob = job;
  localStorage.setItem('active_job_id', jobId);
  
  els.jdTextarea.value = job.description;
  weights = { ...job.weights };
  
  els.sliderSkills.value = weights.skills;
  els.sliderExperience.value = weights.experience;
  els.sliderEducation.value = weights.education;
  els.sliderCultural.value = weights.culturalFit;
  updateWeightsUI();
  
  uploadedFiles = [];
  renderQueueList();
  
  try {
    const res = await fetch(`/api/jobs/${jobId}/candidates`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    screenedCandidates = await res.json();
    renderCandidateList();
    renderAnalytics();
  } catch (err) {
    console.error('Error fetching candidates:', err);
    screenedCandidates = [];
    renderCandidateList();
    renderAnalytics();
  }
}

function setupJobManagerHandlers() {
  els.jobSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      selectJob(e.target.value);
    }
  });

  els.btnSaveJob.addEventListener('click', async () => {
    if (!activeJob) return;
    
    const total = weights.skills + weights.experience + weights.education + weights.culturalFit;
    if (total !== 100) {
      showError('Evaluation weights must sum up to exactly 100%. Click Auto-Balance to fix.');
      return;
    }
    
    els.btnSaveJob.disabled = true;
    els.btnSaveJob.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width:12px; height:12px;"></i> Saving...';
    lucide.createIcons();
    
    try {
      const res = await fetch(`/api/jobs/${activeJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeJob.title,
          description: els.jdTextarea.value,
          weights: weights
        })
      });
      if (!res.ok) throw new Error('Failed to update job details');
      const updatedJob = await res.json();
      
      jobsList = jobsList.map(j => j.id === updatedJob.id ? updatedJob : j);
      activeJob = updatedJob;
      showSuccessBanner('Job position requirements and weights successfully saved.');
    } catch (err) {
      showError('Error saving job details: ' + err.message);
    } finally {
      els.btnSaveJob.disabled = false;
      els.btnSaveJob.innerHTML = '<i data-lucide="save" style="width:12px; height:12px;"></i> Save';
      lucide.createIcons();
    }
  });

  els.btnNewJob.addEventListener('click', () => {
    els.inputJobTitle.value = '';
    toggleModal(els.newJobModal, true);
  });

  els.btnNewJobCancel.addEventListener('click', () => {
    toggleModal(els.newJobModal, false);
  });

  els.newJobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = els.inputJobTitle.value.trim();
    if (!title) return;
    
    els.btnNewJobSave.disabled = true;
    els.btnNewJobSave.textContent = 'Creating...';
    
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: '',
          weights: { skills: 40, experience: 30, education: 20, culturalFit: 10 }
        })
      });
      if (!res.ok) throw new Error('Failed to create job');
      const newJob = await res.json();
      
      jobsList.push(newJob);
      populateJobDropdown();
      els.jobSelect.value = newJob.id;
      selectJob(newJob.id);
      
      toggleModal(els.newJobModal, false);
      showSuccessBanner(`Job position "${title}" created successfully.`);
    } catch (err) {
      showError('Error creating job position: ' + err.message);
    } finally {
      els.btnNewJobSave.disabled = false;
      els.btnNewJobSave.textContent = 'Create Position';
    }
  });

  els.btnDeleteJob.addEventListener('click', async () => {
    if (!activeJob) return;
    if (!confirm(`Are you sure you want to delete the job position "${activeJob.title}"? This will delete all of its requirements and candidate screening results permanently.`)) {
      return;
    }
    
    els.btnDeleteJob.disabled = true;
    
    try {
      const res = await fetch(`/api/jobs/${activeJob.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete job');
      
      jobsList = jobsList.filter(j => j.id !== activeJob.id);
      populateJobDropdown();
      showSuccessBanner('Job position deleted successfully.');
    } catch (err) {
      showError('Error deleting job position: ' + err.message);
    } finally {
      els.btnDeleteJob.disabled = false;
    }
  });
}

function showSuccessBanner(msg) {
  els.errorBanner.className = 'error-banner glass-panel';
  els.errorBanner.style.borderColor = 'var(--color-success-border)';
  els.errorBanner.style.background = 'var(--color-success-bg)';
  els.errorText.style.color = 'var(--color-success)';
  els.errorText.textContent = msg;
  els.errorBanner.classList.remove('hidden');
  
  setTimeout(() => {
    clearErrors();
  }, 4000);
}

// Drag & Drop Resume Pool
function setupDropzoneHandlers() {
  els.dropzone.addEventListener('click', () => {
    els.fileInput.click();
  });

  els.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFilesAdded(e.target.files);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    els.dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.dropzone.classList.add('drag-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    els.dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.dropzone.classList.remove('drag-active');
    }, false);
  });

  els.dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  });
}

function handleFilesAdded(fileList) {
  const allowedExts = ['pdf', 'docx', 'txt'];
  
  Array.from(fileList).forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (allowedExts.includes(ext)) {
      // Avoid duplicate names
      if (!uploadedFiles.some(f => f.name === file.name)) {
        uploadedFiles.push({
          id: `${file.name}-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: ext,
          fileObject: file,
          status: 'pending',
          error: null
        });
      }
    }
  });

  renderQueueList();
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function renderQueueList() {
  if (uploadedFiles.length === 0) {
    toggleElement(els.queueSection, false);
    toggleElement(els.btnClearPool, false);
    return;
  }

  toggleElement(els.queueSection, true);
  toggleElement(els.btnClearPool, true);
  els.queueCountText.textContent = `${uploadedFiles.length} Candidates loaded`;

  els.fileList.innerHTML = '';
  uploadedFiles.forEach(f => {
    const div = document.createElement('div');
    div.className = 'file-item glass-panel';
    div.innerHTML = `
      <div class="file-info">
        <i data-lucide="file-text" class="text-accent-secondary"></i>
        <div class="file-meta">
          <span class="file-name" title="${f.name}">${f.name}</span>
          <span class="file-size">${formatFileSize(f.size)}</span>
        </div>
      </div>
      <div class="file-actions">
        <span class="badge ${getStatusBadgeClass(f.status)}">${f.status}</span>
        ${getStatusIcon(f.status)}
        ${f.status === 'pending' ? `<button class="delete-btn" data-id="${f.id}"><i data-lucide="trash-2"></i></button>` : ''}
      </div>
    `;
    els.fileList.appendChild(div);
  });

  // Attach delete click handlers
  const deleteButtons = els.fileList.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      uploadedFiles = uploadedFiles.filter(f => f.id !== id);
      renderQueueList();
    });
  });

  lucide.createIcons();
}

function getStatusBadgeClass(status) {
  if (status === 'completed') return 'badge-success';
  if (status === 'error') return 'badge-error';
  if (status === 'parsing' || status === 'screening') return 'badge-info';
  return 'badge-neutral';
}

function getStatusIcon(status) {
  if (status === 'completed') return '<i data-lucide="check-circle" class="text-success"></i>';
  if (status === 'error') return '<i data-lucide="alert-circle" class="text-error"></i>';
  if (status === 'parsing' || status === 'screening') return '<i data-lucide="loader" class="text-accent-primary animate-spin"></i>';
  return '';
}

// Queue action triggers
function setupQueueActionHandlers() {
  els.btnClearPool.addEventListener('click', () => {
    uploadedFiles = [];
    renderQueueList();
  });

  els.btnRunScreening.addEventListener('click', executeBatchScreening);
}

// Batch Server API request execution
async function executeBatchScreening() {
  if (!apiKey) {
    toggleModal(els.settingsModal, true);
    return;
  }

  const jdText = els.jdTextarea.value.trim();
  if (!jdText) {
    showError('Please provide a Job Description before running the screening agent.');
    return;
  }

  const total = weights.skills + weights.experience + weights.education + weights.culturalFit;
  if (total !== 100) {
    showError('Evaluation weights must sum up to exactly 100%. Click Auto-Balance to fix.');
    return;
  }

  const pendingList = uploadedFiles.filter(f => f.status !== 'completed');
  if (pendingList.length === 0) {
    showError('No files to process in the pool.');
    return;
  }

  clearErrors();
  
  // Update uploader UI states
  toggleElement(els.progressLabel, true);
  toggleElement(els.batchProgressBarContainer, true);
  els.btnRunScreening.disabled = true;
  els.btnRunScreening.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Running AI Matcher Pipeline...';
  lucide.createIcons();

  // Mark all pending files as screening on uploader UI
  uploadedFiles = uploadedFiles.map(f => f.status !== 'completed' ? { ...f, status: 'screening' } : f);
  renderQueueList();

  const formData = new FormData();
  formData.append('job_id', activeJob ? activeJob.id : 'default');
  formData.append('job_description', jdText);
  formData.append('weights_json', JSON.stringify(weights));
  
  pendingList.forEach(f => {
    formData.append('files', f.fileObject);
  });

  // Set progressive status
  els.progressLabel.textContent = `Processing: 0 / ${pendingList.length} files...`;
  els.batchProgressBar.style.width = '20%';

  try {
    const headers = {};
    if (apiKey && apiKey !== 'SERVER_ENV') {
      headers['X-Gemini-API-Key'] = apiKey;
    }

    const response = await fetch('/api/screen', {
      method: 'POST',
      headers: headers,
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to screen batch');
    }

    const data = await response.json();

    // Map response statuses back to queue list
    const candidates = data.candidates || [];
    const errorsList = data.errors || [];

    uploadedFiles = uploadedFiles.map(f => {
      // Check if it failed
      const matchedErr = errorsList.find(err => err.file === f.name);
      if (matchedErr) {
        return { ...f, status: 'error', error: matchedErr.error };
      }
      return { ...f, status: 'completed' };
    });

    // Update state candidates
    screenedCandidates = candidates;
    
    // Render
    renderQueueList();
    renderAnalytics();
    renderCandidateList();

    // Reset uploader UI
    els.batchProgressBar.style.width = '100%';
    setTimeout(() => {
      toggleElement(els.progressLabel, false);
      toggleElement(els.batchProgressBarContainer, false);
    }, 1000);

  } catch (err) {
    showError(`Screening Error: ${err.message}`);
    uploadedFiles = uploadedFiles.map(f => f.status === 'screening' ? { ...f, status: 'error', error: err.message } : f);
    renderQueueList();
  } finally {
    els.btnRunScreening.disabled = false;
    els.btnRunScreening.innerHTML = '<i data-lucide="play"></i> Run Automated AI Screening';
    lucide.createIcons();
  }
}

// Error Helpers
function showError(msg) {
  els.errorBanner.className = 'error-banner glass-panel';
  els.errorBanner.style.borderColor = 'var(--color-error-border)';
  els.errorBanner.style.background = 'var(--color-error-bg)';
  els.errorText.style.color = 'var(--color-error)';
  els.errorText.textContent = msg;
  toggleElement(els.errorBanner, true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearErrors() {
  toggleElement(els.errorBanner, false);
  els.errorBanner.style.borderColor = '';
  els.errorBanner.style.background = '';
  els.errorText.style.color = '';
}

// Analytics Visualiser
function renderAnalytics() {
  if (screenedCandidates.length === 0) {
    toggleElement(els.analyticsCard, false);
    return;
  }

  toggleElement(els.analyticsCard, true);

  const total = screenedCandidates.length;
  const avg = Math.round(screenedCandidates.reduce((sum, c) => sum + c.scores.overall, 0) / total);
  
  const strong = screenedCandidates.filter(c => c.recommendation === 'Strong Match').length;
  const potential = screenedCandidates.filter(c => c.recommendation === 'Potential Match').length;
  const low = screenedCandidates.filter(c => c.recommendation === 'Low Match').length;

  const strongPct = Math.round((strong / total) * 100);
  const potentialPct = Math.round((potential / total) * 100);
  const lowPct = 100 - (strongPct + potentialPct);

  // Key cards
  els.metricTotalCount.textContent = total;
  els.metricAvgScore.textContent = `${avg}%`;
  els.metricStrongCount.textContent = strong;

  // Distribution bar
  els.distStrong.style.width = `${(strong / total) * 100}%`;
  els.distPotential.style.width = `${(potential / total) * 100}%`;
  els.distLow.style.width = `${(low / total) * 100}%`;

  els.legendStrongText.innerHTML = `Strong: <strong>${strong}</strong> (${strongPct}%)`;
  els.legendPotentialText.innerHTML = `Potential: <strong>${potential}</strong> (${potentialPct}%)`;
  els.legendLowText.innerHTML = `Low Match: <strong>${low}</strong> (${lowPct}%)`;

  // Skills aggregation strengths/gaps
  const matchedSkillsMap = {};
  const missingSkillsMap = {};

  screenedCandidates.forEach(c => {
    c.skillsMatched.forEach(s => {
      const name = s.trim().toLowerCase();
      matchedSkillsMap[name] = (matchedSkillsMap[name] || 0) + 1;
    });
    c.skillsMissing.forEach(s => {
      const name = s.trim().toLowerCase();
      missingSkillsMap[name] = (missingSkillsMap[name] || 0) + 1;
    });
  });

  const sortedMatched = Object.entries(matchedSkillsMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sortedMissing = Object.entries(missingSkillsMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  els.strengthsList.innerHTML = '';
  if (sortedMatched.length === 0) {
    els.strengthsList.innerHTML = '<span class="empty-insights-text">No skills trend available</span>';
  } else {
    sortedMatched.forEach(([skill, count]) => {
      const row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML = `
        <span class="skill-name" title="${skill}">${skill}</span>
        <div class="bar-track"><div class="bar-fill matched" style="width: ${(count/total)*100}%"></div></div>
        <span class="skill-count">${count} cands</span>
      `;
      els.strengthsList.appendChild(row);
    });
  }

  els.gapsList.innerHTML = '';
  if (sortedMissing.length === 0) {
    els.gapsList.innerHTML = '<span class="empty-insights-text">No talent gap trend available</span>';
  } else {
    sortedMissing.forEach(([skill, count]) => {
      const row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML = `
        <span class="skill-name" title="${skill}">${skill}</span>
        <div class="bar-track"><div class="bar-fill missing" style="width: ${(count/total)*100}%"></div></div>
        <span class="skill-count">${count} cands</span>
      `;
      els.gapsList.appendChild(row);
    });
  }
}

// Candidate Ranked shortlist datatable
function setupListControlsHandlers() {
  els.searchInput.addEventListener('input', renderCandidateList);
  els.filterSelect.addEventListener('change', renderCandidateList);

  els.thName.addEventListener('click', () => handleSortClick('name'));
  els.thExp.addEventListener('click', () => handleSortClick('experience'));
  els.thScore.addEventListener('click', () => handleSortClick('score'));

  els.btnExportCsv.addEventListener('click', downloadShortlistCsv);
  els.btnExportJson.addEventListener('click', downloadShortlistJson);
}

function handleSortClick(field) {
  if (currentSortField === field) {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortField = field;
    currentSortOrder = 'desc';
  }
  renderCandidateList();
}

function renderCandidateList() {
  if (screenedCandidates.length === 0) {
    toggleElement(els.emptyListState, true);
    toggleElement(els.listBody, false);
    toggleElement(els.exportActions, false);
    return;
  }

  toggleElement(els.emptyListState, false);
  toggleElement(els.listBody, true);
  toggleElement(els.exportActions, true);

  const search = els.searchInput.value.toLowerCase().trim();
  const filter = els.filterSelect.value;

  const filtered = screenedCandidates
    .filter(c => {
      const matchesSearch = 
        c.candidateName.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.skillsMatched.some(s => s.toLowerCase().includes(search));
      
      const matchesFilter = filter === 'All' || c.recommendation === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (currentSortField === 'score') {
        comparison = a.scores.overall - b.scores.overall;
      } else if (currentSortField === 'experience') {
        comparison = a.yearsOfExperience - b.yearsOfExperience;
      } else if (currentSortField === 'name') {
        comparison = a.candidateName.localeCompare(b.candidateName);
      }
      return currentSortOrder === 'desc' ? -comparison : comparison;
    });

  els.candidatesTbody.innerHTML = '';
  if (filtered.length === 0) {
    els.candidatesTbody.innerHTML = `
      <tr>
        <td colspan="6" class="no-results">No candidates match your queries.</td>
      </tr>
    `;
    return;
  }

  filtered.forEach(c => {
    const tr = document.createElement('tr');
    tr.className = 'candidate-row';
    tr.innerHTML = `
      <td>
        <div class="name-cell">
          <span class="candidate-name-text">${c.candidateName}</span>
          <span class="candidate-email-text">${c.email || 'No Email'}</span>
        </div>
      </td>
      <td>
        <span class="badge ${getRecBadgeClass(c.recommendation)}">${c.recommendation}</span>
      </td>
      <td class="text-center" style="font-weight:600">
        ${c.yearsOfExperience} yrs
      </td>
      <td>
        <div class="table-scores">
          <div class="score-mini-bar" title="Skills Match: ${c.scores.skills}%">
            <i data-lucide="briefcase" class="text-accent-primary"></i>
            <div class="mini-progress-track"><div class="mini-progress-fill skills" style="width: ${c.scores.skills}%"></div></div>
          </div>
          <div class="score-mini-bar" title="Education Alignment: ${c.scores.education}%">
            <i data-lucide="graduation-cap" class="text-accent-secondary"></i>
            <div class="mini-progress-track"><div class="mini-progress-fill education" style="width: ${c.scores.education}%"></div></div>
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="overall-score-cell">
          <span class="overall-score-number ${getScoreColorClass(c.scores.overall)}">${c.scores.overall}%</span>
        </div>
      </td>
      <td>
        <i data-lucide="chevron-right" class="text-tertiary"></i>
      </td>
    `;
    tr.addEventListener('click', () => openCandidateDetail(c));
    els.candidatesTbody.appendChild(tr);
  });

  lucide.createIcons();
}

function getRecBadgeClass(rec) {
  if (rec === 'Strong Match') return 'badge-success';
  if (rec === 'Potential Match') return 'badge-warning';
  return 'badge-error';
}

function getScoreColorClass(score) {
  if (score >= 80) return 'good';
  if (score >= 60) return 'avg';
  return 'bad';
}

// Open Detail Drawer
function openCandidateDetail(candidate) {
  activeCandidate = candidate;
  
  els.detailName.textContent = candidate.candidateName;
  els.detailEmail.innerHTML = `<i data-lucide="mail"></i> ${candidate.email || 'N/A'}`;
  els.detailPhone.innerHTML = `<i data-lucide="phone"></i> ${candidate.phone || 'N/A'}`;
  
  els.detailRecBadge.textContent = candidate.recommendation;
  els.detailRecBadge.className = `badge ${getRecBadgeClass(candidate.recommendation)}`;
  
  els.detailScoreLarge.textContent = `${candidate.scores.overall}%`;
  
  // Progress score bars
  els.barSkills.style.width = `${candidate.scores.skills}%`;
  els.barExperience.style.width = `${candidate.scores.experience}%`;
  els.barEducation.style.width = `${candidate.scores.education}%`;
  els.barCultural.style.width = `${candidate.scores.culturalFit}%`;

  els.valSkills.textContent = `${candidate.scores.skills}%`;
  els.valExperience.textContent = `${candidate.scores.experience}%`;
  els.valEducation.textContent = `${candidate.scores.education}%`;
  els.valCultural.textContent = `${candidate.scores.culturalFit}%`;

  // Matched/Missing Tag clouds
  els.titleSkillsMatched.textContent = `Matched Skills (${candidate.skillsMatched.length})`;
  els.detailSkillsMatched.innerHTML = '';
  if (candidate.skillsMatched.length === 0) {
    els.detailSkillsMatched.innerHTML = '<span class="empty-tag-text">No matched skills identified</span>';
  } else {
    candidate.skillsMatched.forEach(s => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag matched';
      tag.textContent = s;
      els.detailSkillsMatched.appendChild(tag);
    });
  }

  els.titleSkillsMissing.textContent = `Missing Skills (${candidate.skillsMissing.length})`;
  els.detailSkillsMissing.innerHTML = '';
  if (candidate.skillsMissing.length === 0) {
    els.detailSkillsMissing.innerHTML = '<span class="empty-tag-text">No missing skills identified</span>';
  } else {
    candidate.skillsMissing.forEach(s => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag missing';
      tag.textContent = s;
      els.detailSkillsMissing.appendChild(tag);
    });
  }

  // Work & Education Summaries
  els.detailYearsBadge.textContent = `${candidate.yearsOfExperience} Years Total`;
  els.detailExpSummary.textContent = candidate.experienceSummary;
  els.detailEduSummary.textContent = candidate.educationSummary;

  // Certifications
  if (candidate.certifications && candidate.certifications.length > 0) {
    els.detailCertifications.innerHTML = '';
    candidate.certifications.forEach(cert => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag matched';
      tag.style.background = 'rgba(99, 102, 241, 0.08)';
      tag.style.color = '#818cf8';
      tag.style.borderColor = 'rgba(99, 102, 241, 0.15)';
      tag.textContent = cert;
      els.detailCertifications.appendChild(tag);
    });
    toggleElement(els.detailCertSection, true);
  } else {
    toggleElement(els.detailCertSection, false);
  }

  // AI Reasoning
  els.detailReasoning.textContent = candidate.explanation;

  toggleModal(els.detailModal, true);
  lucide.createIcons();
}

function setupDetailModalHandlers() {
  els.btnDetailClose.addEventListener('click', () => {
    toggleModal(els.detailModal, false);
    activeCandidate = null;
  });

  els.detailModal.addEventListener('click', () => {
    toggleModal(els.detailModal, false);
    activeCandidate = null;
  });

  els.btnExportProfile.addEventListener('click', downloadIndividualReport);
}

// Download/Export reports locally
function downloadIndividualReport() {
  if (!activeCandidate) return;

  const text = `CANDIDATE AI EVALUATION REPORT
==================================
Candidate Name: ${activeCandidate.candidateName}
Email: ${activeCandidate.email || 'N/A'}
Phone: ${activeCandidate.phone || 'N/A'}
Recommendation: ${activeCandidate.recommendation} (Score: ${activeCandidate.scores.overall}%)

FIT SCORES DETAIL:
- Skills score: ${activeCandidate.scores.skills}/100
- Experience score: ${activeCandidate.scores.experience}/100
- Education score: ${activeCandidate.scores.education}/100
- Cultural fit score: ${activeCandidate.scores.culturalFit}/100

SKILLS:
- Matched: ${activeCandidate.skillsMatched.join(', ') || 'None'}
- Missing: ${activeCandidate.skillsMissing.join(', ') || 'None'}

CERTIFICATIONS:
${activeCandidate.certifications?.join(', ') || 'None'}

EXPERIENCE YEARS: ${activeCandidate.yearsOfExperience} years
EXPERIENCE SUMMARY:
${activeCandidate.experienceSummary}

EDUCATION SUMMARY:
${activeCandidate.educationSummary}

AI EXPLAINABILITY REASONING:
${activeCandidate.explanation}
`;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${activeCandidate.candidateName.replace(/\s+/g, '_')}_evaluation_report.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Shortlist Exports in CSV and JSON formats
function downloadShortlistCsv() {
  if (!activeJob) return;
  window.open(`/api/results/${activeJob.id}/csv`, '_blank');
}

function downloadShortlistJson() {
  if (!activeJob) return;
  window.open(`/api/results/${activeJob.id}/json`, '_blank');
}
