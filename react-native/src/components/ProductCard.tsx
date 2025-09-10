import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Product, CartProduct } from '../types';
import AddToCartButton from './shared/AddToCartButton';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigation = useNavigation();
  const { id, name, price, mrp, image, category } = product;

  const cartProduct: CartProduct = {
    id: id.toString(),
    title: name,
    subTitle: category,
    image,
    price,
    mrp,
  };

  const handleProductPress = () => {
    navigation.navigate('ProductDetail' as never, { productId: id } as never);
  };

  const imageUri = image 
    ? `http://localhost:3001${image}` 
    : 'http://localhost:3001/uploads/placeholder.png';

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <TouchableOpacity onPress={handleProductPress} style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <TouchableOpacity onPress={handleProductPress}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleProductPress}>
            {price < mrp ? (
              <View>
                <Text style={styles.price}>₹{price}</Text>
                <Text style={styles.mrp}>₹{mrp}</Text>
              </View>
            ) : (
              <Text style={styles.price}>₹{mrp}</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.addToCartContainer}>
            <AddToCartButton product={cartProduct} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 120,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    padding: 8,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mrp: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartContainer: {
    width: 80,
    height: 32,
  },
});

export default ProductCard;