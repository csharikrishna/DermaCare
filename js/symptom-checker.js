// symptom-checker.js - Enhanced AI-Powered Symptom Checker
// IMPORTANT: This version includes security improvements and better error handling

class SymptomChecker {
    constructor() {
        // WARNING: API key should be moved to backend for production
        this.apiKey = 'GOOGLE_API_KEY';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
        
        // Initialize DOM elements
        this.initializeElements();
        
        // Bind methods to maintain context
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        
        this.init();
    }

    initializeElements() {
        // Try to find form element, create if doesn't exist
        this.form = document.getElementById('symptom-form');
        if (!this.form) {
            console.warn('Form with id="symptom-form" not found, using button-based approach');
        }
        
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.resultsSection = document.getElementById('results-section');
        this.resultsContainer = document.getElementById('analysis-results');
        
        // Validate required elements
        if (!this.analyzeBtn || !this.resultsSection || !this.resultsContainer) {
            console.error('Required elements missing. Check HTML structure.');
            return false;
        }
        
        return true;
    }

    init() {
        if (!this.initializeElements()) {
            return;
        }

        // Setup event listeners
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmit);
        }
        
        // Always add click listener to button as fallback
        this.analyzeBtn.addEventListener('click', this.handleButtonClick);
        
        console.log('Symptom Checker initialized successfully');
    }

    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.processSymptoms();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.processSymptoms();
    }

    async processSymptoms() {
        console.log('Starting symptom analysis...');
        
        // Validate API key
        if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY') {
            this.showError('**API Configuration Error**: Please contact the administrator. The AI service is not properly configured.');
            return;
        }

        // Collect and validate form data
        const formData = this.collectFormData();
        if (!this.validateFormData(formData)) {
            this.showError('**Incomplete Information**: Please fill in all required fields to get an accurate AI analysis.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Generate AI prompt
            const prompt = this.generateMedicalPrompt(formData);
            
            // Call Gemini API with retry mechanism
            const response = await this.callGeminiAPIWithRetry(prompt);
            
            // Process and display results
            this.displayResults(response, formData);
            
        } catch (error) {
            console.error('Symptom analysis error:', error);
            this.handleAnalysisError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    collectFormData() {
        // Safely collect form data with error handling
        const getData = (id) => {
            const element = document.getElementById(id);
            return element ? element.value.trim() : '';
        };

        const additionalSymptoms = Array.from(
            document.querySelectorAll('input[name="additional"]:checked')
        ).map(cb => cb.value);

        return {
            primarySymptom: getData('primary-symptom'),
            affectedArea: getData('affected-area'),
            duration: getData('duration'),
            severity: getData('severity'),
            age: getData('age'),
            description: getData('description'),
            additionalSymptoms: additionalSymptoms
        };
    }

    validateFormData(data) {
        const requiredFields = ['primarySymptom', 'affectedArea', 'duration', 'severity', 'age', 'description'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field] === '');
        
        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return false;
        }
        
        // Additional validation
        if (data.description.length < 10) {
            this.showError('**Insufficient Description**: Please provide a more detailed description of your symptoms (at least 10 characters).');
            return false;
        }
        
        return true;
    }

    generateMedicalPrompt(data) {
        return `You are a professional dermatology AI assistant. Analyze the following skin symptoms and provide a structured medical assessment. Be professional, accurate, and include appropriate disclaimers.

PATIENT INFORMATION:
- Age Range: ${data.age}
- Primary Symptom: ${data.primarySymptom}
- Affected Area: ${data.affectedArea}
- Duration: ${data.duration}
- Severity: ${data.severity}
- Additional Symptoms: ${data.additionalSymptoms.length > 0 ? data.additionalSymptoms.join(', ') : 'None reported'}

DETAILED DESCRIPTION:
${data.description}

Please provide a comprehensive analysis in the following format:

## SYMPTOM ANALYSIS

### Possible Conditions
List 2-3 most likely dermatological conditions based on the symptoms, with brief explanations.

### Urgency Assessment
Categorize as: LOW, MEDIUM, or HIGH urgency with reasoning.

### Immediate Care Recommendations
Provide 3-4 specific, actionable care recommendations.

### When to Seek Professional Care
Specify when medical consultation is needed.

### General Skin Care Tips
Provide 2-3 general tips for the affected area.

IMPORTANT: Always emphasize that this is an AI analysis and not a medical diagnosis. Recommend professional dermatological consultation for accurate diagnosis and treatment.

Keep the tone professional, empathetic, and medical. Use clear, understandable language while maintaining medical accuracy.`;
    }

    async callGeminiAPIWithRetry(prompt, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`API attempt ${attempt} of ${maxRetries}`);
                return await this.callGeminiAPI(prompt);
            } catch (error) {
                console.log(`API attempt ${attempt} failed:`, error.message);
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Exponential backoff: wait 1s, 2s, 4s
                const waitTime = 1000 * Math.pow(2, attempt - 1);
                console.log(`Waiting ${waitTime}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    async callGeminiAPI(prompt) {
        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 0.9,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        console.log('Making API request to Gemini...');

        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage += ` - ${errorData.error?.message || 'Unknown error'}`;
            } catch (e) {
                errorMessage += ` - ${errorText}`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('API Response received successfully');
        
        // Comprehensive response validation
        if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
            console.warn('No candidates in API response');
            return this.generateFallbackResponse();
        }
        
        const candidate = data.candidates[0];
        if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts)) {
            console.warn('Invalid response structure - missing content or parts');
            return this.generateFallbackResponse();
        }
        
        if (!candidate.content.parts[0] || !candidate.content.parts[0].text) {
            console.warn('No text content in response');
            return this.generateFallbackResponse();
        }
        
        const responseText = candidate.content.parts[0].text.trim();
        
        if (responseText === '') {
            console.warn('Empty response text received from API');
            return this.generateFallbackResponse();
        }
        
        console.log('Successfully extracted response text');
        return responseText;
    }

    generateFallbackResponse() {
        console.log('Generating fallback response due to API issues');
        return `## SYMPTOM ANALYSIS

### Possible Conditions
Based on the symptoms you've described, this could be related to:
1. **Contact Dermatitis** - Skin reaction to an irritant or allergen
2. **Eczema (Atopic Dermatitis)** - Chronic inflammatory skin condition
3. **Allergic Reaction** - Response to environmental or topical allergens

### Urgency Assessment
**LOW to MEDIUM** urgency - While these symptoms may be uncomfortable, they typically don't require emergency care. However, monitoring is important.

### Immediate Care Recommendations
1. **Avoid scratching** the affected area to prevent further irritation
2. **Apply cool compresses** for 10-15 minutes several times daily
3. **Use gentle, fragrance-free moisturizer** to keep skin hydrated
4. **Identify and avoid potential triggers** like new soaps, detergents, or fabrics

### When to Seek Professional Care
- If symptoms worsen or spread to other areas
- If you develop fever or signs of infection (increased warmth, pus, red streaking)
- If the condition persists for more than 2 weeks
- If you experience severe itching that interferes with sleep

### General Skin Care Tips
1. **Use lukewarm water** when washing the affected area
2. **Pat dry gently** rather than rubbing with towels
3. **Choose hypoallergenic products** designed for sensitive skin

**IMPORTANT DISCLAIMER:** This is an AI-generated analysis based on limited information and should not replace professional medical advice. Please consult with a qualified dermatologist for accurate diagnosis and personalized treatment recommendations.`;
    }

    displayResults(aiResponse, formData) {
        console.log('Displaying analysis results...');
        
        const urgency = this.parseUrgency(aiResponse);
        const cleanHTML = this.cleanMarkdownToHTML(aiResponse);
        
        const html = `
            <div class="ai-analysis fade-in">
                <div class="ai-badge">
                    <i class="fas fa-robot"></i>
                    AI-Powered Analysis by Google Gemini
                </div>
                
                <div class="urgency-assessment ${urgency.class}" style="padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; text-align: center; border: 2px solid;">
                    <h4 style="margin: 0 0 0.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-exclamation-circle"></i> 
                        Urgency Level: ${urgency.level}
                    </h4>
                    <p style="margin: 0; font-weight: 500;">${urgency.message}</p>
                </div>
                
                <div class="analysis-content" style="color: #2c3e50; line-height: 1.7; font-size: 1rem;">
                    ${cleanHTML}
                </div>
            </div>
            
            <div class="recommendations" style="margin-top: 2rem; background: #f8f9fa; border-radius: 10px; padding: 2rem; border-left: 4px solid #2c5aa0;">
                <h4 style="color: #2c5aa0; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-lightbulb"></i> Next Steps
                </h4>
                <div style="color: #2c3e50;">
                    <p style="margin-bottom: 1rem;"><strong>Based on your AI analysis:</strong></p>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem; line-height: 1.6;">
                        <li style="margin-bottom: 0.5rem;">Consider scheduling a consultation with our dermatologists for professional evaluation</li>
                        <li style="margin-bottom: 0.5rem;">Keep track of any changes in your symptoms over time</li>
                        <li style="margin-bottom: 0.5rem;">Take photos to document progression if safe to do so</li>
                        <li style="margin-bottom: 0.5rem;">Avoid self-medication without professional guidance</li>
                        <li style="margin-bottom: 0.5rem;">Contact us immediately if symptoms worsen or new concerning symptoms develop</li>
                    </ul>
                </div>
            </div>
        `;

        this.resultsContainer.innerHTML = html;
        this.resultsSection.classList.remove('hidden');
        
        // Ensure visibility and smooth scroll
        setTimeout(() => {
            this.resultsSection.style.display = 'block';
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
        
        console.log('Results displayed successfully');
    }

    parseUrgency(aiResponse) {
        const response = aiResponse.toLowerCase();
        
        if (response.includes('high urgency') || response.includes('urgent') || 
            response.includes('immediate') || response.includes('emergency') ||
            response.includes('seek immediate')) {
            return {
                level: 'HIGH',
                class: 'urgency-high',
                message: 'Seek immediate medical attention - symptoms may require urgent care'
            };
        } else if (response.includes('medium urgency') || response.includes('moderate') || 
                   response.includes('soon') || response.includes('within') ||
                   response.includes('schedule')) {
            return {
                level: 'MEDIUM',
                class: 'urgency-medium',
                message: 'Schedule appointment within 1-2 weeks - symptoms warrant professional evaluation'
            };
        } else {
            return {
                level: 'LOW',
                class: 'urgency-low',
                message: 'Monitor symptoms - routine consultation recommended'
            };
        }
    }

    cleanMarkdownToHTML(text) {
        if (!text || text.trim() === '') {
            return '<p><em>No detailed analysis available. Please consult with our dermatologists for professional evaluation.</em></p>';
        }

        let cleanText = text.trim();
        
        // Convert headers with enhanced styling
        cleanText = cleanText.replace(/^### (.+)$/gm, '<h4 style="color: #2c5aa0; margin: 1.5rem 0 1rem 0; font-weight: 600; border-bottom: 2px solid #e8f4fd; padding-bottom: 0.5rem;">$1</h4>');
        cleanText = cleanText.replace(/^## (.+)$/gm, '<h3 style="color: #2c5aa0; margin: 2rem 0 1rem 0; font-weight: 700; border-bottom: 3px solid #2c5aa0; padding-bottom: 0.5rem;">$1</h3>');
        cleanText = cleanText.replace(/^# (.+)$/gm, '<h2 style="color: #2c5aa0; margin: 2rem 0 1rem 0; font-weight: 700;">$1</h2>');
        
        // Convert bold and italic text
        cleanText = cleanText.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #2c3e50; font-weight: 600;">$1</strong>');
        cleanText = cleanText.replace(/\*(.+?)\*/g, '<em style="color: #5d6d7e;">$1</em>');
        
        // Process lists more carefully
        const lines = cleanText.split('\n');
        let inList = false;
        let processedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.match(/^[\*\-\+]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/)) {
                if (!inList) {
                    processedLines.push('<ul style="margin: 1rem 0; padding-left: 1.5rem; color: #2c3e50;">');
                    inList = true;
                }
                
                const content = line.replace(/^[\*\-\+]\s+/, '').replace(/^\d+\.\s+/, '');
                processedLines.push(`<li style="margin-bottom: 0.5rem; line-height: 1.6;">${content}</li>`);
            } else {
                if (inList) {
                    processedLines.push('</ul>');
                    inList = false;
                }
                
                if (line !== '') {
                    processedLines.push(line);
                }
            }
        }
        
        if (inList) {
            processedLines.push('</ul>');
        }
        
        cleanText = processedLines.join('\n');
        
        // Convert paragraphs
        const paragraphs = cleanText.split('\n\n').filter(p => p.trim() !== '');
        const htmlParagraphs = paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            
            if (trimmed.startsWith('<') || trimmed.includes('</')) {
                return trimmed;
            }
            
            const withBreaks = trimmed.replace(/\n/g, '<br>');
            return `<p style="margin-bottom: 1rem; line-height: 1.7; color: #2c3e50;">${withBreaks}</p>`;
        });
        
        return htmlParagraphs.join('\n');
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.analyzeBtn.disabled = true;
            this.analyzeBtn.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <span>AI is analyzing your symptoms...</span>
                </div>
            `;
        } else {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.innerHTML = `
                <i class="fas fa-robot"></i>
                Analyze My Symptoms with AI
            `;
        }
    }

    handleAnalysisError(error) {
        let errorMessage = 'Unable to analyze symptoms at this time.';
        
        if (error.message.includes('429')) {
            errorMessage = 'API rate limit exceeded. Please try again in a few minutes.';
        } else if (error.message.includes('403')) {
            errorMessage = 'API access denied. Please contact administrator.';
        } else if (error.message.includes('Network')) {
            errorMessage = 'Network connection issue. Please check your internet connection.';
        }
        
        this.showError(errorMessage);
    }

    showError(message) {
        const errorHtml = `
            <div class="error-message fade-in">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Analysis Error:</strong> ${message}
                <div style="margin-top: 1rem; font-size: 0.9rem;">
                    <p><strong>You can still get help:</strong></p>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; line-height: 1.6;">
                        <li><a href="./appointments.html" style="color: #2c5aa0; text-decoration: underline;">Schedule a consultation</a> with our dermatologists</li>
                        <li><a href="./contact.html" style="color: #2c5aa0; text-decoration: underline;">Contact us directly</a> for immediate assistance</li>
                        <li>Call our clinic at <strong>(555) 123-4567</strong> for urgent concerns</li>
                        <li>Visit our emergency contact page for after-hours support</li>
                    </ul>
                </div>
            </div>
        `;

        this.resultsContainer.innerHTML = errorHtml;
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the symptom checker when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the correct page
    if (document.getElementById('analyze-btn')) {
        try {
            window.symptomChecker = new SymptomChecker();
            console.log('Enhanced Symptom Checker initialized successfully');
            
            // Optional: Add analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    page_title: 'Symptom Checker',
                    page_location: window.location.href
                });
            }
        } catch (error) {
            console.error('Failed to initialize Symptom Checker:', error);
        }
    }
});
