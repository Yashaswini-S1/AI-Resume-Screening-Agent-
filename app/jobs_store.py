import os
import json
import re
import copy

JOBS_FILE = os.path.join("data", "jobs.json")

DEFAULT_JOBS = [
    {
        "id": "senior-full-stack-engineer",
        "title": "Senior Full Stack Engineer (React/Node)",
        "description": "Position: Senior Full Stack Engineer\nExperience: 5+ years of software engineering experience.\nLocation: Remote / Hybrid\n\nTechnical Requirements:\n- Expert level proficiency in React.js and modern state management (Redux, Context API).\n- Strong experience in Node.js, Express, and backend APIs.\n- Experience with databases like PostgreSQL, MongoDB, or Redis.\n- Familiarity with TypeScript and modern ES6+ JavaScript.\n- Experience with cloud providers (AWS, GCP) and CI/CD pipelines (GitHub Actions, Docker).\n\nPreferred Qualifications:\n- Solid understanding of Web Performance Optimization and accessibility (a11y).\n- Excellent written and verbal communication skills.\n- Bachelor's degree in Computer Science or a related engineering field.",
        "weights": {
            "skills": 40,
            "experience": 30,
            "education": 20,
            "culturalFit": 10
        },
        "createdAt": "2026-08-20T14:17:42+05:30"
    },
    {
        "id": "ai-ml-product-manager",
        "title": "AI/ML Product Manager",
        "description": "Position: Product Manager, Artificial Intelligence\nExperience: 3+ years managing AI/ML powered features or software products.\nLocation: San Francisco, CA / Hybrid\n\nKey Responsibilities:\n- Define product strategy and roadmap for our LLM-powered agent tools.\n- Collaborate with Machine Learning engineers and Data Scientists to design model evaluations.\n- Author clear, structured Product Requirement Documents (PRDs).\n- Communicate roadmap and performance metrics to executive leadership.\n\nQualifications:\n- Strong analytical skills; experience writing SQL queries and interpreting data dashboards.\n- Deep understanding of NLP, Generative AI models (Gemini, GPT), and prompt engineering.\n- Excellent stakeholder communication skills.\n- MBA or Technical Degree (Computer Science, Data Science, Math) preferred.",
        "weights": {
            "skills": 40,
            "experience": 30,
            "education": 20,
            "culturalFit": 10
        },
        "createdAt": "2026-08-20T14:17:42+05:30"
    }
]

def load_jobs():
    """Loads all job positions. Seeds default jobs if store file doesn't exist."""
    if not os.path.exists(JOBS_FILE):
        os.makedirs(os.path.dirname(JOBS_FILE), exist_ok=True)
        seeded_jobs = copy.deepcopy(DEFAULT_JOBS)
        save_jobs(seeded_jobs)
        return seeded_jobs
    try:
        with open(JOBS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading jobs from file: {e}")
        return copy.deepcopy(DEFAULT_JOBS)

def save_jobs(jobs):
    """Saves all job positions to the JSON store."""
    os.makedirs(os.path.dirname(JOBS_FILE), exist_ok=True)
    with open(JOBS_FILE, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2, ensure_ascii=False)

def slugify(text: str) -> str:
    """Utility to generate URL-safe / file-system safe slugs from job titles."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')
