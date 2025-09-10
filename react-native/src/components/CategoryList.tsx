import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Category } from '../types';

interface Props {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryList: React.FC<Props> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === 'all' && styles.selectedCategory,
          ]}
          onPress={() => onCategorySelect('all')}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'all' && styles.selectedCategoryText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id.toString() && styles.selectedCategory,
            ]}
            onPress={() => onCategorySelect(category.id.toString())}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id.toString() && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#F59E0B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

export default CategoryList;