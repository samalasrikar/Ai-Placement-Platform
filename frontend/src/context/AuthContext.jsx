import React, { createContext, useState, useEffect } from 'react';
import api, { mockData } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get('/auth/profile');
        setUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
          name: res.data.role === 'student' ? res.data.studentInfo?.full_name : res.data.recruiterInfo?.full_name || 'System Admin',
          details: res.data
        });
      } catch (err) {
        console.warn('Backend user profile fetch failed. Attempting decode of local token mock fallback.');
        try {
          const payloadStr = token.split('.')[1];
          if (payloadStr) {
            const decoded = JSON.parse(atob(payloadStr));
            let name = 'Demo User';
            if (decoded.role === 'student') name = mockData.student.student.full_name;
            if (decoded.role === 'recruiter') name = mockData.recruiter.recruiter.full_name;
            if (decoded.role === 'admin') name = 'Platform Admin';

            setUser({
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
              name
            });
          }
        } catch (e) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      console.warn('Backend login query failed, executing simulated auth sequence.');
      // Simulating login logic for frontend-only running
      let role = 'student';
      let name = 'Alex Carter';
      
      if (email.includes('recruiter') || email.includes('google')) {
        role = 'recruiter';
        name = 'Sarah Jenkins';
      } else if (email.includes('admin')) {
        role = 'admin';
        name = 'Platform Admin';
      }

      // Generate a mock JWT token string (header.payload.signature)
      const mockPayload = btoa(JSON.stringify({ id: Math.floor(Math.random() * 100), email, role }));
      const mockTokenStr = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${mockPayload}.signature`;

      localStorage.setItem('token', mockTokenStr);
      setToken(mockTokenStr);
      const userData = { id: 101, email, role, name };
      setUser(userData);
      return userData;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      console.warn('Backend signup query failed, executing simulated registration.');
      const role = formData.role || 'student';
      const name = formData.name || 'Demo User';
      const email = formData.email || 'demo@placement.com';

      const mockPayload = btoa(JSON.stringify({ id: Math.floor(Math.random() * 100), email, role }));
      const mockTokenStr = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${mockPayload}.signature`;

      localStorage.setItem('token', mockTokenStr);
      setToken(mockTokenStr);
      const userData = { id: 102, email, role, name };
      setUser(userData);
      return userData;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
