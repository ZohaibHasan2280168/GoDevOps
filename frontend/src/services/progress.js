import axios from '../api/axios'

export const updateProgress = async (type, itemId, points, timeSpent) => {
  try {
    const response = await axios.post('/progress/update', {
      type,
      itemId,
      points,
      timeSpent
    })
    return response.data
  } catch (error) {
    console.error('Error updating progress:', error)
    throw error
  }
}

export const getLeaderboard = async (limit = 10) => {
  try {
    const response = await axios.get(`/progress/leaderboard?limit=${limit}`)
    console.log('Leaderboard API response:', response.data)
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    console.error('Error details:', error.response?.data)
    throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard')
  }
}

export const getUserStats = async () => {
  try {
    const response = await axios.get('/progress/stats')
    return response.data.data
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw error
  }
}

export const checkCompletion = async (type, itemId) => {
  try {
    const response = await axios.get(`/progress/check/${type}/${itemId}`)
    return response.data.data
  } catch (error) {
    console.error('Error checking completion:', error)
    throw error
  }
}