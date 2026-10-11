import { useEffect, useState, memo, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { useRealTimeLeaderboard } from "../hooks/useRealTimeLeaderboard"
import { useRealtime } from "../contexts/realtime-context"
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Zap, Target } from "lucide-react"

const Leaderboard = memo(() => {
  const { isAuthenticated, loading, user } = useApp()
  const { lastUpdate } = useRealtime()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("global")
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useRealTimeLeaderboard()
  const [userRank, setUserRank] = useState(null)
  
  const leaderboardData = leaderboard.map(player => ({
    ...player,
    username: player.name,
    trend: 'up'
  }))
  
  useEffect(() => {
    if (user && leaderboardData.length > 0) {
      const userPosition = leaderboardData.findIndex(player => player.name === user.name)
      setUserRank(userPosition !== -1 ? userPosition + 1 : 999)
    }
  }, [user, leaderboardData])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])



  const [globalLeaderboard, setGlobalLeaderboard] = useState([])

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-orange-400" />
    return <span className="text-lg font-bold text-slate-400">#{rank}</span>
  }

  const stats = useMemo(() => [
    { icon: Trophy, label: "Your Rank", value: `#${userRank || 999}`, color: "text-yellow-400" },
    { icon: Target, label: "Total Points", value: user?.points?.toLocaleString() || "0", color: "text-blue-400" },
    { icon: Zap, label: "This Week", value: "+0", color: "text-green-400" },
    { icon: Star, label: "Level", value: user?.level || "1", color: "text-purple-400" }
  ], [user, userRank])

  if (loading) {
    return null
  }

  return (
    <div className="page-container bg-[rgb(17,24,39)] text-text">

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Global Leaderboard</h1>
          <p className="text-slate-300">See how you stack up against top learners worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card p-5 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-slate-700/50">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-100">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card mb-8 p-6 rounded-xl bg-slate-800/30 border border-blue-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CN</span>
                </div>
                {user?.isPremium && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs rounded">
                    Pro
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">{user?.name || 'User'}</h3>
                <p className="text-sm text-slate-400">Your Global Rank</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs rounded">
                    ↗ +12 this week
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-600" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - 65 / 100)}`} className="text-blue-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">65%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-400">#{userRank || 999}</div>
                <p className="text-sm text-slate-400">{user?.points?.toLocaleString() || '0'} points</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          {["global", "weekly", "monthly"].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                fetchLeaderboard()
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {tab === "global" ? "Global" : tab === "weekly" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {activeTab === "global" ? "Global Rankings" : activeTab === "weekly" ? "Weekly Rankings" : "Monthly Rankings"}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-slate-400">Loading real-time data...</p>
                </div>
              ) : leaderboardError ? (
                <div className="text-center py-8">
                  <p className="text-red-400">{leaderboardError}</p>
                </div>
              ) : leaderboardData.length > 0 ? leaderboardData.map((player) => (
                <div
                  key={player.rank}
                  className={`list-item flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    (player.username === user?.username || player.username === user?.name || player.name === user?.name)
                      ? "border-blue-400/50 bg-blue-500/10"
                      : "border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 hover:border-slate-600/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center">
                      {getRankIcon(player.rank)}
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {player.username.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      {player.rank <= 3 && (
                        <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-100">{player.username}</h4>
                        {player.rank === 1 && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs rounded">
                            Champion
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">
                        Level {player.level} • {player.completedRooms || 0} rooms • {player.completedLabs || 0} labs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-400">
                        {activeTab === "global" ? player.points.toLocaleString() : 
                         activeTab === "weekly" ? Math.floor(player.points * 0.1).toLocaleString() :
                         Math.floor(player.points * 0.3).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                    {player.trend === "up" && <TrendingUp className="h-5 w-5 text-green-400" />}
                    {player.trend === "down" && <TrendingUp className="h-5 w-5 text-red-400 rotate-180" />}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">No leaderboard data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

Leaderboard.displayName = 'Leaderboard'
export default Leaderboard