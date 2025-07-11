import React, { useState, useEffect } from 'react';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import { Calendar, Clock, Users, Plus, Trash2, ChevronRight, ChevronLeft, Save, Eye, FileText, Code, Brain, Settings } from 'lucide-react';
import { getAuthToken } from '../utils/handleToken';


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const baseUrl = 'http://localhost:8000/api/';

// Form Container Component
const FormContainer = ({ children, isVisible = true }) => (
  <div className={`container mx-auto px-4 py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    <div className="max-w-4xl mx-auto">
      {children}
    </div>
  </div>
);

// Message Notification Component
const MessageNotification = ({ message, messageType, onClose }) => {
  if (!message) return null;
  
  const bgColor = messageType === 'error' ? 'bg-red-500/20 border-red-500/30' : 
                  messageType === 'success' ? 'bg-green-500/20 border-green-500/30' : 
                  'bg-blue-500/20 border-blue-500/30';
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border backdrop-blur-sm z-50 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          ×
        </button>
      </div>
    </div>
  );
};

// Interview Setup Page
const InterviewSetup = ({ onNext, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.desc.trim()) newErrors.desc = 'Description is required';
    if (!formData.post.trim()) newErrors.post = 'Position is required';
    if (!formData.experience || formData.experience < 0) newErrors.experience = 'Valid experience is required';
    if (!formData.submissionDeadline) newErrors.submissionDeadline = 'Submission deadline is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Valid duration is required';
    if (formData.DSA + formData.Dev !== 100) newErrors.allocation = 'DSA and Dev percentages must total 100%';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 mr-2 text-purple-400" />
        <h2 className="text-2xl font-bold">Interview Setup</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              placeholder="Enter job description..."
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-24"
            />
            {errors.desc && <p className="text-red-400 text-sm mt-1">{errors.desc}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <input
              type="text"
              value={formData.post}
              onChange={(e) => handleInputChange('post', e.target.value)}
              placeholder="e.g., Backend Developer"
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.post && <p className="text-red-400 text-sm mt-1">{errors.post}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Experience Required (years)</label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              min="0"
              max="20"
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
          </div>
        </div>
        
        {/* Timing Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Submission Deadline</label>
            <input
              type="datetime-local"
              value={formData.submissionDeadline}
              onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.submissionDeadline && <p className="text-red-400 text-sm mt-1">{errors.submissionDeadline}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Interview Start Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Interview End Time</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.endTime && <p className="text-red-400 text-sm mt-1">{errors.endTime}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              min="1"
              max="300"
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
          </div>
        </div>
      </div>
      
      {/* Question Allocation */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-purple-500/20">
        <h3 className="text-lg font-semibold mb-4">Question Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">DSA Questions (%)</label>
            <input
              type="number"
              value={formData.DSA}
              onChange={(e) => handleInputChange('DSA', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Development Questions (%)</label>
            <input
              type="number"
              value={formData.Dev}
              onChange={(e) => handleInputChange('Dev', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.ask_questions_on_resume}
                onChange={(e) => handleInputChange('ask_questions_on_resume', e.target.checked)}
                className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
              />
              <span className="text-sm">Ask questions on resume</span>
            </label>
          </div>
        </div>
        
        {errors.allocation && <p className="text-red-400 text-sm mt-2">{errors.allocation}</p>}
        
        <div className="mt-2 text-sm text-gray-400">
          Total: {formData.DSA + formData.Dev}% (must equal 100%)
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2"
        >
          <span>Next: Questions</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Questions Configuration Page
const QuestionsConfig = ({ onNext, onBack, formData, setFormData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('dev');

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answer: '' }]
    }));
  };

  const handleRemoveQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleAddDSATopic = () => {
    setFormData(prev => ({
      ...prev,
      dsa_topics: [...prev.dsa_topics, { topic: '', difficulty: 'Medium', number_of_questions: 1 }]
    }));
  };

  const handleRemoveDSATopic = (index) => {
    setFormData(prev => ({
      ...prev,
      dsa_topics: prev.dsa_topics.filter((_, i) => i !== index)
    }));
  };

  const handleDSATopicChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dsa_topics: prev.dsa_topics.map((topic, i) => 
        i === index ? { ...topic, [field]: value } : topic
      )
    }));
  };

 // Replace the generateQuestionsWithGemini function with this corrected version:

const generateQuestionsWithGemini = async () => {
  

  if (!GEMINI_API_KEY) {
    alert('Gemini API key not configured');
    return;
  }

  setIsGenerating(true);
  try {
    const prompt = `Generate ${Math.ceil(formData.Dev / 10)} technical interview questions for a ${formData.post} position with ${formData.experience} years of experience. Job description: ${formData.desc}. 
    
    Return ONLY a valid JSON array of objects with 'question' and 'answer' fields. Make questions relevant to the role and experience level. Do not include any markdown formatting or explanatory text.
    
    Example format:
    [
      {
        "question": "What is the difference between let and var in JavaScript?",
        "answer": "let has block scope while var has function scope. let variables cannot be redeclared in the same scope."
      }
    ]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean the response - remove any markdown formatting
    let cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON from the response
    let jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // If no array found, try to find the first [ and last ]
      const firstBracket = cleanedText.indexOf('[');
      const lastBracket = cleanedText.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
      }
    } else {
      cleanedText = jsonMatch[0];
    }
    
    try {
      const questions = JSON.parse(cleanedText);
      if (Array.isArray(questions) && questions.length > 0) {
        // Validate the structure
        const validQuestions = questions.filter(q => 
          q && typeof q === 'object' && 
          typeof q.question === 'string' && 
          typeof q.answer === 'string' &&
          q.question.trim() !== '' && 
          q.answer.trim() !== ''
        );
        
        if (validQuestions.length > 0) {
          setFormData(prev => ({
            ...prev,
            questions: validQuestions.slice(0, 10) // Limit to 10 questions
          }));
          alert(`Successfully generated ${validQuestions.length} questions!`);
        } else {
          throw new Error('No valid questions found in response');
        }
      } else {
        throw new Error('Response is not a valid array of questions');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Cleaned text:', cleanedText);
      throw new Error('Failed to parse generated questions. Please try again.');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    alert(`Failed to generate questions: ${error.message}. Please add them manually.`);
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="w-6 h-6 mr-2 text-purple-400" />
          <h2 className="text-2xl font-bold">Questions Configuration</h2>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('dev')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'dev' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Development Questions</span>
        </button>
        <button
          onClick={() => setActiveTab('dsa')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'dsa' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>DSA Topics</span>
        </button>
      </div>

      {/* Development Questions Tab */}
      {activeTab === 'dev' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Development Questions ({formData.Dev}%)</h3>
            <div className="flex space-x-2">
              <button
                onClick={generateQuestionsWithGemini}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
              </button>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {formData.questions.map((question, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-400">Question {index + 1}</span>
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <textarea
                    value={question.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    placeholder="Enter your question..."
                    className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
                  />
                  <textarea
                    value={question.answer}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    placeholder="Enter the expected answer..."
                    className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-16"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DSA Topics Tab */}
      {activeTab === 'dsa' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">DSA Topics ({formData.DSA}%)</h3>
            <button
              onClick={handleAddDSATopic}
              className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Topic</span>
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {formData.dsa_topics.map((topic, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-400">Topic {index + 1}</span>
                  <button
                    onClick={() => handleRemoveDSATopic(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Topic</label>
                    <input
                      type="text"
                      value={topic.topic}
                      onChange={(e) => handleDSATopicChange(index, 'topic', e.target.value)}
                      placeholder="e.g., Trees, Graphs"
                      className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      value={topic.difficulty}
                      onChange={(e) => handleDSATopicChange(index, 'difficulty', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Questions</label>
                    <input
                      type="number"
                      value={topic.number_of_questions}
                      onChange={(e) => handleDSATopicChange(index, 'number_of_questions', parseInt(e.target.value) || 1)}
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-600 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2"
        >
          <span>Next: Review</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Review and Submit Page
const ReviewSubmit = ({ onBack, formData, onSubmit, isLoading }) => {
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Eye className="w-6 h-6 mr-2 text-purple-400" />
          <h2 className="text-2xl font-bold">Review & Submit</h2>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-400">Position:</span>
              <p className="text-white">{formData.post}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Experience Required:</span>
              <p className="text-white">{formData.experience} years</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm font-medium text-gray-400">Description:</span>
              <p className="text-white">{formData.desc}</p>
            </div>
          </div>
        </div>

        {/* Timing Information */}
        <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Timing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-400">Submission Deadline:</span>
              <p className="text-white">{formatDateTime(formData.submissionDeadline)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Duration:</span>
              <p className="text-white">{formData.duration} minutes</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Start Time:</span>
              <p className="text-white">{formatDateTime(formData.startTime)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">End Time:</span>
              <p className="text-white">{formatDateTime(formData.endTime)}</p>
            </div>
          </div>
        </div>

        {/* Question Configuration */}
        <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Question Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-400">DSA Questions:</span>
              <p className="text-white">{formData.DSA}%</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Development Questions:</span>
              <p className="text-white">{formData.Dev}%</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Resume Questions:</span>
              <p className="text-white">{formData.ask_questions_on_resume ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-400">Development Questions:</span>
              <p className="text-white">{formData.questions.length} questions</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">DSA Topics:</span>
              <p className="text-white">{formData.dsa_topics.length} topics</p>
            </div>
          </div>
        </div>

        {/* Development Questions Preview */}
        {formData.questions.length > 0 && (
          <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Development Questions Preview</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {formData.questions.slice(0, 3).map((question, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-400">{index + 1}.</span>
                  <span className="text-white ml-2">{question.question}</span>
                </div>
              ))}
              {formData.questions.length > 3 && (
                <div className="text-sm text-gray-400">
                  ... and {formData.questions.length - 3} more questions
                </div>
              )}
            </div>
          </div>
        )}

        {/* DSA Topics Preview */}
        {formData.dsa_topics.length > 0 && (
          <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">DSA Topics Preview</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {formData.dsa_topics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-white">{topic.topic}</span>
                  <div className="flex space-x-4">
                    <span className="text-gray-400">Difficulty: {topic.difficulty}</span>
                    <span className="text-gray-400">Questions: {topic.number_of_questions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-600 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Creating Interview...' : 'Create Interview'}</span>
        </button>
      </div>
    </div>
  );
};

// Main Interview Creation Component
const InterviewCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    desc: '',
    post: '',
    experience: 0,
    submissionDeadline: '',
    startTime: '',
    endTime: '',
    duration: 60,
    DSA: 60,
    Dev: 40,
    ask_questions_on_resume: true,
    questions: [],
    dsa_topics: []
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
  
    try {
      const payload = {
        desc: formData.desc,
        post: formData.post,
        experience: formData.experience.toString(),
        submissionDeadline: new Date(formData.submissionDeadline).toISOString(),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        duration: formData.duration,
        DSA: formData.DSA,
        Dev: formData.Dev,
        ask_questions_on_resume: formData.ask_questions_on_resume,
        questions: formData.questions,
        dsa_topics: formData.dsa_topics
      };
  
      const token = getAuthToken(); // Get token from localStorage manually

const response = await fetch(`${baseUrl}interview/create-interview/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  },
  body: JSON.stringify(payload),
});

  
      if (response.ok) {
        const data = await response.json();
        showMessage('Interview created successfully!', 'success');
  
        // Reset the form
        setTimeout(() => {
          setFormData({
            desc: '',
            post: '',
            experience: 0,
            submissionDeadline: '',
            startTime: '',
            endTime: '',
            duration: 60,
            DSA: 60,
            Dev: 40,
            ask_questions_on_resume: true,
            questions: [],
            dsa_topics: []
          });
          setCurrentStep(1);
        }, 2000);
      } else {
        let errorMessage = 'Failed to create interview';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMessage = errorData.detail;
        } catch (err) {
          // Ignore JSON parse errors (e.g., plain text response)
        }
        showMessage(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      showMessage('Server error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Interview Setup';
      case 2: return 'Questions Configuration';
      case 3: return 'Review & Submit';
      default: return 'Interview Creation';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Header />
      
      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 ml-2 transition-all duration-300 ${
                      currentStep > step ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/10'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Step {currentStep} of 3: {getStepTitle()}
            </div>
          </div>
        </div>
      </div>
      
      <FormContainer isVisible={isVisible}>
        {currentStep === 1 && (
          <InterviewSetup
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        
        {currentStep === 2 && (
          <QuestionsConfig
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        
        {currentStep === 3 && (
          <ReviewSubmit
            onBack={handleBack}
            formData={formData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </FormContainer>
      
      <Footer />

      <MessageNotification
        message={message}
        messageType={messageType}
        onClose={clearMessage}
      />
    </div>
  );
};

export default InterviewCreation;