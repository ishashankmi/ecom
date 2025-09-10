import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logoutAsync } from '../store/auth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const navigateToOrders = () => {
    navigation.navigate('Orders' as never);
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: 'bag-outline',
      onPress: navigateToOrders,
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      icon: 'location-outline',
      onPress: () => {},
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => {},
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#F59E0B" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color="#666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appName}>Saras v2.0</Text>
          <Text style={styles.appDescription}>
            Your favorite grocery delivery app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutContainer: {
    padding: 20,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfileScreen;