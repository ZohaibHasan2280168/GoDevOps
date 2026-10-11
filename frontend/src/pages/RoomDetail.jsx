import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { getRoomProgress, joinRoom, submitExercise, submitQuiz } from "../services/roomProgress"
import { Play, Lock, CheckCircle, Clock, Trophy, Users, ArrowRight, ArrowLeft } from "lucide-react"

const RoomDetail = () => {
  const { slug: roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useApp()
  const [room, setRoom] = useState(null)
  const [userProgress, setUserProgress] = useState({
    joined: false,
    currentLecture: 0,
    completedLectures: [],
    exerciseAnswers: {},
    quizCompleted: false,
    finalScore: null
  })
  const [currentView, setCurrentView] = useState('overview') // overview, lecture, exercise, quiz
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0)
  const [exerciseAnswer, setExerciseAnswer] = useState('')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  // Load room data and user progress
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        // Category-specific room data
        const getRoomData = (roomId) => {
          if (roomId === 'intro-restful-apis-backend-basics') {
            return {
              id: roomId,
              title: "RESTful APIs & Backend Basics",
              description: "Learn the fundamentals of RESTful APIs and backend development for modern web applications.",
              difficulty: "Beginner",
              estimatedTime: "20 mins",
              points: 400,
              participants: 6,
              isPremium: false,
              lectures: [
                {
                  id: 1,
                  title: "Introduction to RESTful API",
                  content: "In modern web development, RESTful APIs act as the backbone for communication between the frontend and backend of applications. A RESTful API (Representational State Transfer API) allows systems to exchange data over HTTP using standard methods like GET, POST, PUT, DELETE. It follows a client-server architecture, where the client sends requests and the server responds with structured data, usually in JSON format. REST APIs are lightweight, scalable, and easy to integrate, making them the standard choice for web and mobile apps. Key principles include: Stateless (each request contains all needed information), Uniform Interface (standard methods), Resource-Based (everything treated as a resource), and Cacheable (responses can be cached for performance).",
                  exercise: {
                    question: "Which HTTP method is typically used to retrieve data from a REST API?",
                    options: ["GET", "POST", "PUT", "DELETE"],
                    correctAnswer: 0
                  }
                },
                {
                  id: 2,
                  title: "Backend Basics",
                  content: "The backend of an application is the part that handles data storage, business logic, and communication with the frontend. It ensures that everything the user does on the interface works correctly behind the scenes. A typical backend consists of: Server (handles client requests and sends responses), Database (stores and manages application data like MySQL, MongoDB), and API (acts as a bridge between frontend and backend). Backend responsibilities include authenticating users and managing sessions, handling requests and processing logic, maintaining data integrity and security, and ensuring performance and scalability. Common backend technologies include languages like Node.js, Python, PHP, Java, and frameworks like Express.js, Django, Laravel, Spring Boot.",
                  exercise: {
                    question: "What is the primary role of a backend server?",
                    options: ["Display user interface", "Handle data storage and business logic", "Style web pages", "Manage browser cookies"],
                    correctAnswer: 1
                  }
                }
              ],
              quiz: {
                questions: [
                  {
                    question: "What does REST stand for in RESTful API?",
                    options: ["Representational State Transfer", "Remote State Transfer", "Relational State Transfer", "Responsive State Transfer"],
                    correctAnswer: 0
                  },
                  {
                    question: "Which data format is most commonly used in REST APIs?",
                    options: ["XML", "JSON", "CSV", "HTML"],
                    correctAnswer: 1
                  },
                  {
                    question: "What is a key characteristic of RESTful APIs?",
                    options: ["Stateful", "Stateless", "Session-dependent", "Client-specific"],
                    correctAnswer: 1
                  }
                ]
              }
            }
          } else {
            // Default web security room
            return {
              id: roomId,
              title: "Web Application Security Fundamentals",
              description: "Learn the basics of web application security including common vulnerabilities and how to exploit them.",
              difficulty: "Beginner",
              estimatedTime: "2-3 hours",
              points: 500,
              participants: 1247,
              isPremium: false,
          lectures: [
            {
              id: 1,
              title: "Introduction to Web Security",
              content: "Web Security refers to the protection of websites and servers from unauthorized access, data breaches, and other malicious attacks. It ensures: Confidentiality – Only authorized users can access data, Integrity – Data cannot be modified by unauthorized sources, and Availability – Websites remain accessible for legitimate users. Web security is important because it protects sensitive data, maintains user trust, prevents service downtime, and helps meet compliance requirements like GDPR and PCI DSS.",
              exercise: {
                question: "What does SQL injection allow an attacker to do?",
                options: [
                  "Execute arbitrary SQL commands",
                  "Steal user passwords",
                  "Access the database",
                  "All of the above"
                ],
                correctAnswer: 3
              }
            },
            {
              id: 2,
              title: "SQL Injection Basics",
              content: "SQL Injection (SQLi) is when attackers insert malicious SQL queries into input fields to access or modify databases. This vulnerability occurs when user input is not properly validated or sanitized before being used in SQL queries. Attackers can use SQLi to bypass authentication, extract sensitive data, modify database records, or even execute system commands. Common injection points include login forms, search boxes, and URL parameters. To prevent SQLi, always use parameterized queries, validate inputs, and implement proper error handling.",
              exercise: {
                question: "Which character is commonly used to test for SQL injection?",
                options: ["'", "\"", ";", "%"],
                correctAnswer: 0
              }
            },
            {
              id: 3,
              title: "Cross-Site Scripting (XSS)",
              content: "Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users. There are three main types: Stored XSS (script stored on server), Reflected XSS (script reflected from user input), and DOM-based XSS (script executes in browser DOM). XSS can steal cookies, session tokens, redirect users to malicious sites, or perform actions on behalf of users. Prevention includes input validation, output encoding, Content Security Policy (CSP), and sanitizing user-generated content.",
              exercise: {
                question: "What does XSS stand for?",
                options: [
                  "Cross-Site Scripting",
                  "Cross-System Security",
                  "Cross-Site Security",
                  "Cross-System Scripting"
                ],
                correctAnswer: 0
              }
            },
            {
              id: 4,
              title: "Security Best Practices",
              content: "Secure coding practices are essential for web security. Key practices include: Validate and sanitize all inputs to prevent SQLi and XSS, use HTTPS (SSL/TLS) to encrypt communications, implement proper authentication and authorization, hash and salt passwords before storing, keep software and dependencies updated, and limit error messages to avoid leaking system details. Additional security measures include using firewalls, implementing multi-factor authentication (MFA), regular backups, conducting penetration tests, and following the OWASP Top 10 guidelines for web application security.",
              exercise: {
                question: "Which is the best defense against SQL injection?",
                options: [
                  "Input filtering",
                  "Parameterized queries",
                  "Output encoding",
                  "Blacklisting"
                ],
                correctAnswer: 1
              }
            }
          ],
          quiz: {
            questions: [
              {
                question: "What is the primary goal of web application security?",
                options: [
                  "To make websites faster",
                  "To protect against unauthorized access and attacks",
                  "To improve user experience",
                  "To reduce server costs"
                ],
                correctAnswer: 1
              },
              {
                question: "Which vulnerability allows attackers to execute database commands?",
                options: ["XSS", "CSRF", "SQL Injection", "Directory Traversal"],
                correctAnswer: 2
              },
              {
                question: "What should you always validate in web applications?",
                options: ["User input", "Database queries", "Server responses", "All of the above"],
                correctAnswer: 3
              },
              {
                question: "Which HTTP method is generally safer for sensitive operations?",
                options: ["GET", "POST", "PUT", "DELETE"],
                correctAnswer: 1
              },
              {
                question: "What is the best way to store passwords?",
                options: ["Plain text", "Base64 encoding", "Hashed with salt", "Encrypted"],
                correctAnswer: 2
              }
              ]
              }
            }
          }
        }
        
        const mockRoom = getRoomData(roomId)
        setRoom(mockRoom)
        
        // Load user progress if authenticated
        if (user) {
          try {
            const progressData = await getRoomProgress(roomId)
            setUserProgress({
              joined: false,
              currentLecture: 0,
              completedLectures: [],
              exerciseAnswers: {},
              quizCompleted: false,
              finalScore: null,
              ...progressData.progress
            })
          } catch (error) {
            console.error('Failed to load progress:', error)
          }
        }
      } catch (error) {
        console.error('Failed to load room:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadRoomData()
  }, [roomId, user])

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomId)
      setUserProgress(prev => ({ ...prev, joined: true }))
      setCurrentView('lecture')
      setCurrentLectureIndex(0)
    } catch (error) {
      console.error('Failed to join room:', error)
      alert('Failed to join room. Please try again.')
    }
  }

  const handleLectureComplete = () => {
    setCurrentView('exercise')
  }

  const handleExerciseSubmit = async () => {
    const currentLecture = room.lectures[currentLectureIndex]
    const isCorrect = parseInt(exerciseAnswer) === currentLecture.exercise.correctAnswer
    
    try {
      const result = await submitExercise(roomId, currentLectureIndex, exerciseAnswer, isCorrect)
      
      setUserProgress(prev => ({
        ...prev,
        completedLectures: [...(prev.completedLectures || []), currentLectureIndex],
        exerciseAnswers: {
          ...prev.exerciseAnswers,
          [currentLectureIndex]: { answer: exerciseAnswer, correct: isCorrect }
        }
      }))

      // Trigger real-time update if available
      if (window.triggerRealtimeUpdate) {
        window.triggerRealtimeUpdate()
      }

      if (currentLectureIndex < room.lectures.length - 1) {
        setCurrentLectureIndex(currentLectureIndex + 1)
        setCurrentView('lecture')
        setExerciseAnswer('')
      } else {
        setCurrentView('quiz')
      }
    } catch (error) {
      console.error('Failed to submit exercise:', error)
      alert('Failed to submit exercise. Please try again.')
    }
  }

  const handleQuizSubmit = async () => {
    let correctAnswers = 0
    room.quiz.questions.forEach((question, index) => {
      if (parseInt(quizAnswers[index]) === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const score = Math.round((correctAnswers / room.quiz.questions.length) * 100)
    
    try {
      const result = await submitQuiz(roomId, score)
      setUserProgress(prev => ({
        ...prev,
        quizCompleted: true,
        finalScore: score
      }))
      
      // Trigger real-time update if available
      if (window.triggerRealtimeUpdate) {
        window.triggerRealtimeUpdate()
      }
      
      if (result.pointsEarned) {
        alert(`Congratulations! You earned ${result.pointsEarned} points!`)
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    }
  }

  const canAccessLecture = (lectureIndex) => {
    if (lectureIndex === 0) return userProgress.joined
    return userProgress.completedLectures.includes(lectureIndex - 1)
  }

  // Calculate room progress percentage
  const calculateProgress = () => {
    if (!userProgress.joined || !room) return 0
    const totalTasks = room.lectures.length + 1 // lectures + quiz
    const completedTasks = (userProgress.completedLectures || []).length + (userProgress.quizCompleted ? 1 : 0)
    return Math.round((completedTasks / totalTasks) * 100)
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/rooms')}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Rooms
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{room.title}</h1>
              <p className="text-slate-300 mb-4">{room.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {room.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {room.participants}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {room.points} points
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  room.difficulty === "Beginner" ? "bg-green-600 text-white" :
                  room.difficulty === "Intermediate" ? "bg-yellow-600 text-white" : "bg-red-600 text-white"
                }`}>
                  {room.difficulty}
                </span>
              </div>
              
              {/* Progress Bar */}
              {userProgress.joined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Room Progress</span>
                    <span className="text-sm text-blue-400">{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                    <span>{(userProgress.completedLectures || []).length + (userProgress.quizCompleted ? 1 : 0)} of {room.lectures.length + 1} tasks completed</span>
                    <span>{userProgress.quizCompleted ? 'Room Completed!' : 'In Progress'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Progress */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Progress</h3>
              
              {!userProgress.joined ? (
                <button
                  onClick={handleJoinRoom}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Join Room
                </button>
              ) : (
                <div className="space-y-3">
                  {room.lectures.map((lecture, index) => (
                    <div
                      key={lecture.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                        canAccessLecture(index) 
                          ? (userProgress.completedLectures || []).includes(index)
                            ? "bg-green-500/20 border border-green-500/30"
                            : "bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30"
                          : "bg-slate-700/30 border border-slate-600/30"
                      }`}
                      onClick={() => {
                        if (canAccessLecture(index)) {
                          setCurrentLectureIndex(index)
                          setCurrentView('lecture')
                        }
                      }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        (userProgress.completedLectures || []).includes(index) ? "bg-green-500" :
                        canAccessLecture(index) ? "bg-blue-500" : "bg-slate-600"
                      }`}>
                        {(userProgress.completedLectures || []).includes(index) ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : canAccessLecture(index) ? (
                          <span className="text-white text-xs">{index + 1}</span>
                        ) : (
                          <Lock className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        (userProgress.completedLectures || []).includes(index) ? "text-green-400" :
                        canAccessLecture(index) ? "text-blue-400" : "text-slate-500"
                      }`}>
                        {lecture.title}
                      </span>
                    </div>
                  ))}
                  
                  {/* Quiz */}
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      (userProgress.completedLectures || []).length === room.lectures.length
                        ? userProgress.quizCompleted
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30"
                        : "bg-slate-700/30 border border-slate-600/30"
                    }`}
                    onClick={() => {
                      if ((userProgress.completedLectures || []).length === room.lectures.length) {
                        setCurrentView('quiz')
                      }
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      userProgress.quizCompleted ? "bg-green-500" :
                      (userProgress.completedLectures || []).length === room.lectures.length ? "bg-purple-500" : "bg-slate-600"
                    }`}>
                      {userProgress.quizCompleted ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (userProgress.completedLectures || []).length === room.lectures.length ? (
                        <span className="text-white text-xs">Q</span>
                      ) : (
                        <Lock className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      userProgress.quizCompleted ? "text-green-400" :
                      (userProgress.completedLectures || []).length === room.lectures.length ? "text-purple-400" : "text-slate-500"
                    }`}>
                      Final Quiz
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50">
              {currentView === 'overview' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Room Overview</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 mb-4">{room.description}</p>
                    <h3 className="text-lg font-semibold text-white mb-2">What you'll learn:</h3>
                    <ul className="text-slate-300 space-y-1">
                      {room.lectures.map((lecture, index) => (
                        <li key={index}>• {lecture.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentView === 'lecture' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Lecture {currentLectureIndex + 1}: {room.lectures[currentLectureIndex].title}
                    </h2>
                    <span className="text-sm text-slate-400">
                      {currentLectureIndex + 1} of {room.lectures.length}
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none mb-6">
                    <p className="text-slate-300 leading-relaxed">
                      {room.lectures[currentLectureIndex].content}
                    </p>
                  </div>
                  <button
                    onClick={handleLectureComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    Move to Exercise
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {currentView === 'exercise' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Exercise: {room.lectures[currentLectureIndex].title}
                  </h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {room.lectures[currentLectureIndex].exercise.question}
                    </h3>
                    <div className="space-y-2">
                      {room.lectures[currentLectureIndex].exercise.options.map((option, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50">
                          <input
                            type="radio"
                            name="exercise"
                            value={index}
                            checked={exerciseAnswer === index.toString()}
                            onChange={(e) => setExerciseAnswer(e.target.value)}
                            className="text-blue-500"
                          />
                          <span className="text-slate-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleExerciseSubmit}
                    disabled={!exerciseAnswer}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg"
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {currentView === 'quiz' && !userProgress.quizCompleted && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Final Quiz</h2>
                  <div className="space-y-6">
                    {room.quiz.questions.map((question, qIndex) => (
                      <div key={qIndex} className="border-b border-slate-700 pb-4">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {qIndex + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label key={oIndex} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50">
                              <input
                                type="radio"
                                name={`quiz-${qIndex}`}
                                value={oIndex}
                                checked={quizAnswers[qIndex] === oIndex.toString()}
                                onChange={(e) => setQuizAnswers(prev => ({
                                  ...prev,
                                  [qIndex]: e.target.value
                                }))}
                                className="text-blue-500"
                              />
                              <span className="text-slate-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== room.quiz.questions.length}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}

              {currentView === 'quiz' && userProgress.quizCompleted && (
                <div className="p-6 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Room Completed!</h2>
                    <p className="text-slate-300 mb-4">Congratulations on completing {room.title}</p>
                    <div className="text-3xl font-bold text-green-400 mb-2">{userProgress.finalScore}%</div>
                    <p className="text-slate-400">Final Score</p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => navigate('/rooms')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Back to Rooms
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetail