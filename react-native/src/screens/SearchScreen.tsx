import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { searchProducts } from '../store/products';
import ProductCard from '../components/ProductCard';

const SearchScreen = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector(state => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery.trim()));
      setHasSearched(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Searching...</Text>
        ) : hasSearched ? (
          products.length > 0 ? (
            <>
              <Text style={styles.resultsTitle}>
                Found {products.length} results for "{searchQuery}"
              </Text>
              <View style={styles.productsGrid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search" size={60} color="#ccc" />
              <Text style={styles.noResultsTitle}>No products found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try searching with different keywords
              </Text>
            </View>
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>Search for products</Text>
            <Text style={styles.emptySubtitle}>
              Find your favorite groceries and more
            </Text>
          </View>
        )}
      </ScrollView>
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;