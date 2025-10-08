// // src/components/quiz/QuizInterface.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./QuizInterface.css";

// const QuizInterface = ({ difficulty, level, lessonContent }) => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState("");
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
//   const [isLoading, setIsLoading] = useState(false);
//   const [quizStarted, setQuizStarted] = useState(false);

//   // ---------------- AI QUIZ GENERATION ----------------
//   useEffect(() => {
//     const generateQuiz = async () => {
//       if (!lessonContent) return;
//       setIsLoading(true);

//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.post(
//           "http://localhost:5000/api/quiz/ai-generate",
//           {
//             lessonContent,
//             numberOfQuestions: 10, // always request 10 questions
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data.success && res.data.questions) {
//           setQuestions(res.data.questions);
//         } else {
//           console.error("AI returned no questions:", res.data);
//           setQuestions([]);
//         }
//       } catch (err) {
//         console.error("Error generating AI quiz:", err);

//         // fallback: basic sample questions
//         setQuestions([
//           {
//             question: `Sample Question 1 based on ${lessonContent.slice(0, 20)}...`,
//             options: ["Option A", "Option B", "Option C", "Option D"],
//             answer: "a",
//           },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (quizStarted) generateQuiz();
//   }, [quizStarted, lessonContent]);

//   // ---------------- TIMER ----------------
//   useEffect(() => {
//     let interval;
//     if (quizStarted && timeLeft > 0 && !showScore) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       handleTimeUp();
//     }
//     return () => clearInterval(interval);
//   }, [quizStarted, timeLeft, showScore]);

//   // ---------------- HANDLERS ----------------
//   const handleTimeUp = () => {
//     setShowScore(true);
//     saveQuizProgress();
//   };

//   const handleAnswerSelect = (answerIndex) => {
//     setSelectedAnswer(answerIndex);
//   };

//   const handleNext = () => {
//     const correctAnswer =
//       questions[currentQuestion]?.answer ||
//       questions[currentQuestion]?.correctAnswer;

//     if (
//       selectedAnswer !== "" &&
//       (selectedAnswer === correctAnswer ||
//         String.fromCharCode(97 + selectedAnswer) === correctAnswer)
//     ) {
//       setScore((prev) => prev + 1);
//     }

//     if (currentQuestion + 1 < questions.length) {
//       setCurrentQuestion(currentQuestion + 1);
//       setSelectedAnswer("");
//     } else {
//       setShowScore(true);
//       saveQuizProgress();
//     }
//   };

//   const saveQuizProgress = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/progress/quiz/${difficulty}/${level}`,
//         {
//           score,
//           totalQuestions: questions.length,
//           passed: score >= questions.length * 0.7,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       console.error("Error saving quiz progress:", err);
//     }
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remaining = seconds % 60;
//     return `${minutes}:${remaining.toString().padStart(2, "0")}`;
//   };

//   const startQuiz = () => setQuizStarted(true);

//   // ---------------- UI STATES ----------------
//   if (!quizStarted) {
//     return (
//       <div className="quiz-start-screen">
//         <h2>🎯 Ready for Battle?</h2>
//         <p>AI will generate 10 random questions based on your lesson.</p>
//         <button onClick={startQuiz} className="start-battle-btn">
//           🚀 START BATTLE
//         </button>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="quiz-loading">
//         <div className="loading-spinner"></div>
//         <h3>Generating your personalized quiz...</h3>
//         <p>AI is analyzing your lesson notes 📚</p>
//       </div>
//     );
//   }

//   if (showScore) {
//     const percentage = Math.round((score / questions.length) * 100);
//     const passed = percentage >= 70;

//     return (
//       <div className="quiz-score">
//         <div className={`score-card ${passed ? "passed" : "failed"}`}>
//           <h2>{passed ? "🎉 Victory!" : "💪 Keep Trying!"}</h2>
//           <div className="score-circle">
//             <span className="score-percentage">{percentage}%</span>
//             <span className="score-text">
//               {score}/{questions.length} Correct
//             </span>
//           </div>
//           <p>
//             {passed
//               ? `You've mastered ${difficulty} Level ${level}!`
//               : `You need ${Math.ceil(questions.length * 0.7)} correct answers to pass.`}
//           </p>
//           <div className="score-actions">
//             <button onClick={() => window.location.reload()} className="retry-btn">
//               🔄 Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ---------------- MAIN QUIZ UI ----------------
//   return (
//     <div className="quiz-interface">
//       <div className="quiz-header">
//         <div className="quiz-info">
//           <span className="difficulty-badge">{difficulty}</span>
//           <span className="level-badge">Level {level}</span>
//           <span className="timer">⏱️ {formatTime(timeLeft)}</span>
//         </div>
//         <div className="progress">
//           Question {currentQuestion + 1} of {questions.length}
//         </div>
//       </div>

//       <div className="question-card">
//         <h3 className="question-text">{questions[currentQuestion]?.question}</h3>

//         <div className="options-grid">
//           {questions[currentQuestion]?.options?.map((option, index) => (
//             <button
//               key={index}
//               className={`option-btn ${
//                 selectedAnswer === index ? "selected" : ""
//               }`}
//               onClick={() => handleAnswerSelect(index)}
//             >
//               <span className="option-letter">
//                 {String.fromCharCode(65 + index)}
//               </span>
//               <span className="option-text">{option}</span>
//             </button>
//           ))}
//         </div>

//         <div className="quiz-actions">
//           <button
//             onClick={handleNext}
//             disabled={selectedAnswer === ""}
//             className="next-btn"
//           >
//             {currentQuestion === questions.length - 1
//               ? "Finish Battle"
//               : "Next Question"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizInterface;
