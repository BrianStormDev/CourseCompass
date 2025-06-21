import { useState, useEffect } from "react";
import "./CoursePlannerQuestionnaire.css"; // Import the CSS file

export default function CoursePlannerQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    school: "",
    major: ""
  });
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schoolsError, setSchoolsError] = useState(null);

  const questions = [
    {
      id: 1,
      title: "What school do you currently attend?",
      type: "dropdown",
      placeholder: "Select your school...",
      key: "school"
    },
    {
      id: 2,
      title: "What is your major or field of study?",
      type: "text",
      placeholder: "Enter your major...",
      key: "major"
    }
  ];

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      setSchoolsError(null);
      
      try {
        // Replace this URL with your actual API endpoint
        const response = await fetch('https://api.example.com/schools');
        
        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }
        
        const data = await response.json();
        
        // Assuming the API returns an array of school objects with 'name' property
        // Adjust this based on your API response structure
        const schoolList = Array.isArray(data) ? data : data.schools || [];
        setSchools(schoolList);
        
      } catch (error) {
        console.error('Error fetching schools:', error);
        setSchoolsError(error.message);
        
        // Fallback list of schools if API fails
        setSchools([
          { id: 1, name: "Harvard University" },
          { id: 2, name: "Stanford University" },
          { id: 3, name: "MIT" },
          { id: 4, name: "University of California, Berkeley" },
          { id: 5, name: "Yale University" },
          { id: 6, name: "Princeton University" },
          { id: 7, name: "Columbia University" },
          { id: 8, name: "University of Chicago" },
          { id: 9, name: "University of Pennsylvania" },
          { id: 10, name: "Cornell University" }
        ]);
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  const handleInputChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData.key];

  return (
    <div className="questionnaire-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">Course Planner</h1>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="questionnaire-card">
          {/* Question Container with sliding animation */}
          <div className="questions-container">
            <div 
              className="questions-slider"
              style={{ transform: `translateX(-${currentQuestion * 100}%)` }}
            >
              {questions.map((question, index) => (
                <div key={question.id} className="question-slide">
                  {/* Question Number */}
                  <div className="question-number-container">
                    <div className="question-number">
                      {question.id}
                    </div>
                  </div>

                  {/* Question Title */}
                  <h2 className="question-title">
                    {question.title}
                  </h2>

                  {/* Input Field */}
                  <div className="input-container">
                    {question.type === 'dropdown' ? (
                      <div className="dropdown-container">
                        <select
                          value={answers[question.key]}
                          onChange={(e) => handleInputChange(question.key, e.target.value)}
                          className="question-dropdown"
                          disabled={loadingSchools}
                        >
                          <option value="">
                            {loadingSchools ? 'Loading schools...' : question.placeholder}
                          </option>
                          {schools.map((school) => (
                            <option key={school.id || school.name} value={school.name}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                        {schoolsError && (
                          <div className="error-message">
                            Error loading schools. Using fallback list.
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={question.type}
                        placeholder={question.placeholder}
                        value={answers[question.key]}
                        onChange={(e) => handleInputChange(question.key, e.target.value)}
                        className="question-input"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-container">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`nav-button previous-button ${
                currentQuestion === 0 ? 'disabled' : ''
              }`}
            >
              Previous
            </button>

            <div className="progress-dots">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${
                    index === currentQuestion ? 'active' : 'inactive'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1 || !currentAnswer.trim()}
              className={`nav-button next-button ${
                (currentQuestion === questions.length - 1 || !currentAnswer.trim()) ? 'disabled' : ''
              }`}
            >
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            </button>
          </div>

          {/* Progress indicator */}
          <div className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
}
