import os
import json
import google.generativeai as genai

def get_gemini_model(api_key: str = None):
    """Initializes and returns a Gemini client."""
    # Use key from argument, or look in OS environment variables
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError("Gemini API Key is not configured. Please supply it or configure it in the server .env.")
    
    genai.configure(api_key=key)
    # Using 1.5 Flash for high performance, low latency, and large context windows
    return genai.GenerativeModel("gemini-1.5-flash")

def screen_candidate_with_gemini(resume_text: str, jd_text: str, api_key: str = None) -> dict:
    """Extracts structured profiles and ratings from the resume text using Gemini 1.5 Flash."""
    model = get_gemini_model(api_key)

    prompt = f"""
You are an expert technical recruiter and resume screening agent.
Analyze the candidate's resume text against the following Job Description (JD) and extract structured details.

### Job Description:
{jd_text}

### Instructions:
1. Extract candidate contact info: candidateName, email, and phone. If any field is missing or cannot be found, provide an empty string. If the name is missing, use "Unknown Candidate".
2. Identify skillsMatched (skills mentioned in both resume and JD) and skillsMissing (skills requested in JD but missing/lacking in resume).
3. Summarize the candidate's professional experience in experienceSummary, and estimate the total yearsOfExperience as a number.
4. Summarize their education history in educationSummary.
5. Extract any certifications or licenses in certifications (as a list of string names, e.g., ["AWS Solutions Architect", "PMP"]).
6. Grade the candidate on a scale of 0 to 100 in the following categories:
   - geminiSkillsScore: Skills match/knowledge alignment.
   - experienceScore: Match of experience duration, level, and responsibilities.
   - educationScore: Match of education degrees, disciplines, and institutions.
   - culturalFitScore: Cultural / other qualitative fit indicator.
7. Provide a detailed, transparent, and explainable AI reasoning for the scores given in the explanation field. Make sure to describe why points were deducted or awarded.

Output MUST be a valid JSON object matching this schema. Do not include markdown block formatting:
{{
  "candidateName": "Candidate Full Name",
  "email": "candidate@email.com",
  "phone": "123-456-7890",
  "skillsMatched": ["React", "Node.js", "SQL"],
  "skillsMissing": ["Docker", "Kubernetes"],
  "experienceSummary": "A summary of work history...",
  "yearsOfExperience": 5.5,
  "educationSummary": "Bachelor of Science in Computer Science...",
  "certifications": ["AWS Solutions Architect", "PMP"],
  "geminiSkillsScore": 85,
  "experienceScore": 80,
  "educationScore": 90,
  "culturalFitScore": 75,
  "explanation": "Explanation of scores..."
}}
"""

    try:
        response = model.generate_content(
            prompt + f"\n\n### Candidate Resume Content:\n{resume_text}",
            generation_config={"response_mime_type": "application/json"}
        )
        
        if not response.text:
            raise ValueError("Empty response received from Gemini API.")
            
        parsed_data = json.loads(response.text)
        return parsed_data
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise e

def calculate_hybrid_score(gemini_data: dict, local_similarity: float, weights: dict) -> dict:
    """
    Combines the local Sentence Transformers semantic similarity score with Gemini's
    qualitative ratings to generate the final overall score and candidate shortlist details.
    """
    # Weights config (defaults to 40/30/20/10 if not provided or invalid)
    w_skills = weights.get("skills", 40)
    w_exp = weights.get("experience", 30)
    w_edu = weights.get("education", 20)
    w_fit = weights.get("culturalFit", 10)

    # Calculate final Skills match: Blend local Sentence Transformers cosine similarity
    # (60% weight) with Gemini's qualitative extraction rating (40% weight).
    # This introduces a rigorous local mathematical similarity anchor for skills match.
    nlp_skills = local_similarity
    gemini_skills = gemini_data.get("geminiSkillsScore", 50)
    skills_score = round((nlp_skills * 0.6) + (gemini_skills * 0.4))

    experience_score = gemini_data.get("experienceScore", 50)
    education_score = gemini_data.get("educationScore", 50)
    cultural_fit_score = gemini_data.get("culturalFitScore", 50)

    # Calculate final weighted overall score
    overall_score = round(
        (skills_score * w_skills +
         experience_score * w_exp +
         education_score * w_edu +
         cultural_fit_score * w_fit) / 100
    )

    # Match rating categorization
    if overall_score >= 80:
        recommendation = "Strong Match"
    elif overall_score >= 60:
        recommendation = "Potential Match"
    else:
        recommendation = "Low Match"

    return {
        "candidateName": gemini_data.get("candidateName", "Unknown Candidate"),
        "email": gemini_data.get("email", ""),
        "phone": gemini_data.get("phone", ""),
        "skillsMatched": gemini_data.get("skillsMatched", []),
        "skillsMissing": gemini_data.get("skillsMissing", []),
        "experienceSummary": gemini_data.get("experienceSummary", ""),
        "yearsOfExperience": gemini_data.get("yearsOfExperience", 0),
        "educationSummary": gemini_data.get("educationSummary", ""),
        "certifications": gemini_data.get("certifications", []),
        "scores": {
            "skills": skills_score,
            "experience": experience_score,
            "education": education_score,
            "culturalFit": cultural_fit_score,
            "overall": overall_score
        },
        "explanation": gemini_data.get("explanation", ""),
        "recommendation": recommendation
    }
