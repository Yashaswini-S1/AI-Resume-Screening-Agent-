import mammoth from 'mammoth';

/**
 * Parses a .docx file and extracts raw text using Mammoth.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const parseDocx = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      mammoth.extractRawText({ arrayBuffer })
        .then((result) => {
          resolve(result.value);
        })
        .catch((err) => {
          reject(err);
        });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parses a plain text (.txt) file.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const parseTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};

/**
 * Converts a file to base64 string (stripping the metadata prefix).
 * Ideal for passing PDF or images directly to Gemini API.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Detects file type and extracts content accordingly.
 * PDF/images return base64; DOCX/TXT return plain text.
 * @param {File} file 
 * @returns {Promise<{ type: string, content: string }>}
 */
export const parseResumeFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'pdf') {
    const base64Content = await fileToBase64(file);
    return { type: 'pdf', content: base64Content };
  } else if (extension === 'docx') {
    const textContent = await parseDocx(file);
    return { type: 'text', content: textContent };
  } else if (extension === 'txt') {
    const textContent = await parseTxt(file);
    return { type: 'text', content: textContent };
  } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
    const base64Content = await fileToBase64(file);
    return { type: 'image', content: base64Content, mimeType: file.type };
  } else {
    throw new Error(`Unsupported file type: .${extension}`);
  }
};
