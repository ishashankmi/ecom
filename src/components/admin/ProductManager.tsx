import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProducts, createProduct } from '../../store/products';
import { toast } from 'react-toastify';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ProductData = z.infer<typeof productSchema>;

export default function ProductManager() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector(state => state.products);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onSubmit = async (data: ProductData) => {
    try {
      await dispatch(createProduct({ ...data, image: '/categories/1.avif' })).unwrap();
      toast.success('Product added successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
          
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
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
                    <button className="text-blue-600 text-sm">Edit</button>
                    <button className="text-red-600 text-sm">Delete</button>
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