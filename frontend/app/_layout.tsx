import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../src/context/AuthContext';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ login: string; email: string } | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/auth');
    } else if (isLoggedIn && (inAuthGroup || segments.length === 0)) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isLoading]);

  const checkAuth = async () => {
    try {
      const session = await AsyncStorage.getItem('currentSession');
      if (session) {
        const userData = JSON.parse(session);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginName: string, email: string) => {
    const userData = { login: loginName, email };
    await AsyncStorage.setItem('currentSession', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('currentSession');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthContext.Provider>
  );
}
