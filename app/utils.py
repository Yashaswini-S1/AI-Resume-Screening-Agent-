import os
import json
import pandas as pd

def save_shortlist_to_files(candidates: list, output_dir: str) -> dict:
    """
    Leverages Pandas to export a ranked list of candidate profiles
    into clean CSV and JSON files in the specified directory.
    """
    if not candidates:
        return {}

    # Sort candidates by overall score descending
    sorted_candidates = sorted(candidates, key=lambda x: x["scores"]["overall"], reverse=True)

    # Prepare flat data rows for Pandas CSV export
    flat_rows = []
    for idx, c in enumerate(sorted_candidates):
        flat_rows.append({
            "Rank": idx + 1,
            "Candidate Name": c["candidateName"],
            "Email": c["email"],
            "Phone": c["phone"],
            "Recommendation": c["recommendation"],
            "Overall Match (%)": c["scores"]["overall"],
            "Skills Match Score": c["scores"]["skills"],
            "Experience Score": c["scores"]["experience"],
            "Education Score": c["scores"]["education"],
            "Cultural Fit Score": c["scores"]["culturalFit"],
            "Years of Experience": c["yearsOfExperience"],
            "Matched Skills": ", ".join(c.get("skillsMatched", [])),
            "Missing Skills": ", ".join(c.get("skillsMissing", [])),
            "Certifications": ", ".join(c.get("certifications", [])),
            "Experience Summary": c["experienceSummary"],
            "Education Summary": c["educationSummary"],
            "AI Score Explanation": c["explanation"]
        })

    # Convert to Pandas DataFrame
    df = pd.DataFrame(flat_rows)

    # Create directory if missing
    os.makedirs(output_dir, exist_ok=True)
    csv_path = os.path.join(output_dir, "ranked_shortlist.csv")
    json_path = os.path.join(output_dir, "ranked_shortlist.json")

    # Export to files
    df.to_csv(csv_path, index=False)
    
    # Save the original deep structured JSON list
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(sorted_candidates, f, indent=2, ensure_ascii=False)

    return {
        "csv_file": csv_path,
        "json_file": json_path,
        "total_ranked": len(flat_rows)
    }
