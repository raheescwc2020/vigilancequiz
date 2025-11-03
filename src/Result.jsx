import React from 'react';

function Result({ score, totalQuestions }) {
  return (
    <div className="result-card">
      <h2>Quiz Finished!</h2>
      <p>Your Score: {score} out of {totalQuestions}</p>
      {score >= totalQuestions / 2 ? (
        <p>Great job!</p>
      ) : (
        <p>Keep practicing!</p>
      )}
    </div>
  );
}

export default Result;