import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';

import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ActivityIcon, // FIXED ICON
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/dashboard/recent-activities'),
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.username}!
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>

        {stats && (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Total Users"
        value={stats?.totalUsers?.toLocaleString?.() || 0}
        icon={<PeopleIcon />}
        color="#1976d2"
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Active Users"
        value={stats?.activeUsers?.toLocaleString?.() || 0}
        icon={<ActivityIcon />}
        color="#2e7d32"
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Monthly Revenue"
        value={`$${stats?.monthlyRevenue?.toLocaleString?.() || 0}`}
        icon={<AccountBalanceIcon />}
        color="#ed6c02"
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Growth Rate"
        value={`${stats?.growthRate || 0}%`}
        icon={<TrendingUpIcon />}
        color="#9c27b0"
      />
    </Grid>
  </Grid>
)}


        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {activities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.user} - ${activity.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Username:</strong> {user?.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Role:</strong> User
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ mt: 3 }}
              >
                Logout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
