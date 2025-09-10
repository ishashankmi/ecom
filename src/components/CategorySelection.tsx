import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories } from '../store/categories';

interface CategorySelectionProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onCategorySelect, selectedCategory }) => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector(state => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const getDefaultIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      fruits: '🍎',
      vegetables: '🥕',
      dairy: '🥛',
      bakery: '🍞',
      snacks: '🍿',
      beverages: '🥤',
      meat: '🥩',
    };
    return iconMap[categoryName.toLowerCase()] || '📦';
  };

  const getDefaultColor = (index: number) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-orange-100 text-orange-600',
      'bg-purple-100 text-purple-600',
      'bg-indigo-100 text-indigo-600',
      'bg-pink-100 text-pink-600',
    ];
    return colors[index % colors.length];
  };

  const allCategories = [
    { id: 'all', name: 'All', icon: '🛒', color: 'bg-blue-100 text-blue-600' },
    ...categories.map((cat, index) => ({
      ...cat,
      id: cat.id.toString(),
      icon: cat.icon || getDefaultIcon(cat.name),
      color: cat.color || getDefaultColor(index)
    }))
  ];

  if (loading && categories.length === 0) {
    return <div className="mb-6"><div className="text-center py-4">Loading categories...</div></div>;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={(e) => {
              e.preventDefault();
              console.log('Category selected:', category.id);
              onCategorySelect(category.id);
            }}
            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border-2 transition-all min-w-[80px] ${
              selectedCategory === category.id
                ? `${category.color} border-current`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl mb-1">{category.icon}</span>
            <span className="text-xs font-medium text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;