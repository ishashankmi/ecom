import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { createOrder } from '../store/orders';
import { clearCart } from '../store/cart';
import Toast from 'react-native-toast-message';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, billAmount, totalDiscount } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter delivery address',
      });
      return;
    }

    if (!phone.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter phone number',
      });
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: billAmount,
        address: address.trim(),
        phone: phone.trim(),
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Order placed successfully!',
      });

      navigation.navigate('Orders' as never);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to place order. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 29;
  const finalTotal = billAmount + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={user?.name || ''}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter complete delivery address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {items.map(item => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.title}
              </Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.totalPrice}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{billAmount + totalDiscount}</Text>
          </View>
          
          {totalDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount</Text>
              <Text style={[styles.billValue, styles.discount]}>-₹{totalDiscount}</Text>
            </View>
          )}
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>
          
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotal}>₹{finalTotal}</Text>
          <Text style={styles.footerSubtext}>Total Amount</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  section: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    color: '#333',
  },
  discount: {
    color: '#22c55e',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  totalContainer: {
    flex: 1,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
  },
  placeOrderButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;