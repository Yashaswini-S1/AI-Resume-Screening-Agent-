


An AI-powered recruitment agent that automatically analyzes multiple resumes against a Job Description (JD), calculates candidate relevance scores, ranks applicants, and provides explainable recommendations.

##  Problem Statement

Recruiters often receive a large number of resumes for a single job opening. Manually reviewing and comparing candidates is time-consuming and may lead to inconsistent evaluation.

This project automates the initial screening process by extracting **skills, education, and experience** from resumes and comparing them with the requirements of a Job Description using **NLP-based similarity analysis**.

The agent produces a ranked shortlist with **match scores, matching skills, missing skills, and reasoning**.

## Features

-  Job Description upload
-  Multiple resume upload (PDF/DOCX/TXT)
-  Automatic resume information extraction
-  NLP semantic similarity
-  Skill matching
-  Education matching
-  Experience matching
-  Candidate scoring and ranking
-  Explainable AI recommendations
-  Missing-skill identification
-  CSV/JSON result export
-  Supports 10+ resumes per run

##  Workflow

```text
Job Description + Resumes
          ↓
    Resume Parser
          ↓
Skills | Education | Experience
          ↓
    NLP Matching Engine
          ↓
   Scoring & Evaluation
          ↓
     AI Reasoning
          ↓
    Candidate Ranking
          ↓
 Ranked Shortlist + Report
Scoring Method
Component	Weight
Skill Match	40%
Experience Match	20%
Education Match	10%
Semantic Similarity	30%
Total	100%
Example
Candidate: Rahul Sharma

Overall Match: 94%

✓ Python
✓ Flask
✓ SQL
✓ Git

Missing Skill:
• Docker

Recommendation:
Highly Recommended
🛠️ Technology Stack
Backend: Python, FastAPI
AI/NLP: Sentence Transformers, NLP Similarity, LLM API
Document Processing: PyMuPDF, python-docx
Data Processing: Pandas, JSON, CSV
Frontend: HTML, CSS, JavaScript

Project Structure
resume-screening-agent/
│
├── app/
│   ├── main.py
│   ├── resume_parser.py
│   ├── matcher.py
│   ├── scorer.py
│   └── agent.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── data/
│   ├── resumes/
│   └── job_description/
│
├── tests/
├── requirements.txt
├── .env.example
└── README.md
⚙️ Setup
Clone the repository
git clone https://github.com/YOUR-USERNAME/resume-screening-agent.git
cd resume-screening-agent
Create virtual environment
python -m venv venv
Activate environment
Windows:

venv\Scripts\activate
Linux/macOS:

source venv/bin/activate
Install dependencies
pip install -r requirements.txt
Run the application
uvicorn app.main:app --reload
Open:

http://127.0.0.1:8000
🔑 Environment Variables
If an LLM API is used, create a .env file:

LLM_API_KEY=your_api_key_here
 Output
The system generates:

 Ranked candidate list

 Overall match percentage

 Skill score

 Experience score

 Education score

 Matching skills

 Missing skills

 Candidate strengths

 AI-generated recommendation

 CSV/JSON report

 Testing
The system is tested using 10+ sample resumes against a Job Description to verify:

Resume parsing

Skill extraction

NLP similarity

Candidate scoring

Candidate ranking

AI-generated explanations

 Limitations
Resume formatting can affect text extraction accuracy.

NLP/AI scores do not guarantee actual candidate suitability.

AI-generated explanations may require human verification.

The system should be used as a screening aid, not as the sole basis for hiring decisions.

 Future Enhancements
 OCR for scanned resumes

 Multilingual resume support

 Automated interview question generation

 Recruiter feedback system

 Bias and fairness analysis

 Candidate database

 Email automation

 Author
Yashaswini S 
Computer Science & Engineering

 Project Goal
Build a reliable and explainable AI agent that helps recruiters screen and prioritize candidates faster while keeping humans in control of the final hiring decision.


**Tip:** Replace `YOUR-USERNAME` and `Your Name` before pushing it to GitHub.

Take my name as Yashaswini S

Memory updated
Sure. Replace the Author section with:


n AI-Powered Resume Screening Agent
An AI-powered recruitment agent that automatically analyzes multiple resumes against a Job Description (JD), calculates candidate relevance scores, ranks
applicants, and provides explainable recommendations.
n Problem Statement
Recruiters often receive a large number of resumes for a single job opening. Manually reviewing and comparing candidates is time-consuming and may lead to
inconsistent evaluation. This project automates the initial screening process by extracting skills, education, and experience from resumes and comparing them
with the requirements of a Job Description using NLP-based similarity analysis. The agent produces a ranked shortlist with match scores, matching skills,
missing skills, and reasoning.
n Features
• Job Description upload • Multiple resume upload (PDF/DOCX/TXT) • Automatic resume information extraction • NLP semantic similarity • Skill, education and
experience matching • Candidate scoring and ranking • Explainable AI recommendations • Missing-skill identification • CSV/JSON export • Supports 10+
resumes per run
n Workflow
Job Description + Resumes → Resume Parser → Skills | Education | Experience → NLP Matching Engine → Scoring & Evaluation → AI Reasoning
n Scoring Method
Component Weight
Skill Match 40%
Experience Match 20%
Education Match 10%
Semantic Similarity 30%
Total 100%
Example: Rahul Sharma — Overall Match: 94% — Matching: Python, Flask, SQL, Git — Missing: Docker — Recommendation: Highly Recommended
nn Technology Stack
Backend: Python, FastAPI • AI/NLP: Sentence Transformers, NLP Similarity, LLM API • Documents: PyMuPDF, python-docx • Data: Pandas, JSON, CSV •
Frontend: HTML, CSS, JavaScript
n Project Structure
resume-screening-agent/
nnn app/ (main.py, resume_parser.py, matcher.py, scorer.py, agent.py)
nnn frontend/ (index.html, style.css, script.js)
nnn data/ (resumes/, job_description/)
nnn tests/
nnn requirements.txt
nnn .env.example
nnn README.md
nn Setup
git clone https://github.com/YOUR-USERNAME/resume-screening-agent.git
cd resume-screening-agent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
Open: http://127.0.0.1:8000
n Environment Variables
LLM_API_KEY=your_api_key_here
n Output
Ranked candidate list • Overall match percentage • Skill/education/experience scores • Matching skills • Missing skills • Candidate strengths • AI-generated
recommendation • CSV/JSON report
n Testing
The system is tested using 10+ sample resumes against a Job Description to verify resume parsing, skill extraction, NLP similarity, candidate scoring, ranking,
and AI-generated explanations.
nn Limitations
Resume formatting can affect text extraction accuracy, and AI/NLP scores do not guarantee actual candidate suitability. The system is intended as a
recruitment screening aid, not as the sole basis for hiring decisions.
n Future Enhancements
OCR for scanned resumes • Multilingual resume support • Interview question generation • Recruiter feedback system • Bias/fairness analysis • Candidate
database • Email automation
nnn Author
Yashaswini S
Computer Science & Engineering
n Project Goal
Build a reliable and explainable AI agent that helps recruiters screen and prioritize candidates faster while keeping humans in control of the final hiring decision.
