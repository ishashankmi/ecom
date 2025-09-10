import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logoutAsync } from '../../store/auth';

const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { totalQuantity } = useAppSelector(state => state.cart);

  const handleAuthPress = () => {
    if (user) {
      dispatch(logoutAsync());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.logo}>
            Sar<Text style={styles.logoAccent}>as</Text>
          </Text>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.authButton} onPress={handleAuthPress}>
            <Ionicons name="person-outline" size={20} color="#333" />
            <Text style={styles.authText}>
              {user ? user.name : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  leftSection: {
    flex: 1,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F59E0B',
  },
  logoAccent: {
    color: '#F59E0B',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  authText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default Header;