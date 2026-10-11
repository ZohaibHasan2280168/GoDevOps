import { apiCall } from '../config/api'

export const getRoomProgress = async (roomId) => {
  return await apiCall(`/room-progress/${roomId}`)
}

export const joinRoom = async (roomId) => {
  return await apiCall(`/room-progress/${roomId}/join`, {
    method: 'POST'
  })
}

export const submitExercise = async (roomId, lectureIndex, answer, isCorrect) => {
  return await apiCall(`/room-progress/${roomId}/exercise`, {
    method: 'POST',
    body: JSON.stringify({
      lectureIndex,
      answer,
      isCorrect
    })
  })
}

export const submitQuiz = async (roomId, score) => {
  return await apiCall(`/room-progress/${roomId}/quiz`, {
    method: 'POST',
    body: JSON.stringify({
      score
    })
  })
}

export const fixCompletionCounts = async () => {
  return await apiCall('/room-progress/fix-counts', {
    method: 'POST'
  })
}