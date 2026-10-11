import { useState, useMemo, memo, useCallback, useEffect } from "react"
import { Search, Grid, List, Lock, Clock, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { ProtectedRoute } from "../components/protected-route"
import { getLabs } from "../services/labs" // Assuming this service exists or will be created

const LabCard = memo(({ lab }) => (
  <Link to={`/labs/${lab.id}`} className="block">
    <div className="card p-4 h-full hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-1">{lab.title}</h3>
          <p className="text-sm text-muted mb-2">{lab.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted/70">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lab.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {lab.participants}
            </span>
          </div>
        </div>
        {lab.isPremium && (
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
            <Lock className="h-3 w-3" />
            Pro
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          lab.difficulty === "beginner" ? "bg-success text-white" :
          lab.difficulty === "intermediate" ? "bg-warning text-black" :
          lab.difficulty === "advanced" ? "bg-primary text-white" : "bg-danger text-white"
        }`}>
          {lab.difficulty}
        </span>
        <button className="btn-primary text-xs px-3 py-1">
          Start
        </button>
      </div>
    </div>
  </Link>
))

const Labs = memo(() => {
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const [labs, setLabs] = useState([]) // This will be populated by API call

  const categories = useMemo(() => [
    { value: "all", label: "All Categories" },
    { value: "ethical", label: "Ethical Hacking" },
    { value: "web", label: "Web Development" },
    { value: "development", label: "Programming" },
    { value: "network", label: "Network" },
    { value: "system", label: "System" },
  ], [])

  const difficulties = useMemo(() => [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ], [])

  const filteredLabs = useMemo(() => {
    return labs.filter(lab => {
      const matchesSearch = lab.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || lab.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || lab.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [labs, searchTerm, selectedCategory, selectedDifficulty])

  // Placeholder for fetching labs from an API
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        // Replace with actual API call: const fetchedLabs = await getLabs({ selectedCategory, selectedDifficulty, searchTerm });
        // For now, a simple mock to show something
        const mockLabs = []; // No dummy data, start empty
        setLabs(mockLabs);
      } catch (error) {
        console.error("Failed to fetch labs:", error);
        // Handle error state
      }
    };

    fetchLabs();
  }, [selectedCategory, selectedDifficulty, searchTerm]); // Re-fetch when filters change

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), [])
  const handleCategoryChange = useCallback((e) => setSelectedCategory(e.target.value), [])
  const handleDifficultyChange = useCallback((e) => setSelectedDifficulty(e.target.value), [])

  return (
    <ProtectedRoute>
      <div className="page-container bg-[rgb(17,24,39)] text-text">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text mb-2 gradient-text">Interactive Labs</h1>
          <p className="text-muted">Master technical skills through hands-on practice</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
              <input
                placeholder="Search labs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary labs-search-input"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="w-40 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary labs-dropdown"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select 
              value={selectedDifficulty} 
              onChange={handleDifficultyChange}
              className="w-40 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary labs-dropdown"
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>

            <div className="flex bg-panel border border-card-border rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-primary text-white" : "text-muted hover:text-text"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-text"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredLabs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No labs available</p>
            <p className="text-muted/70 text-sm mt-2">Check back later for new content</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filteredLabs.map(lab => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
})

Labs.displayName = 'Labs'
export default Labs