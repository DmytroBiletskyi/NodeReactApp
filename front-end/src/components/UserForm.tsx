import React, { useState, ChangeEvent, FormEvent } from 'react';
import { UserFormProps } from '../types/types';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography } from '@mui/material';


const UserForm: React.FC<UserFormProps> = ({ positions, addUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [positionId, setPositionId] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!photo) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('position_id', positionId);
    formData.append('photo', photo);

    addUser(formData);
    setName('');
    setEmail('');
    setPhone('');
    setPositionId('');
    setPhoto(null);
  };

  return (
    <form id="user-form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>Select a position</em>
              </MenuItem>
              {positions.map((position) => (
                <MenuItem key={position.id} value={position.id}>
                  {position.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Upload Photo
            <input
              type="file"
              hidden
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoto(e.target.files ? e.target.files[0] : null)}
              required
            />
          </Button>
          {photo && <Typography>{photo.name}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add User
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
