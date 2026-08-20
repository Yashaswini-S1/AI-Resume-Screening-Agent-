def parse_job_description(jd_text: str) -> dict:
    """Preprocesses and counts words in the job description."""
    cleaned = jd_text.strip()
    return {
        "raw_text": cleaned,
        "word_count": len(cleaned.split())
    }
