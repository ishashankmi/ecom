import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addToCart, removeFromCart } from '../../store/cart';
import { CartProduct } from '../../types';

interface Props {
  product: CartProduct;
}

const AddToCartButton: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => 
    state.cart.items.find(item => item.product.id === product.id)
  );

  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    dispatch(addToCart(product));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
  };

  if (quantity === 0) {
    return (
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>ADD</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity style={styles.quantityButton} onPress={handleRemove}>
        <Ionicons name="remove" size={16} color="#F59E0B" />
      </TouchableOpacity>
      
      <Text style={styles.quantityText}>{quantity}</Text>
      
      <TouchableOpacity style={styles.quantityButton} onPress={handleAdd}>
        <Ionicons name="add" size={16} color="#F59E0B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    flex: 1,
  },
  quantityButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddToCartButton;