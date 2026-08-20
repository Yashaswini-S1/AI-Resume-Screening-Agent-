import os
import sys

# Add workspace directory to python path to support direct execution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import shutil
import json
import time
from typing import List, Optional
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.staticfiles import StaticFiles
# pyrefly: ignore [missing-import]
from fastapi.responses import FileResponse, JSONResponse
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

# Load env configurations
load_dotenv()

from app.agent import run_screening_pipeline
from app.utils import save_shortlist_to_files
from app.jobs_store import load_jobs, save_jobs, slugify

class JobPayload(BaseModel):
    title: str
    description: str
    weights: dict

app = FastAPI(
    title="AI-Powered Resume Screening Agent API",
    description="Automated resume parsing, semantic embedding analysis, and candidate matching.",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories config
TEMP_UPLOAD_DIR = os.path.join("data", "resumes")
RESULTS_DIR = os.path.join("data", "sample_results")
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

@app.post("/api/screen")
async def screen_resumes(
    job_id: str = Form("default"),
    job_description: str = Form(...),
    weights_json: str = Form(...),  # Expecting JSON string for weights
    files: List[UploadFile] = File(...),
    x_gemini_api_key: Optional[str] = Header(None)
):
    """
    Screens multiple resumes against a job description.
    Uses Sentence Transformers locally for semantic similarity matching
    and Gemini 1.5 Flash for metadata/profile extraction.
    """
    # 1. Parse weights
    try:
        weights = json.loads(weights_json)
    except Exception:
        weights = {"skills": 40, "experience": 30, "education": 20, "culturalFit": 10}

    # 2. Check for API key (Priority: Request Header -> Server Environment)
    api_key = x_gemini_api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API Key is missing. Please configure it in your server .env or pass it via the 'X-Gemini-API-Key' header."
        )

    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No resume files uploaded.")

    screened_candidates = []
    errors = []

    # 3. Process each file in the batch
    for file in files:
        # Create unique temp file path
        temp_path = os.path.join(TEMP_UPLOAD_DIR, file.filename)
        try:
            # Save file locally
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Execute agent screening pipeline
            candidate_profile = run_screening_pipeline(
                file_path=temp_path,
                jd_text=job_description,
                weights=weights,
                api_key=api_key
            )
            screened_candidates.append(candidate_profile)
        except Exception as e:
            print(f"Error processing candidate file {file.filename}: {e}")
            errors.append({"file": file.filename, "error": str(e)})
        finally:
            # Cleanup temp file
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass

    # 4. Save results to CSV and JSON using Pandas
    export_metadata = {}
    job_results_dir = os.path.join(RESULTS_DIR, job_id)
    if screened_candidates:
        try:
            export_metadata = save_shortlist_to_files(screened_candidates, job_results_dir)
        except Exception as e:
            print(f"Error exporting results: {e}")

    # Return results
    return {
        "status": "success",
        "candidates": sorted(screened_candidates, key=lambda x: x["scores"]["overall"], reverse=True),
        "errors": errors,
        "export_metadata": export_metadata
    }

@app.get("/api/results/{job_id}/csv")
async def download_csv(job_id: str):
    """Serves the generated Pandas CSV shortlist file for a specific job."""
    path = os.path.join(RESULTS_DIR, job_id, "ranked_shortlist.csv")
    if os.path.exists(path):
        return FileResponse(path, media_type="text/csv", filename=f"ranked_shortlist_{job_id}.csv")
    raise HTTPException(status_code=404, detail="CSV Shortlist file not found for this job. Run a screening batch first.")

@app.get("/api/results/{job_id}/json")
async def download_json(job_id: str):
    """Serves the generated shortlist JSON file for a specific job."""
    path = os.path.join(RESULTS_DIR, job_id, "ranked_shortlist.json")
    if os.path.exists(path):
        return FileResponse(path, media_type="application/json", filename=f"ranked_shortlist_{job_id}.json")
    raise HTTPException(status_code=404, detail="JSON Shortlist file not found for this job. Run a screening batch first.")

@app.get("/api/results/csv")
async def download_csv_legacy():
    return await download_csv("default")

@app.get("/api/results/json")
async def download_json_legacy():
    return await download_json("default")

# --- Job Position Management Endpoints ---

@app.get("/api/jobs")
async def get_all_jobs():
    """Lists all configured job positions."""
    return load_jobs()

@app.post("/api/jobs")
async def create_job(payload: JobPayload):
    """Creates a new job position."""
    jobs = load_jobs()
    job_id = f"{slugify(payload.title)}-{int(time.time())}"
    
    if any(j["id"] == job_id for j in jobs):
        job_id = f"{job_id}-{int(time.time() * 1000) % 1000}"
        
    new_job = {
        "id": job_id,
        "title": payload.title,
        "description": payload.description,
        "weights": payload.weights,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S+05:30")
    }
    jobs.append(new_job)
    save_jobs(jobs)
    return new_job

@app.put("/api/jobs/{job_id}")
async def update_job(job_id: str, payload: JobPayload):
    """Updates the description and weights of an existing job position."""
    jobs = load_jobs()
    for job in jobs:
        if job["id"] == job_id:
            job["title"] = payload.title
            job["description"] = payload.description
            job["weights"] = payload.weights
            save_jobs(jobs)
            return job
    raise HTTPException(status_code=404, detail="Job position not found")

@app.delete("/api/jobs/{job_id}")
async def delete_job(job_id: str):
    """Deletes a job position and its screened candidates data."""
    jobs = load_jobs()
    filtered_jobs = [j for j in jobs if j["id"] != job_id]
    if len(filtered_jobs) == len(jobs):
        raise HTTPException(status_code=404, detail="Job position not found")
    save_jobs(filtered_jobs)
    
    # Clean up results folder
    job_results_dir = os.path.join(RESULTS_DIR, job_id)
    if os.path.exists(job_results_dir):
        try:
            shutil.rmtree(job_results_dir)
        except Exception as e:
            print(f"Error removing job results: {e}")
            
    return {"status": "success", "message": f"Job position {job_id} deleted successfully"}

@app.get("/api/jobs/{job_id}/candidates")
async def get_job_candidates(job_id: str):
    """Fetches previously screened candidates for a specific job."""
    path = os.path.join(RESULTS_DIR, job_id, "ranked_shortlist.json")
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading candidate data: {str(e)}")
    return []

@app.get("/api/config")
async def get_config():
    """Returns application configuration metadata (e.g. if key is present on server)."""
    return {
        "has_gemini_key": bool(os.environ.get("GEMINI_API_KEY"))
    }

# Serve the static frontend assets from /frontend/
# This makes mounting "/" serve frontend/index.html automatically
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on http://{host}:{port}...")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
