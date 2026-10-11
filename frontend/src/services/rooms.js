import axios from '../api/axios'

export const getRooms = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      params.append('difficulty', filters.difficulty)
    }
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','))
    }

    const response = await axios.get(`/rooms?${params.toString()}`)
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching rooms:', error)
    throw error
  }
}

export const getRoomBySlug = async (slug) => {
  try {
    console.log('🚀 Making API call to:', `/rooms/${slug}`);
    
    const response = await axios.get(`/rooms/${slug}`, {
      timeout: 15000 // 15 second timeout
    });
    
    console.log('📡 API Response status:', response.status);
    console.log('📦 API Response data:', response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      if (response.status === 404) {
        throw new Error('Room not found');
      } else {
        throw new Error(response.data.message || 'Invalid response format');
      }
    }
  } catch (error) {
    console.error('❌ Error fetching room:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server may be down');
    }
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    }
    
    if (error.request) {
      throw new Error('Network error - cannot reach server');
    }
    
    throw error;
  }
}

export const submitExercise = async (slug, exerciseId, answer) => {
  try {
    const response = await axios.post(`/rooms/${slug}/exercises/${exerciseId}/submit`, {
      answer
    })
    return response.data
  } catch (error) {
    console.error('Error submitting exercise:', error)
    throw error
  }
}

export const submitQuiz = async (slug, quizId, answers) => {
  try {
    const response = await axios.post(`/rooms/${slug}/quizzes/${quizId}/submit`, {
      answers
    })
    return response.data
  } catch (error) {
    console.error('Error submitting quiz:', error)
    throw error
  }
}

export const completeRoom = async (slug, timeSpent, finalScore) => {
  try {
    const response = await axios.post(`/rooms/${slug}/complete`, {
      timeSpent,
      finalScore
    })
    return response.data
  } catch (error) {
    console.error('Error completing room:', error)
    throw error
  }
}

// --- PROGRESS PERSISTENCE ---

/**
 * Simulates fetching a user's progress for a specific room.
 * In a real app, this would make an API call to your backend.
 * @param {string} roomSlug - The slug of the room.
 * @returns {Promise<object>} - A promise that resolves with the user's progress.
 */
export const getUserRoomProgress = async (roomSlug, userId) => {
  console.log(`Simulating fetch for user progress in room: ${roomSlug}`);
  // In a real app: return api.get(`/rooms/${roomSlug}/progress?userId=${userId}`);
  return { completedTaskIds: [] }; // Start with no progress for now
};

/**
 * Simulates saving a user's progress for a specific room.
 * @param {string} roomSlug - The slug of the room.
 * @param {Array<number>} completedTaskIds - An array of completed task IDs.
 */
export const saveUserRoomProgress = async (roomSlug, completedTaskIds, activeTaskIndex) => {
  console.log(`Simulating save for user progress in room: ${roomSlug}`, { completedTaskIds, activeTaskIndex });
  // In a real app: return api.post(`/rooms/${roomSlug}/progress`, { completedTaskIds, activeTaskIndex });
};