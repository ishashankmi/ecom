import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginAsync, registerAsync, clearError } from '../store/auth';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    if (!isLogin && !formData.name) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your name',
      });
      return;
    }

    try {
      if (isLogin) {
        await dispatch(loginAsync({
          email: formData.email,
          password: formData.password,
        })).unwrap();
      } else {
        await dispatch(registerAsync({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })).unwrap();
      }
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: isLogin ? 'Logged in successfully' : 'Account created successfully',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Something went wrong',
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          Sar<Text style={styles.logoAccent}>as</Text>
        </Text>
        
        <Text style={styles.title}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Text>
        
        <View style={styles.form}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleButtonText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 16,
  },
  logoAccent: {
    color: '#F59E0B',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;