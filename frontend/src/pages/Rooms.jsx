import { useState, useMemo, memo, useCallback, useEffect } from "react"
import { Users, Zap, Plus, Filter, Clock, Crown } from "lucide-react"
import { Link } from "react-router-dom"
import { getRooms } from "../services/rooms"
import { ProtectedRoute } from "../components/protected-route"

const RoomCard = memo(({ room }) => (
  <Link to={`/rooms/${room.slug}`} className="block">
    <div className="card p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-colors min-h-[180px] flex flex-col">
      <div className="flex items-start justify-between mb-3 flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{room.title}</h3>
          </div>
          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{room.short_description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {room.estimated_time_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.completedBy?.length || 0} completed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Available</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          room.difficulty === "Beginner" ? "bg-green-600 text-white" :
          room.difficulty === "Intermediate" ? "bg-yellow-600 text-white" : "bg-red-600 text-white"
        }`}>
          {room.difficulty}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{room.category}</span>
        </div>
        <button className="btn-primary text-xs px-3 py-1">
          View Room
        </button>
      </div>
    </div>
  </Link>
))

const Rooms = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [rooms, setRooms] = useState([])

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesCategory = selectedCategory === "all" || room.category === selectedCategory
      const matchesActive = !showActiveOnly || room.isActive
      return matchesCategory && matchesActive
    })
  }, [rooms, selectedCategory, showActiveOnly])

  const stats = useMemo(() => {
    const activeRooms = rooms.filter(room => room.isActive).length
    const totalCompletions = rooms.reduce((sum, room) => sum + (room.completedBy?.length || 0), 0)
    return { activeRooms, totalCompletions }
  }, [rooms])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
  }, [])

  const handleActiveToggle = useCallback(() => {
    setShowActiveOnly(prev => !prev)
  }, [])

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRooms({ category: selectedCategory })
      setRooms(data)
    } catch (err) {
      setError('Failed to load rooms')
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  return (
    <ProtectedRoute>
      <div className="page-container bg-[rgb(17,24,39)] text-text">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Practice Rooms</h1>
          <p className="text-slate-300">Join live technical challenges and collaborate with others</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-4 text-center rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xl font-bold text-slate-100">{stats.activeRooms}</span>
            </div>
            <p className="text-sm text-slate-400">Active Rooms</p>
          </div>

          <div className="card p-4 text-center rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xl font-bold text-slate-100">{stats.totalCompletions}</span>
            </div>
            <p className="text-sm text-slate-400">Total Completions</p>
          </div>

          <div className="card p-4 text-center rounded-xl bg-slate-800/30 border border-slate-700/50">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Create Room
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {["all", "Development", "Web", "Networking", "DevOps"].map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedCategory === category 
                    ? "bg-blue-500 text-white" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleActiveToggle}
            className={`px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors ${
              showActiveOnly 
                ? "bg-blue-500 text-white" 
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <Filter className="w-4 h-4" />
            Active Only
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
            <Zap className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Learning Rooms</h2>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {filteredRooms.length} Available
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading rooms...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchRooms}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>

        {!loading && !error && filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No rooms found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
})

Rooms.displayName = 'Rooms'
export default Rooms