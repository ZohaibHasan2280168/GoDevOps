import { useState, memo, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { useRealtime } from "../contexts/realtime-context"
import { updateProfile } from "../services/profile"
import { User, Trophy, Target, Clock, Edit, Settings, Crown, Medal, Star } from "lucide-react"

const Profile = memo(() => {
  const { user, updateProfile: updateUserProfile } = useApp()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const isPremium = user?.isPremium || false

  const userStats = useMemo(() => ({
    rank: user?.rank || 999,
    totalPoints: user?.points || 0,
    labsCompleted: user?.completedLabs?.length || 0,
    roomsJoined: user?.joinedRooms?.length || 0,
    timeSpent: "42h",
    level: user?.level || 1,
    nextLevelProgress: 65
  }), [user])

  const [achievements, setAchievements] = useState([])
  const { userStats: realtimeStats, recentActivity, weeklyStats } = useRealtime()

  // Update user stats when realtime data changes
  useEffect(() => {
    if (realtimeStats && updateUserProfile) {
      updateUserProfile({
        ...user,
        points: realtimeStats.totalPoints || user?.points,
        rank: realtimeStats.rank || user?.rank,
        completedLabs: realtimeStats.completedLabs || user?.completedLabs,
        joinedRooms: realtimeStats.joinedRooms || user?.joinedRooms
      })
    }
  }, [realtimeStats, updateUserProfile, user])

  const getRarityColor = (rarity) => {
    const colors = {
      common: "text-slate-400 border-slate-600",
      uncommon: "text-green-400 border-green-600", 
      rare: "text-blue-400 border-blue-600",
      epic: "text-purple-400 border-purple-600",
      legendary: "text-yellow-400 border-yellow-600"
    }
    return colors[rarity] || colors.common
  }

  return (
    <div className="page-container bg-[rgb(17,24,39)] text-text">

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="card mb-8 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              {isPremium && (
                <div className="absolute -top-2 -right-2 p-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Crown className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-slate-100">{user?.name || 'User'}</h1>
                {isPremium && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs rounded">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-slate-400 mb-4">{user?.email || 'user@example.com'} • Level {userStats.level}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-100">#{userStats.rank}</p>
                  <p className="text-sm text-slate-400">Global Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-100">{userStats.totalPoints}</p>
                  <p className="text-sm text-slate-400">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-100">{userStats.labsCompleted}</p>
                  <p className="text-sm text-slate-400">Labs Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-100">{userStats.timeSpent}</p>
                  <p className="text-sm text-slate-400">Time Spent</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setEditForm({ name: user?.name || '', email: user?.email || '' })
                  setIsEditing(true)
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md">
              <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        await updateProfile(editForm)
                        await updateUserProfile(editForm)
                        setIsEditing(false)
                      } catch (error) {
                        console.error('Failed to update profile:', error)
                      }
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Level Progress</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-600" />
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - userStats.nextLevelProgress / 100)}`} className="text-blue-500" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{userStats.nextLevelProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-100">Level {userStats.level}</p>
                    <p className="text-sm text-slate-400">
                      {userStats.nextLevelProgress}% to Level {userStats.level + 1}
                    </p>
                    <p className="text-xs text-slate-500">
                      350 more points needed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map(achievement => {
                    const Icon = achievement.icon
                    return (
                      <div 
                        key={achievement.id}
                        className={`list-item p-4 rounded-lg border transition-colors ${
                          achievement.earned 
                            ? `${getRarityColor(achievement.rarity)} bg-slate-700/30` 
                            : 'border-slate-700 bg-slate-800/10 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-5 h-5 ${achievement.earned ? getRarityColor(achievement.rarity).split(' ')[0] : 'text-slate-600'}`} />
                          <div>
                            <p className={`font-semibold ${achievement.earned ? 'text-slate-100' : 'text-slate-500'}`}>
                              {achievement.name}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${getRarityColor(achievement.rarity)} bg-transparent border`}>
                              {achievement.rarity}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${achievement.earned ? 'text-slate-300' : 'text-slate-600'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="list-item flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'lab_complete' ? 'bg-green-500/20 text-green-400' :
                          activity.type === 'room_join' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {activity.type === 'lab_complete' && <Target className="w-4 h-4" />}
                          {activity.type === 'room_join' && <User className="w-4 h-4" />}
                          {activity.type === 'achievement' && <Medal className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{activity.title}</p>
                          <p className="text-sm text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                      {activity.points > 0 && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-sm">
                          +{activity.points} pts
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-lg font-bold text-white">This Week</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Labs Completed</span>
                    <span className="text-slate-100 font-semibold">{weeklyStats.labsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Points Earned</span>
                    <span className="text-slate-100 font-semibold">{weeklyStats.pointsEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Spent</span>
                    <span className="text-slate-100 font-semibold">{weeklyStats.timeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rank Change</span>
                    <span className={`font-semibold ${weeklyStats.rankChange > 0 ? 'text-green-400' : weeklyStats.rankChange < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {weeklyStats.rankChange > 0 ? '↗' : weeklyStats.rankChange < 0 ? '↘' : '•'} {weeklyStats.rankChange > 0 ? '+' : ''}{weeklyStats.rankChange}
                    </span>
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

Profile.displayName = 'Profile'
export default Profile