/**
 * Client wrapper to interact with Gemini 1.5 Flash API directly from the browser.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Screen a single candidate's resume against a job description using Gemini.
 * 
 * @param {Object} params
 * @param {string} params.apiKey - The user's Gemini API Key.
 * @param {string} params.jobDescription - The job description text.
 * @param {Object} params.weights - Sub-scores weights.
 * @param {number} params.weights.skills
 * @param {number} params.weights.experience
 * @param {number} params.weights.education
 * @param {number} params.weights.culturalFit
 * @param {Object} params.fileData - Parsed file payload.
 * @param {string} params.fileData.type - 'text' | 'pdf' | 'image'
 * @param {string} params.fileData.content - Plain text or Base64 string.
 * @param {string} [params.fileData.mimeType] - Required if type is 'image' (e.g. 'image/png').
 * @returns {Promise<Object>} The screened candidate details matching the JSON schema.
 */
export const screenResume = async ({ apiKey, jobDescription, weights, fileData }) => {
  if (!apiKey) {
    throw new Error('API Key is required to call the Gemini service.');
  }

  // Create prompt instructions
  const promptText = `
You are an expert technical recruiter and resume screening agent.
Analyze the attached resume against the following Job Description (JD) and screening weightages.

### Job Description:
${jobDescription}

### Scoring Criteria Weightages:
- Skills Weight: ${weights.skills}%
- Experience Weight: ${weights.experience}%
- Education Weight: ${weights.education}%
- Cultural Fit / Other Weight: ${weights.culturalFit}%

### Instructions:
1. Extract candidate contact info: candidateName, email, and phone. If any field is missing or cannot be found, provide an empty string. If the name is missing, use "Unknown Candidate".
2. Identify skillsMatched (skills mentioned in both resume and JD) and skillsMissing (skills requested in JD but missing/lacking in resume).
3. Summarize the candidate's professional experience in experienceSummary, and estimate the total yearsOfExperience as a number.
4. Summarize their education history in educationSummary.
5. Score each of the 4 categories (skills, experience, education, culturalFit) on a scale of 0 to 100 based on how well they match the JD.
6. Calculate the overall weighted score:
   overall = Math.round((skills_score * skills_weight + experience_score * experience_weight + education_score * education_weight + cultural_fit_score * cultural_fit_weight) / 100)
7. Provide a detailed, transparent, and explainable AI reasoning for the scores given in the explanation field. Make sure to describe why points were deducted or awarded.
8. Classify the recommendation as: 'Strong Match' (overall score >= 80), 'Potential Match' (overall score between 60 and 79), or 'Low Match' (overall score < 60).
9. Output MUST be valid JSON adhering strictly to the schema provided. Do not wrap the JSON in Markdown code fences.
`;

  // Construct parts payload based on file type
  const parts = [{ text: promptText }];

  if (fileData.type === 'text') {
    parts.push({ text: `### Candidate Resume Content:\n${fileData.content}` });
  } else if (fileData.type === 'pdf') {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: fileData.content
      }
    });
  } else if (fileData.type === 'image') {
    parts.push({
      inlineData: {
        mimeType: fileData.mimeType || 'image/jpeg',
        data: fileData.content
      }
    });
  } else {
    throw new Error(`Unsupported file type: ${fileData.type}`);
  }

  const payload = {
    contents: [
      {
        parts: parts
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          candidateName: { type: 'STRING' },
          email: { type: 'STRING' },
          phone: { type: 'STRING' },
          skillsMatched: { type: 'ARRAY', items: { type: 'STRING' } },
          skillsMissing: { type: 'ARRAY', items: { type: 'STRING' } },
          experienceSummary: { type: 'STRING' },
          yearsOfExperience: { type: 'NUMBER' },
          educationSummary: { type: 'STRING' },
          scores: {
            type: 'OBJECT',
            properties: {
              skills: { type: 'INTEGER' },
              experience: { type: 'INTEGER' },
              education: { type: 'INTEGER' },
              culturalFit: { type: 'INTEGER' },
              overall: { type: 'INTEGER' }
            },
            required: ['skills', 'experience', 'education', 'culturalFit', 'overall']
          },
          explanation: { type: 'STRING' },
          recommendation: { type: 'STRING' }
        },
        required: [
          'candidateName',
          'email',
          'phone',
          'skillsMatched',
          'skillsMissing',
          'experienceSummary',
          'yearsOfExperience',
          'educationSummary',
          'scores',
          'explanation',
          'recommendation'
        ]
      }
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Empty response received from Gemini API.');
    }

    const parsedData = JSON.parse(responseText);
    return parsedData;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

/**
 * Validates a Gemini API Key by performing a minimal call.
 * 
 * @param {string} apiKey 
 * @returns {Promise<boolean>} True if valid.
 */
export const validateApiKey = async (apiKey) => {
  if (!apiKey) return false;

  const payload = {
    contents: [
      {
        parts: [{ text: 'Respond with "ok".' }]
      }
    ]
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (e) {
    return false;
  }
};
