import axios from '../api/axios';

export const getLabs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      params.append('difficulty', filters.difficulty);
    }
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }

    const response = await axios.get(`/labs?${params.toString()}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching labs:', error);
    throw error;
  }
};

export const getLabById = async (id) => {
  try {
    const response = await axios.get(`/labs/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching lab with id ${id}:`, error);
    throw error;
  }
};