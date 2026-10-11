import { apiCall } from '../config/api';

export const updateProfile = async (profileData) => {
  try {
    const response = await apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};