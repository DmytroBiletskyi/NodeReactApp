import React from 'react';
import { UserListProps } from '../types/types';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';


const UserList: React.FC<UserListProps> = ({ users, loadMoreUsers, hasMoreUsers, positions }) => {
  const getPositionName = (positionId: number) => {
    const position = positions.find((position) => position.id === positionId);
    return position ? position.name : 'Unknown Position';
  };
  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} md={6} lg={4} key={user.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Phone: {user.phone}</Typography>
              <Typography>Position: {getPositionName(user.position_id)}</Typography>
              <img src={user.photo} alt={user.name}/>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {hasMoreUsers && (
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={loadMoreUsers} fullWidth>
            Load More Users
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default UserList;

             
