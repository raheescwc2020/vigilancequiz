import React, { useState, useEffect, useRef, useCallback } from 'react';

// Configuration Data
const questions = [
  { id: 1, questionText: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswer: 'Paris' },
  { id: 2, questionText: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 'Mars' },
  { id: 3, questionText: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
  { id: 4, questionText: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Monet'], correctAnswer: 'Leonardo da Vinci' },
  { id: 5, questionText: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 'Pacific' },
  { id: 6, questionText: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NACL'], correctAnswer: 'H2O' },
  { id: 7, questionText: 'How many continents are there?', options: ['5', '6', '7', '8'], correctAnswer: '7' },
  { id: 8, questionText: 'Which animal lays the largest eggs?', options: ['Chicken', 'Penguin', 'Ostrich', 'Eagle'], correctAnswer: 'Ostrich' },
  { id: 9, questionText: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctAnswer: 'Diamond' },
  { id: 10, questionText: 'What is the sum of all internal angles of a triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: '180°' },
];

const TOTAL_TIME_SECONDS = 10 * 60; // 


const N8N_WEBHOOK_URL = 'https://raheesmohammed.app.n8n.cloud/webhook-test/6c565947-a42c-4bad-b850-d00ad8598ef8';


const Timer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const textColor = timeLeft <= 60 ? 'text-red-500' : 'text-gray-700';

  return (
    <div className={`text-xl font-mono p-2 rounded-lg bg-white shadow-inner border border-gray-200 ${textColor}`}>
      Time Left: <span className="font-bold">{timeString}</span>
    </div>
  );
};

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3.5 mb-6 overflow-hidden shadow-inner">
      <div
        className="bg-indigo-500 h-3.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-sm text-center mt-2 text-gray-600 font-medium">{current} / {total} Answered</p>
    </div>
  );
};

const Result = ({ score, totalQuestions }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const feedback = score === totalQuestions ? 'Perfect Score! Well done!' : percentage >= 70 ? 'Great job! You passed!' : 'Keep practicing!';

  return (
    <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-lg mx-auto transform transition-all duration-500 scale-100">
      <h2 className="text-4xl font-extrabold text-indigo-600 mb-4">Quiz Complete!</h2>
      <p className="text-6xl font-black text-gray-800 my-6">{percentage}%</p>
      <p className="text-2xl font-semibold text-gray-700 mb-2">
        Your Score: {score} out of {totalQuestions}
      </p>
      <p className="text-lg text-gray-500 mb-8">{feedback}</p>
    </div>
  );
};

const Question = ({ question, onAnswer, selectedAnswer }) => {
  const handleOptionClick = (option) => {
    onAnswer(question.id, option);
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-xl border border-gray-100 mb-6">
      <p className="text-xl font-bold mb-4 text-gray-800">
        Q{question.id}: {question.questionText}
      </p>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`
              w-full text-left p-3 rounded-lg border-2 font-medium transition-all duration-200
              ${selectedAnswer === option
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-300 transform scale-[1.02]'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-indigo-100 hover:border-indigo-300'
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
      </div>
    </div>
  );
};

const StartScreen = ({ employeeName, setEmployeeName, employeeEmail, setEmployeeEmail, startQuiz, errorMessage }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-indigo-600 text-center mb-6">Welcome to the Quiz!</h1>
      <p className="text-gray-600 text-center mb-8">Please enter your details to begin the 10-minute competition.</p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Full Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
        <input
          type="email"
          placeholder="Your Email Address"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 mt-4 text-center font-medium">{errorMessage}</p>
      )}

      <button
        onClick={startQuiz}
        className="w-full mt-8 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Start Quiz
      </button>
    </div>
  </div>
);


// --- Main App Component ---

const App = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: 'answer' }
  const [quizFinished, setQuizFinished] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [startError, setStartError] = useState('');
  // State to store the unique start time of the quiz
  const [quizStartTime, setQuizStartTime] = useState(null); 


  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const intervalRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];
  // Calculate answered questions (excluding undefined or null answers which indicate unanswered/skipped)
  const answeredCount = Object.keys(userAnswers).filter(id => userAnswers[id] !== undefined && userAnswers[id] !== null).length;

  const calculateScore = useCallback(() => {
    let score = 0;
    questions.forEach(q => {
      // Check if the user has an answer for this question and if it matches the correct answer
      if (userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  }, [userAnswers]);

  // Exponential backoff for API retries
  const sendQuizResultsToN8n = useCallback(async () => {
    const score = calculateScore();
    const totalQuestions = questions.length;

    // --- FIX APPLIED HERE ---
    // BUG FIX: timeTakenSeconds was used but never defined. 
    // It should be calculated as the total time minus the remaining time.
    const timeTakenSeconds = TOTAL_TIME_SECONDS - timeLeft; 
    // -----------------------

    const timeTakenMinutes = (timeTakenSeconds / 60).toFixed(2);

    const finalAnswers = questions.map(q => ({
      questionId: q.id,
      questionText: q.questionText,
      // If userAnswers[q.id] is undefined or null, mark as 'Skipped/No Answer'
      userAnswer: userAnswers[q.id] || 'Skipped/No Answer', 
      correctAnswer: q.correctAnswer,
      isCorrect: userAnswers[q.id] === q.correctAnswer,
    }));

    const payload = {
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      quizStartTime: quizStartTime, // INCLUDED NEW TIMESTAMP FIELD
      score: score,
      totalQuestions: totalQuestions,
      answers: finalAnswers,
     timeTaken: timeTakenMinutes,
      completionTime: new Date().toISOString() // Optional: Timestamp when the quiz ended
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log(`Quiz results sent to n8n successfully on attempt ${attempt}.`);
          return; // Success, exit function
        }

        // Throw error to trigger retry logic
        throw new Error(`Failed with status: ${response.status}`);

      } catch (error) {
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`Attempt ${attempt} failed. Retrying in ${delay / 1000}s...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error('Final attempt failed to send quiz results to n8n:', error);
        }
      }
    }
    // The eslint-disable was removed as the dependencies are correct now
  }, [employeeName, employeeEmail, timeLeft, userAnswers, calculateScore, quizStartTime]); 


  // Timer Setup Effect
  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setQuizFinished(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [quizStarted, quizFinished]);

  // Quiz Finish Effect
  useEffect(() => {
    if (quizFinished) {
      clearInterval(intervalRef.current);
      sendQuizResultsToN8n();
    }
  }, [quizFinished, sendQuizResultsToN8n]);

  // --- Handlers ---

  const startQuiz = () => {
    if (employeeName.trim() && employeeEmail.trim() && employeeEmail.includes('@')) {
      setStartError('');
      setQuizStartTime(new Date().toISOString()); // CAPTURE UNIQUE UTC TIMESTAMP
      setQuizStarted(true);
    } else {
      setStartError("Please provide a valid name and email to start the quiz.");
    }
  };

  const handleAnswer = (questionId, answer) => {
    // Allows the user to overwrite a previous answer by clicking a new option.
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const finishQuiz = () => {
    // Explicitly set any unanswered questions to null before finishing
    const updatedAnswers = { ...userAnswers };
    questions.forEach(q => {
      if (updatedAnswers[q.id] === undefined) {
        updatedAnswers[q.id] = null;
      }
    });
    setUserAnswers(updatedAnswers);
    setQuizFinished(true);
  };

  // --- Render Logic ---

  if (!quizStarted) {
    return (
      <StartScreen
        employeeName={employeeName}
        setEmployeeName={setEmployeeName}
        employeeEmail={employeeEmail}
        setEmployeeEmail={setEmployeeEmail}
        startQuiz={startQuiz}
        errorMessage={startError}
      />
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Result score={calculateScore()} totalQuestions={questions.length} />
        <button
          onClick={() => window.location.reload()}
          className="mt-8 py-3 px-6 bg-indigo-500 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-600 transition duration-200 transform hover:scale-105"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  // Main Quiz Content
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 text-center mb-6">Online Quiz Challenge</h1>

        {/* Header/Status Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-medium text-gray-800">{employeeName}</h2>
            <p className="text-sm text-gray-500">{employeeEmail}</p>
          </div>
          <Timer timeLeft={timeLeft} />
        </div>

        <ProgressBar current={answeredCount} total={questions.length} />

        {/* Question Navigation Map */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Questions ({questions.length})</h3>
          <div className="flex flex-wrap gap-3">
            {questions.map((q, index) => {
              // Determine status: null/undefined = Unanswered/Skipped (Red), any answer = Answered (Green)
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
              const statusClass = isAnswered
                ? 'bg-green-200 text-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(index)}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-150
                    ${currentQuestionIndex === index ? 'ring-4 ring-indigo-400 border-2 border-white scale-110' : ''}
                    ${statusClass}
                  `}
                  title={isAnswered ? 'Answered' : 'Unanswered'}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Display */}
        {currentQuestion && (
          <Question
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={userAnswers[currentQuestion.id]}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 mb-12">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 hover:bg-gray-400 shadow-md"
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-300"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={finishQuiz}
              className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg shadow-green-300 transform scale-105"
            >
              Finish Quiz
            </button>
          )}
        </div>

        {/* Fixed 'Submit' button if all questions are answered */}
        {(answeredCount === questions.length && !quizFinished) && (
            <div className="fixed bottom-4 right-4 z-10">
                <button
                   onClick={finishQuiz}
                   className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-2xl hover:bg-green-700 transition-all duration-200 transform scale-100 hover:scale-105"
                >
                   Submit All Answers
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default App;
