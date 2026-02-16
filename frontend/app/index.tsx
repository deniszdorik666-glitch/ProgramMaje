import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { isLoggedIn } = useAuth();
  
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/auth" />;
}
