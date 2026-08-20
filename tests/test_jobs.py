import os
import shutil
import json
import unittest
from fastapi.testclient import TestClient
from app.main import app
import app.jobs_store as jobs_store

class TestJobManagement(unittest.TestCase):
    def setUp(self):
        # Backup existing jobs database if exists
        self.jobs_backup = None
        if os.path.exists(jobs_store.JOBS_FILE):
            self.jobs_backup = "data/jobs_backup_test.json"
            shutil.copyfile(jobs_store.JOBS_FILE, self.jobs_backup)
            os.remove(jobs_store.JOBS_FILE)
            
        # Initialize test client
        self.client = TestClient(app)
        
    def tearDown(self):
        # Restore jobs backup if it existed
        if os.path.exists(jobs_store.JOBS_FILE):
            os.remove(jobs_store.JOBS_FILE)
        if self.jobs_backup and os.path.exists(self.jobs_backup):
            shutil.copyfile(self.jobs_backup, jobs_store.JOBS_FILE)
            os.remove(self.jobs_backup)

    def test_slugify(self):
        self.assertEqual(jobs_store.slugify("React/Node Specialist!"), "reactnode-specialist")
        self.assertEqual(jobs_store.slugify("Product Manager PM"), "product-manager-pm")

    def test_get_jobs_seeds_defaults(self):
        response = self.client.get("/api/jobs")
        self.assertEqual(response.status_code, 200)
        jobs = response.json()
        self.assertEqual(len(jobs), 2)
        self.assertEqual(jobs[0]["id"], "senior-full-stack-engineer")
        self.assertEqual(jobs[1]["id"], "ai-ml-product-manager")

    def test_crud_job_endpoints(self):
        # 1. Create a job
        new_job_data = {
            "title": "Senior QA Engineer",
            "description": "Must know automation",
            "weights": {"skills": 50, "experience": 30, "education": 10, "culturalFit": 10}
        }
        create_res = self.client.post("/api/jobs", json=new_job_data)
        self.assertEqual(create_res.status_code, 200)
        created_job = create_res.json()
        self.assertEqual(created_job["title"], "Senior QA Engineer")
        self.assertEqual(created_job["description"], "Must know automation")
        job_id = created_job["id"]
        
        # 2. Get all jobs and verify it's there
        get_res = self.client.get("/api/jobs")
        jobs = get_res.json()
        self.assertEqual(len(jobs), 3) # 2 defaults + 1 new
        self.assertTrue(any(j["id"] == job_id for j in jobs))
        
        # 3. Update the job
        updated_data = {
            "title": "Senior QA Engineer",
            "description": "Must know automation and CI/CD",
            "weights": {"skills": 40, "experience": 40, "education": 10, "culturalFit": 10}
        }
        update_res = self.client.put(f"/api/jobs/{job_id}", json=updated_data)
        self.assertEqual(update_res.status_code, 200)
        updated_job = update_res.json()
        self.assertEqual(updated_job["description"], "Must know automation and CI/CD")
        self.assertEqual(updated_job["weights"]["experience"], 40)
        
        # 4. Delete the job
        delete_res = self.client.delete(f"/api/jobs/{job_id}")
        self.assertEqual(delete_res.status_code, 200)
        
        # Verify it's gone
        get_res_after = self.client.get("/api/jobs")
        jobs_after = get_res_after.json()
        self.assertEqual(len(jobs_after), 2)
        self.assertFalse(any(j["id"] == job_id for j in jobs_after))

if __name__ == "__main__":
    unittest.main()
