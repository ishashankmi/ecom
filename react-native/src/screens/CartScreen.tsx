import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { addToCart, removeFromCart, clearCart } from '../store/cart';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, totalQuantity, billAmount, totalDiscount } = useAppSelector(state => state.cart);

  const handleQuantityChange = (productId: string, action: 'add' | 'remove') => {
    const item = items.find(item => item.product.id === productId);
    if (!item) return;

    if (action === 'add') {
      dispatch(addToCart(item.product));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout' as never);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some products to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({totalQuantity} items)</Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {items.map(item => (
          <View key={item.product.id} style={styles.cartItem}>
            <Image
              source={{
                uri: item.product.image
                  ? `http://localhost:3001${item.product.image}`
                  : 'http://localhost:3001/uploads/placeholder.png'
              }}
              style={styles.productImage}
            />
            
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product.title}
              </Text>
              <Text style={styles.productCategory}>
                {item.product.subTitle}
              </Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{item.product.price}</Text>
                {item.product.mrp > item.product.price && (
                  <Text style={styles.mrp}>₹{item.product.mrp}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.product.id, 'remove')}
              >
                <Ionicons name="remove" size={16} color="#F59E0B" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.product.id, 'add')}
              >
                <Ionicons name="add" size={16} color="#F59E0B" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.billContainer}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>₹{billAmount + totalDiscount}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount</Text>
              <Text style={[styles.billValue, styles.discount]}>-₹{totalDiscount}</Text>
            </View>
          )}
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{billAmount}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  mrp: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  billContainer: {
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    paddingTop: 8,
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
  checkoutButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;