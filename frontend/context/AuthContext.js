import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client, { setAuthToken } from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('user');
      if (t) {
        setToken(t);
        setAuthToken(t);
      }
      if (u) setUser(JSON.parse(u));
      // try fetch notifications count if token present
      if (t) {
        try {
          const resp = await client.get('/notifications');
          const unread = resp.data.filter(n=>!n.read).length;
          setNotificationsCount(unread);
        } catch (e) { /* ignore */ }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (tokenValue, userObj) => {
    setToken(tokenValue);
    setUser(userObj);
    setAuthToken(tokenValue);
    await AsyncStorage.setItem('token', tokenValue);
    await AsyncStorage.setItem('user', JSON.stringify(userObj));
  };

  const updateUser = async (userObj) => {
    setUser(userObj);
    await AsyncStorage.setItem('user', JSON.stringify(userObj));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  const refreshNotifications = async () => {
    try {
      const resp = await client.get('/notifications');
      const unread = resp.data.filter(n=>!n.read).length;
      setNotificationsCount(unread);
      return resp.data;
    } catch (e) { console.warn(e); return []; }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, notificationsCount, refreshNotifications }}>
      {children}
    </AuthContext.Provider>
  );
};
