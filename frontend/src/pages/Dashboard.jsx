import { Link } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { useRealtime } from "../contexts/realtime-context"
import { ProtectedRoute } from "../components/protected-route"
import { Trophy, Target, Zap, Clock, CheckCircle2, ArrowRight, Flame } from "lucide-react"
import { memo, useMemo, useState, useEffect } from "react"

const Dashboard = memo(() => {
  const { user } = useApp()
  const { userStats, refreshUserStats, lastUpdate } = useRealtime()
  
  // Trigger refresh when user completes activities (only on initial load)
  useEffect(() => {
    if (user && !userStats.points) {
      refreshUserStats()
    }
  }, [user])
  
  const currentUser = userStats || user

  const userData = useMemo(() => currentUser || {
    name: 'User',
    level: 1,
    points: 0,
    rank: 999,
    completedLabs: 0,
    completedRooms: 0
  }, [currentUser])

  const stats = useMemo(() => [ // Added a new stat for Current Streak
    { label: "Level", value: userData.level || 1, icon: Zap, color: "text-green-400" }, // Using green-400 for consistency
    { label: "Points", value: (userData.points || 0).toLocaleString(), icon: Trophy, color: "text-green-400" }, // Using green-400 for consistency
    { label: "Global Rank", value: `#${userData.rank || 999}`, icon: Target, color: "text-green-400" }, // Using green-400 for consistency
    { label: "Rooms/Labs", value: `${userData.completedRooms || 0}/${userData.completedLabs || 0}`, icon: CheckCircle2, color: "text-green-400" }, // Using green-400 for consistency
    { label: "Current Streak", value: `${userData.currentStreak || 0} days`, icon: Flame, color: "text-orange-400" }, // New streak stat
  ], [userData])

  const [recentLabs, setRecentLabs] = useState([])
  const [upcomingRooms, setUpcomingRooms] = useState([])

  return (
    <ProtectedRoute>
      <div className="page-container bg-[rgb(17,24,39)] text-text">

        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-text">Welcome back, <span className="text-green-400">{userData.name}</span>!</h1>
              <p className="text-muted">Continue your learning journey</p>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5"> {/* Adjusted grid columns */}
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="card p-6 shadow-panel-dark">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted">{stat.label}</p>
                      <p className="text-2xl font-bold text-text">{stat.value}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-6 border-b border-card-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-text">Continue Learning</h2>
                      <p className="text-muted">Pick up where you left off</p>
                    </div>
                    <Link to="/labs" className="text-green-400 hover:text-green-300 flex items-center gap-2 text-sm font-medium">
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {recentLabs.map((lab) => (
                    <div key={lab.id} className="card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-text">{lab.title}</h3>
                          <p className="text-sm text-muted">{lab.category}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          lab.difficulty === "Easy" ? "bg-green-600 text-white" :
                          lab.difficulty === "Medium" ? "bg-yellow-600 text-white" : "bg-red-600 text-white"
                        }`}>
                          {lab.difficulty}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="w-full bg-surface rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${lab.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">{lab.progress}% Complete</span>
                        <Link to={`/labs/${lab.id}`} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md">
                          Continue
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text mb-2">Level Progress</h3>
                  <p className="text-muted mb-4">Level {userData.level} → {userData.level + 1}</p>
                  <div className="mb-2">
                    <div className="w-full bg-surface rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-muted">650 / 1000 XP</p>
                </div>
              </div>

              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text mb-2">Upcoming Rooms</h3>
                  <p className="text-muted mb-4">Live attack challenges</p>
                  <div className="space-y-3">
                    {upcomingRooms.map((room) => (
                      <div key={room.id} className="card p-3">
                        <h4 className="font-semibold text-text text-sm mb-2">{room.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>{room.participants} players</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {room.startsIn}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link to="/rooms" className="block w-full py-2 text-center border border-green-500 text-green-400 hover:bg-green-500 hover:text-white rounded-md transition-colors text-sm">
                      View All Rooms
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
})

Dashboard.displayName = 'Dashboard'
export default Dashboard