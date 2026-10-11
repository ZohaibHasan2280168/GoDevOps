import { apiCall } from '../config/api';

export const getLeaderboard = async (type = 'global', limit = 10) => {
  try {
    const response = await apiCall(`/users/leaderboard?type=${type}&limit=${limit}`);
    return response.leaderboard;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
};