import React, { useEffect, useState, useCallback } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { Container, Typography, Alert, TextField, Box } from '@mui/material';
import { User, Position } from './types/types';
import './App.css';


const API_URL = process.env.REACT_APP_API_URL;

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getToken = async () => {
    try {
      const response = await fetch(`${API_URL}/token`);
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const loadUsers = useCallback(async (reset: boolean = false) => {
    try {
      const response = await fetch(`${API_URL}/users?count=6&page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers((prevUsers) => reset ? data.users : [...prevUsers, ...data.users]);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [currentPage, token]);

  const loadPositions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/positions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPositions(data.positions);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  }, [token]);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      loadUsers();
      loadPositions();
    }
  }, [token, loadUsers, loadPositions]);

  const addUser = async (formData: FormData) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
  
      await response.json();
      setSuccess('User added successfully');
      setError('');
      loadUsers(true);
    } catch (error) {
      console.log(error);
      setError((error as Error).message);
      setSuccess('');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        User List
      </Typography>
      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      <UserList 
        users={filteredUsers} 
        loadMoreUsers={() => setCurrentPage((page) => page + 1)} 
        hasMoreUsers={currentPage < totalPages} 
        positions={positions}
      />
      <Typography variant="h4" gutterBottom>
        Add New User
      </Typography>
      <Box marginBottom={2}>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}
      </Box>
      <UserForm positions={positions} addUser={addUser} />
    </Container>
  );
};

export default App;
