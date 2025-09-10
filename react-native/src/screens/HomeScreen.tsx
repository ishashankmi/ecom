import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchProductsByCategory } from '../store/products';
import { fetchCategories } from '../store/categories';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import Header from '../components/shared/Header';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector(state => state.products);
  const { categories } = useAppSelector(state => state.categories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProductsByCategory(categoryId));
    }
  };

  const selectedCategoryName = selectedCategory === 'all' 
    ? 'All Products' 
    : categories.find(cat => cat.id.toString() === selectedCategory)?.name || 'Products';

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{selectedCategoryName}</Text>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading products...</Text>
          ) : (
            <View style={styles.productsGrid}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          )}
          
          {!loading && products.length === 0 && (
            <Text style={styles.emptyText}>No products found</Text>
          )}
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
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
});

export default HomeScreen;