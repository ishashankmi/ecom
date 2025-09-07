import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../store/products';
import { toast } from 'react-toastify';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  mrp: z.number().min(0, 'MRP must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ProductData = z.infer<typeof productSchema>;

export default function ProductManager() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector(state => state.products);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onSubmit = async (data: ProductData) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct, ...data, image: '/categories/1.avif' })).unwrap();
        toast.success('Product updated successfully!');
        setEditingProduct(null);
      } else {
        await dispatch(createProduct({ ...data, image: '/categories/1.avif' })).unwrap();
        toast.success('Product added successfully!');
      }
      reset();
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product.id);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('mrp', product.mrp);
    setValue('category', product.category);
    setValue('stock', product.stock);
    setValue('description', product.description);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    reset();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('name')}
                placeholder="Product Name"
                className="w-full p-3 border rounded-lg"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                placeholder="Price"
                className="w-full p-3 border rounded-lg"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div>
              <input
                {...register('mrp', { valueAsNumber: true })}
                type="number"
                placeholder="MRP"
                className="w-full p-3 border rounded-lg"
              />
              {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp.message}</p>}
            </div>

            <div>
              <select {...register('category')} className="w-full p-3 border rounded-lg">
                <option value="">Select Category</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="snacks">Snacks</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                placeholder="Stock Quantity"
                className="w-full p-3 border rounded-lg"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>

            <div>
              <textarea
                {...register('description')}
                placeholder="Product Description"
                rows={3}
                className="w-full p-3 border rounded-lg"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Products List</h3>
          
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map(product => (
              <div key={product.id} className="border p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">₹{product.price} | Stock: {product.stock}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}