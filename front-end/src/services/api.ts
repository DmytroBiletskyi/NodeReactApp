import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchUsers = (page: number, count: number) =>
  axios.get(`${API_URL}/users`, { params: { page, count } });

export const fetchPositions = () => axios.get(`${API_URL}/positions`);

export const addUser = (user: FormData, token: string) =>
  axios.post(`${API_URL}/users`, user, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

export const fetchToken = () => axios.get(`${API_URL}/token`);