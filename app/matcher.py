import os
from sentence_transformers import SentenceTransformer, util

# Global cache for the transformer model
_model = None

def get_model():
    global _model
    if _model is None:
        # Load the lightweight, highly efficient semantic model
        # Sets a specific cache folder to avoid write permissions errors on Windows
        os.environ["HF_HOME"] = os.path.join(os.path.expanduser("~"), ".cache", "huggingface")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def calculate_similarity(resume_text: str, jd_text: str) -> float:
    """
    Computes semantic cosine similarity between the resume text and the job description.
    Returns a score scaled between 0 and 100.
    """
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    try:
        model = get_model()
        
        # Calculate embeddings
        emb_resume = model.encode(resume_text, convert_to_tensor=True)
        emb_jd = model.encode(jd_text, convert_to_tensor=True)
        
        # Compute cosine similarity
        similarity = util.cos_sim(emb_resume, emb_jd)
        similarity_val = float(similarity[0][0])
        
        # Normalize and map similarity to a 0-100 percentage scale
        # Cosine similarity typically ranges from -1 to 1, but for text alignments it is almost always positive.
        percentage = max(0, min(100, round(similarity_val * 100)))
        return percentage
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 50.0  # Fallback median score on error
