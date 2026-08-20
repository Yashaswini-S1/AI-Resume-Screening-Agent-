import os
from app.resume_parser import parse_resume
from app.matcher import calculate_similarity
from app.scorer import screen_candidate_with_gemini, calculate_hybrid_score

def run_screening_pipeline(file_path: str, jd_text: str, weights: dict, api_key: str = None) -> dict:
    """
    Orchestrates the entire screening pipeline for a single resume file:
    1. Extracts text from file (PDF, DOCX, TXT)
    2. Calculates semantic similarity locally using Sentence Transformers
    3. Screens and extracts structured profiles using Gemini
    4. Computes hybrid weighted scores and determines match recommendations
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Resume file not found at: {file_path}")

    # Step 1: Text extraction
    resume_text = parse_resume(file_path)

    # Step 2: NLP similarity analysis via local sentence embeddings
    local_similarity = calculate_similarity(resume_text, jd_text)

    # Step 3: LLM structured evaluation & metadata parsing
    gemini_data = screen_candidate_with_gemini(resume_text, jd_text, api_key)

    # Step 4: Hybrid rating calculation
    screened_candidate = calculate_hybrid_score(gemini_data, local_similarity, weights)

    return screened_candidate
