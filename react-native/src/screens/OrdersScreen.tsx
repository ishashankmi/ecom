import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchOrders } from '../store/orders';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const goBack = () => {
    navigation.goBack();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#F59E0B';
      case 'confirmed':
        return '#3B82F6';
      case 'delivered':
        return '#22C55E';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id.slice(-8)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <Text style={styles.orderDate}>
                {formatDate(order.createdAt)}
              </Text>

              <View style={styles.orderItems}>
                {order.items.slice(0, 2).map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    {item.product.title} x{item.quantity}
                  </Text>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItems}>
                    +{order.items.length - 2} more items
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>₹{order.total}</Text>
                <TouchableOpacity style={styles.reorderButton}>
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.deliveryAddress} numberOfLines={2}>
                Delivered to: {order.address}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  reorderButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  reorderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryAddress: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default OrdersScreen;