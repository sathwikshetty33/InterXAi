import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Send, CheckCircle, XCircle, Code, AlertCircle } from 'lucide-react';
import { getAuthToken, fetchWithToken } from '../utils/handleToken';
import { useParams,useNavigate } from 'react-router-dom';
// Import token utilities (you'll need to add these to your project)

const TIME_LIMIT = 30 * 60; // 30 minutes in seconds
const LANGUAGES = ['Python', 'C++', 'Java'];
const CODE_TEMPLATES = {
  Python: `# Write your solution here
def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
  'C++': `#include <iostream>
#include <vector>
using namespace std;

// Write your solution here
int solution() {
    // Your code here
    return 0;
}

int main() {
    int result = solution();
    cout << result << endl;
    return 0;
}`,
  Java: `public class Solution {
    // Write your solution here
    public static int solution() {
        // Your code here
        return 0;
    }
    
    public static void main(String[] args) {
        int result = solution();
        System.out.println(result);
    }
}`
};

const DSAInterviewPlatform = ({  navigate }) => {
  
  const params = useParams();
  const nav=useNavigate();
  const { sessionId } = params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [dsaTopics, setDsaTopics] = useState([]); // Backend topics
  
  const [code, setCode] = useState(CODE_TEMPLATES.Python);
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [runsLeft, setRunsLeft] = useState({0: 3, 1: 3, 2: 3});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const runSingleTest = () => {
    const remainingRuns = runsLeft[currentQuestionIndex] || 0;
    if (remainingRuns <= 0) {
      setRunResult({
        isOutput: false,
        message: 'No runs left for this question'
      });
      return;
    }
    
    setIsTestRunning(true);
    setRunResult(null);
    const question = questions[currentQuestionIndex];
    
    // Simulate code execution
    setTimeout(() => {
      setRunsLeft(prev => ({
        ...prev,
        [currentQuestionIndex]: remainingRuns - 1
      }));
      
      setRunResult({
        isOutput: true,
        message: question.sampleOutput,
        expected: question.sampleOutput
      });
      setIsTestRunning(false);
    }, 1500);
  };

  const submitQuestion = () => {
    setIsTestRunning(true);
    setTestResult(null);
    const question = questions[currentQuestionIndex];
    
    // Simulate test execution
    setTimeout(() => {
      const passedTests = 2; // Simulate partial success
      const totalTests = question.testCases.length;
      const allPassed = passedTests === totalTests;
      const questionScore = allPassed ? 10 : Math.floor((passedTests / totalTests) * 10);
      
      const newSubmission = {
        questionIndex: currentQuestionIndex,
        questionId: question.id,
        code,
        passedTests,
        totalTests,
        score: questionScore,
        allPassed,
        title: question.title,
        topic: question.topic
      };
      
      const updatedSubmissions = submittedQuestions.filter(sub => sub.questionIndex !== currentQuestionIndex);
      updatedSubmissions.push(newSubmission);
      setSubmittedQuestions(updatedSubmissions);
      
      const totalScore = updatedSubmissions.reduce((acc, sub) => acc + sub.score, 0);
      setScore(totalScore);
      
      setTestResult(newSubmission);
      setIsTestRunning(false);
    }, 2000);
  };

  const handleQuestionSelect = (index) => {
    if (index === currentQuestionIndex) return;
    
    setCurrentQuestionIndex(index);
    const submitted = submittedQuestions.find(sub => sub.questionIndex === index);
    
    if (submitted) {
      setCode(submitted.code);
      setTestResult(submitted);
    } else {
      setCode(CODE_TEMPLATES[selectedLanguage]);
      setTestResult(null);
    }
    setRunResult(null);
    setSidebarOpen(false);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    
    const isSubmitted = submittedQuestions.some(sub => sub.questionIndex === currentQuestionIndex);
    if (!isSubmitted) {
      setCode(CODE_TEMPLATES[newLanguage]);
    }
    
    setTestResult(null);
    setRunResult(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isSubmitted = submittedQuestions.some(sub => sub.questionIndex === currentQuestionIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    InterXAI
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">AI-Powered Coding Interview</p>
                </div>
              </div>
            </div>

            {/* Timer and Score */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-purple-100">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className={`text-sm font-mono font-bold ${
                  timeLeft < 300 ? 'text-red-500' : timeLeft < 600 ? 'text-orange-500' : 'text-purple-600'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Score: {score}/{questions.length * 10}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Question Navigation */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 bg-white/90 backdrop-blur-sm border-r border-purple-100 h-screen overflow-y-auto transition-transform duration-300`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Challenge Progress</h2>
              <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {submittedQuestions.length}/{questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(submittedQuestions.length / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((submittedQuestions.length / questions.length) * 100)}% Complete
              </p>
            </div>

            {/* Question List */}
            <div className="space-y-3">
              {questions.map((q, index) => {
                const submission = submittedQuestions.find(sub => sub.questionIndex === index);
                const isActive = currentQuestionIndex === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-lg transform scale-105'
                        : submission
                        ? submission.allPassed
                          ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                          : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                        Problem {index + 1}
                      </div>
                      {submission && (
                        <div className="flex items-center">
                          {submission.allPassed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`font-semibold mb-1 text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {q.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`text-xs ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                        {q.topic}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : q.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : q.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {q.difficulty}
                      </div>
                    </div>
                    {submission && (
                      <div className={`text-xs mt-2 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                        Score: {submission.score}/10 • {submission.passedTests}/{submission.totalTests} tests
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Accuracy</span>
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {submittedQuestions.length > 0 
                    ? Math.round((submittedQuestions.filter(s => s.allPassed).length / submittedQuestions.length) * 100)
                    : 0}%
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Progress</span>
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {Math.round((submittedQuestions.length / questions.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Problem Panel */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
                      <div className="flex items-center space-x-3">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          {currentQuestion.difficulty}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          {currentQuestion.topic}
                        </span>
                      </div>
                    </div>
                    {isSubmitted && (
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                        testResult.allPassed ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {testResult.allPassed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span className="font-medium">
                          {testResult.allPassed ? 'Solved' : 'Partial'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-purple-600" />
                      Problem Statement
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                      {currentQuestion.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Play className="h-4 w-4 mr-2 text-blue-600" />
                      Sample Test Case
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-2 font-mono text-sm border border-purple-100">
                      <div><span className="text-blue-600 font-medium">Input:</span> <span className="text-gray-800">{currentQuestion.sampleInput}</span></div>
                      <div><span className="text-purple-600 font-medium">Output:</span> <span className="text-gray-800">{currentQuestion.sampleOutput}</span></div>
                    </div>
                  </div>

                  {runResult && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-purple-600" />
                        Execution Result ({runsLeft[currentQuestionIndex] || 0} runs remaining)
                      </h4>
                      {runResult.isOutput ? (
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded border-l-4 border-purple-400 font-mono text-sm">
                            <div className="text-purple-600 text-xs mb-1 font-medium">Your Output:</div>
                            <div className="text-gray-900">{runResult.message}</div>
                          </div>
                          <div className="bg-white p-3 rounded border-l-4 border-blue-400 font-mono text-sm">
                            <div className="text-blue-600 text-xs mb-1 font-medium">Expected:</div>
                            <div className="text-gray-900">{runResult.expected}</div>
                          </div>
                          <div className={`text-sm font-medium ${
                            runResult.message.trim() === runResult.expected.trim() 
                              ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {String(runResult.message).trim() === String(runResult.expected).trim()
                              ? '✓ Perfect match!' 
                              : '⚠ Output differs from expected'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-600 text-sm font-medium">{runResult.message}</div>
                      )}
                    </div>
                  )}

                  {testResult && (
                    <div className={`p-4 rounded-lg border-2 ${
                      testResult.allPassed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {testResult.allPassed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-orange-600" />
                          )}
                          <span className={`font-bold ${testResult.allPassed ? 'text-green-800' : 'text-orange-800'}`}>
                            {testResult.allPassed ? 'All Tests Passed!' : 'Partial Success'}
                          </span>
                        </div>
                        <span className={`font-bold ${testResult.allPassed ? 'text-green-800' : 'text-orange-800'}`}>
                          {testResult.passedTests}/{testResult.totalTests}
                        </span>
                      </div>
                      <div className={`text-sm font-medium ${testResult.allPassed ? 'text-green-700' : 'text-orange-700'}`}>
                        Score Earned: <span className="font-bold">{testResult.score}/10 points</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Editor Panel */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <h3 className="text-white font-medium flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Code Editor
                      </h3>
                    </div>
                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isSubmitted}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="p-6">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-80 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Write your solution here..."
                    disabled={isSubmitted}
                    style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                  />
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={runSingleTest}
                      disabled={isTestRunning || isSubmitted || !code.trim() || (runsLeft[currentQuestionIndex] || 0) <= 0}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isTestRunning ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Running...
                        </>
                      ) : (
                        `Run Code (${runsLeft[currentQuestionIndex] || 0} left)`
                      )}
                    </button>
                    
                    <button
                      onClick={submitQuestion}
                      disabled={isTestRunning || isSubmitted || !code.trim()}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isTestRunning ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Testing...
                        </>
                      ) : isSubmitted ? (
                        'Submitted ✓'
                      ) : (
                        'Submit Solution'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Submit Banner */}
            {submittedQuestions.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl text-white overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Ready to Submit?</h3>
                      <p className="text-purple-100">
                        {submittedQuestions.length} of {questions.length} problems completed • 
                        Total Score: {score}/{questions.length * 10} points
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        console.log('Final submission:', { score, submissions: submittedQuestions });
                        alert(`Interview completed! Final score: ${score}/${questions.length * 10}`);
                      }}
                      className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      disabled={isTestRunning}
                    >
                      <div className="flex items-center space-x-2">
                        <Send className="h-5 w-5" />
                        <span>Final Submit</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                      <div
                        className="bg-white h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${(submittedQuestions.length / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">AI Mock Interviews</h3>
                <p className="text-sm text-gray-600">Practice with intelligent AI that adapts to your skill level</p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Real-Time Feedback</h3>
                <p className="text-sm text-gray-600">Get instant feedback on your code and approach</p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Industry Preparation</h3>
                <p className="text-sm text-gray-600">Questions from top tech companies and startups</p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Performance Analytics</h3>
                <p className="text-sm text-gray-600">Track progress and identify areas for improvement</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500 text-sm">
              <p>© 2024 InterXAI - Master Every Interview with AI Coaching</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:text-purple-600 transition-colors">Features</a>
                <a href="#" className="hover:text-purple-600 transition-colors">How It Works</a>
                <a href="#" className="hover:text-purple-600 transition-colors">Resources</a>
                <a href="#" className="hover:text-purple-600 transition-colors">Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAInterviewPlatform;