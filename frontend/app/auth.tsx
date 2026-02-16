import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login: authLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [loginInput, setLoginInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validateLogin = (value: string): boolean => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(value);
  };

  const validateEmail = (value: string): boolean => {
    return value.endsWith('.gmail.com') || value.endsWith('@gmail.com');
  };

  const validatePassword = (value: string): string[] => {
    const errors: string[] = [];
    if (value.length < 20) {
      errors.push(`Минимум 20 символов (сейчас: ${value.length})`);
    }
    const upperCount = (value.match(/[A-Z]/g) || []).length;
    if (upperCount < 2) {
      errors.push(`Минимум 2 заглавные буквы (сейчас: ${upperCount})`);
    }
    const digitCount = (value.match(/[0-9]/g) || []).length;
    if (digitCount < 5) {
      errors.push(`Минимум 5 цифр (сейчас: ${digitCount})`);
    }
    const specialCount = (value.match(/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`;~]/g) || []).length;
    if (specialCount < 2) {
      errors.push(`Минимум 2 спецсимвола (сейчас: ${specialCount})`);
    }
    return errors;
  };

  const handleRegister = async () => {
    const newErrors: string[] = [];

    if (!loginInput) {
      newErrors.push('Введите логин');
    } else if (!validateLogin(loginInput)) {
      newErrors.push('Логин: только латинские буквы и цифры');
    }

    if (!email) {
      newErrors.push('Введите почту');
    } else if (!validateEmail(email)) {
      newErrors.push('Почта должна заканчиваться на @gmail.com');
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      newErrors.push(...passwordErrors.map(e => `Пароль: ${e}`));
    }

    if (password !== confirmPassword) {
      newErrors.push('Пароли не совпадают');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.find((u: any) => u.login === loginInput || u.email === email);
      if (userExists) {
        setErrors(['Пользователь с таким логином или почтой уже существует']);
        return;
      }

      users.push({ login: loginInput, email, password });
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      await authLogin(loginInput, email);
      setErrors([]);
    } catch (error) {
      setErrors(['Ошибка регистрации']);
    }
  };

  const handleLogin = async () => {
    const newErrors: string[] = [];

    if (!loginInput) {
      newErrors.push('Введите логин');
    }
    if (!password) {
      newErrors.push('Введите пароль');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const user = users.find((u: any) => u.login === loginInput && u.password === password);
      if (!user) {
        setErrors(['Неверный логин или пароль']);
        return;
      }

      await authLogin(user.login, user.email);
      setErrors([]);
    } catch (error) {
      setErrors(['Ошибка входа']);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={require('../assets/images/majestic-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>MAJESTIC RP</Text>
          <Text style={styles.subtitle}>Лаунчер</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.activeTab]}
              onPress={() => { setMode('login'); setErrors([]); }}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>Вход</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.activeTab]}
              onPress={() => { setMode('register'); setErrors([]); }}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>Регистрация</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor="#888"
              value={loginInput}
              onChangeText={setLoginInput}
              autoCapitalize="none"
            />

            {mode === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Email (@gmail.com)"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {mode === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Подтвердите пароль"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}

            {errors.length > 0 && (
              <View style={styles.errorsContainer}>
                {errors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>• {error}</Text>
                ))}
              </View>
            )}

            {mode === 'register' && (
              <View style={styles.passwordHints}>
                <Text style={styles.hintTitle}>Требования к паролю:</Text>
                <Text style={styles.hintText}>• Минимум 20 символов</Text>
                <Text style={styles.hintText}>• Минимум 2 заглавные буквы</Text>
                <Text style={styles.hintText}>• Минимум 5 цифр</Text>
                <Text style={styles.hintText}>• Минимум 2 спецсимвола</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={mode === 'login' ? handleLogin : handleRegister}
            >
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ff1493',
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  activeTab: {
    backgroundColor: '#ff1493',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  errorsContainer: {
    backgroundColor: '#2a1515',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff6666',
    fontSize: 14,
    marginBottom: 4,
  },
  passwordHints: {
    backgroundColor: '#1a1a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  hintTitle: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hintText: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#ff1493',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
