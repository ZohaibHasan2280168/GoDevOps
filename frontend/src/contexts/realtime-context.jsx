import { createContext, useContext, useEffect, useState } from 'react'
import { getUserStats } from '../services/progress'

const RealtimeContext = createContext()

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider')
  }
  return context
}

// Extend userStats to include streak information
export const RealtimeProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [weeklyStats, setWeeklyStats] = useState({
    labsCompleted: 0,
    pointsEarned: 0,
    timeSpent: '0h',
    rankChange: 0
  })
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const refreshUserStats = async () => {
    try {
      const stats = await getUserStats()
      
      // Single state update to prevent flickering
      setUserStats(prevStats => ({
        ...prevStats,
        ...stats,
        currentStreak: stats.currentStreak || prevStats.currentStreak || 0,
        longestStreak: stats.longestStreak || prevStats.longestStreak || 0,
      }))
      
      // Update recent activity if it exists in the stats
      if (stats.recentActivity) {
        setRecentActivity(stats.recentActivity)
      }
      // Update weekly stats
      if (stats.weeklyStats) {
        setWeeklyStats(stats.weeklyStats)
      }
      setLastUpdate(Date.now())
    } catch (error) {
      console.error('Failed to refresh user stats:', error)
    }
  }

  const triggerUpdate = () => {
    refreshUserStats()
  }

  useEffect(() => {
    // Make trigger function globally available
    window.triggerRealtimeUpdate = triggerUpdate
    
    // Disable automatic refresh to prevent flickering when backend is down
    // const interval = setInterval(refreshUserStats, 60000)
    
    return () => {
      // clearInterval(interval)
      delete window.triggerRealtimeUpdate
    }
  }, [])

  return (
    <RealtimeContext.Provider value={{
      userStats,
      recentActivity,
      weeklyStats,
      refreshUserStats,
      triggerUpdate,
      lastUpdate
    }}>
      {children}
    </RealtimeContext.Provider>
  )
}