import React from 'react';

function Question({ question, onAnswer, onSkip, selectedAnswer }) {
  return (
    <div className="question-card">
      <h2>{question.questionText}</h2>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onAnswer(question.id, option)}
            disabled={selectedAnswer !== undefined && selectedAnswer !== null} // Disable after selection
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer === undefined && ( // Only show skip if not yet answered/skipped
        <button className="skip-button" onClick={() => onSkip(question.id)}>Skip Question</button>
      )}
      {selectedAnswer === null && ( // If skipped, allow to answer
        <p className="skipped-indicator">This question was skipped. Choose an option to answer.</p>
      )}
    </div>
  );
}

export default Question;