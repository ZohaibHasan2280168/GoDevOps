import { useParams, Link } from "react-router-dom"
import { useState, memo, useMemo, useEffect } from "react"
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Users, Trophy, Lock, CheckCircle, ArrowRight } from "lucide-react"
import { getLabById } from "../services/labs" // Assuming this service exists or will be created

const LabDetail = memo(() => {
  const { id } = useParams()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const [lab, setLab] = useState(null)
  const [steps, setSteps] = useState([]) // Steps would come from lab data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleStart = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentStep(1)
    setTimeElapsed(0)
  }

  const handleNextStep = () => {
    if (currentStep < lab.totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Placeholder for fetching lab details from an API
  useEffect(() => {
    const fetchLabDetails = async () => {
      if (!id) {
        setError("No lab ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Replace with actual API call: const fetchedLab = await getLabById(id);
        // For now, a simple mock to avoid breaking the UI
        const mockLab = {
          id: parseInt(id),
          title: "Lab Details Loading...",
          description: "Details will appear here once fetched from the API.",
          difficulty: "beginner",
          duration: "0 min",
          participants: "0",
          points: 0,
          category: "web",
          totalSteps: 0, // This should come from fetched data
          isPremium: false
        };
        setLab(mockLab);
      } catch (err) {
        setError(err.message || "Failed to load lab details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLabDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container bg-[rgb(17,24,39)] text-text py-8">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted text-lg">Loading lab details...</p>
        </div>
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="page-container bg-[rgb(17,24,39)] text-text py-8">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-danger text-lg mb-4">{error || "Lab not found."}</p>
          <Link to="/labs" className="btn-primary px-4 py-2">Back to Labs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-slate-950 py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-6">
          <Link to="/labs" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Labs
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{lab.title}</h1>
              <p className="text-slate-300 mb-4">{lab.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {lab.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {lab.participants}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {lab.points} points
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  lab.difficulty === "beginner" ? "bg-green-600 text-white" :
                  lab.difficulty === "intermediate" ? "bg-yellow-600 text-white" : "bg-red-600 text-white"
                }`}>
                  {lab.difficulty}
                </span>
              </div>
            </div>
            {lab.isPremium && (
              <div className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                <Lock className="h-4 w-4" />
                Premium
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50 mb-6">
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Lab Environment</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4" />
                      {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      isRunning ? "bg-green-500/20 text-green-400" : "bg-slate-600/50 text-slate-400"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-slate-400"}`}></div>
                      {isRunning ? "Running" : "Stopped"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-slate-900 rounded-lg p-6 mb-6 min-h-[400px] border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-slate-400 text-sm">Terminal</span>
                  </div>
                  <div className="font-mono text-green-400 text-sm">
                    <div className="mb-2">$ sqlmap -u "http://vulnerable-site.com/login.php" --data="username=admin&password=test"</div>
                    <div className="text-slate-500 mb-2">[INFO] Testing connection to the target URL</div>
                    <div className="text-slate-500 mb-2">[INFO] Checking if the target is protected by some kind of WAF/IPS</div>
                    <div className="text-yellow-400 mb-2">[WARNING] Parameter 'username' appears to be injectable</div>
                    <div className="text-green-400">sqlmap identified the following injection point(s):</div>
                    <div className="text-blue-400 ml-4">Parameter: username (POST)</div>
                    <div className="text-blue-400 ml-8">Type: boolean-based blind</div>
                    <div className="animate-pulse">_</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleStart}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        isRunning 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isRunning ? "Stop" : "Start"}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={currentStep === lab.totalSteps}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-lg font-bold text-white">Progress</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Step {currentStep} of {lab.totalSteps}</span>
                    <span className="text-sm text-blue-400">{Math.round((currentStep / lab.totalSteps) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(currentStep / lab.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.id} className={`flex items-center gap-3 p-2 rounded-lg ${
                      step.current ? "bg-blue-500/20 border border-blue-500/30" : ""
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-green-500" : 
                        step.current ? "bg-blue-500" : "bg-slate-600"
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <span className="text-white text-xs">{step.id}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        step.completed ? "text-green-400" :
                        step.current ? "text-blue-400" : "text-slate-400"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-lg font-bold text-white">Hints</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-300">💡 Try using single quotes to test for SQL injection vulnerabilities</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-300">⚠️ Always test in a safe environment - never on production systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

LabDetail.displayName = 'LabDetail'
export default LabDetail