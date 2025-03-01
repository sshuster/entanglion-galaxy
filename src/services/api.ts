
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth APIs
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Registration failed');
    }
    throw new Error('Network error during registration');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Login failed');
    }
    throw new Error('Network error during login');
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Logout failed');
    }
    throw new Error('Network error during logout');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        return null;
      }
      throw new Error(error.response.data.error || 'Failed to get user data');
    }
    throw new Error('Network error while getting user data');
  }
};

// Market Data APIs
export const getStockData = async (symbol: string, period = '1mo', interval = '1d') => {
  try {
    const response = await api.get(`/market/stock/${symbol}`, {
      params: { period, interval }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch stock data');
    }
    throw new Error('Network error while fetching stock data');
  }
};

export const searchStocks = async (query: string) => {
  try {
    const response = await api.get('/market/search', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Search failed');
    }
    throw new Error('Network error during search');
  }
};

// Portfolio APIs
export const getPortfolios = async () => {
  try {
    const response = await api.get('/portfolio');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch portfolios');
    }
    throw new Error('Network error while fetching portfolios');
  }
};

export const addStockToPortfolio = async (portfolioId: number, symbol: string, shares: number, purchasePrice: number) => {
  try {
    const response = await api.post(`/portfolio/${portfolioId}/add`, {
      symbol,
      shares,
      purchase_price: purchasePrice
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to add stock to portfolio');
    }
    throw new Error('Network error while adding stock');
  }
};

// Watchlist APIs
export const getWatchlist = async () => {
  try {
    const response = await api.get('/watchlist');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch watchlist');
    }
    throw new Error('Network error while fetching watchlist');
  }
};

export const addToWatchlist = async (symbol: string) => {
  try {
    const response = await api.post('/watchlist/add', { symbol });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to add to watchlist');
    }
    throw new Error('Network error while updating watchlist');
  }
};

export const removeFromWatchlist = async (itemId: number) => {
  try {
    const response = await api.delete(`/watchlist/remove/${itemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to remove from watchlist');
    }
    throw new Error('Network error while updating watchlist');
  }
};

// Recommendations API
export const getRecommendations = async () => {
  try {
    const response = await api.get('/recommendations');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch recommendations');
    }
    throw new Error('Network error while fetching recommendations');
  }
};
