import os
import unittest
from app.resume_parser import parse_txt

class TestResumeParsers(unittest.TestCase):
    def test_txt_parser(self):
        temp_txt = "temp_test_resume.txt"
        test_content = "Candidate Name: Jane Doe\nSkills: Python, FastAPI, Cosine Similarity"
        
        with open(temp_txt, "w", encoding="utf-8") as f:
            f.write(test_content)
            
        try:
            content = parse_txt(temp_txt)
            self.assertEqual(content, test_content)
            self.assertIn("Jane Doe", content)
            self.assertIn("FastAPI", content)
        finally:
            if os.path.exists(temp_txt):
                os.remove(temp_txt)

if __name__ == "__main__":
    unittest.main()
