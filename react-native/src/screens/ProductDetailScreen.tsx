import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { productsAPI } from '../services/api';
import { Product, CartProduct } from '../types';
import AddToCartButton from '../components/shared/AddToCartButton';

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: number };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await productsAPI.getProduct(productId.toString());
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cartProduct: CartProduct = {
    id: product.id.toString(),
    title: product.name,
    subTitle: product.category,
    image: product.image,
    price: product.price,
    mrp: product.mrp,
  };

  const imageUri = product.image 
    ? `http://localhost:3001${product.image}` 
    : 'http://localhost:3001/uploads/placeholder.png';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.productImage} />
        </View>

        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>{product.category}</Text>
          
          {product.description && (
            <Text style={styles.productDescription}>{product.description}</Text>
          )}

          <View style={styles.priceContainer}>
            {product.price < product.mrp ? (
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                <Text style={styles.mrp}>₹{product.mrp}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.price}>₹{product.mrp}</Text>
            )}
          </View>

          {product.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          )}

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            {product.inventory !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>In Stock:</Text>
                <Text style={styles.detailValue}>{product.inventory} units</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.addToCartContainer}>
          <AddToCartButton product={cartProduct} />
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
  imageContainer: {
    height: 300,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginRight: 12,
  },
  mrp: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  addToCartContainer: {
    height: 50,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
  },
});

export default ProductDetailScreen;