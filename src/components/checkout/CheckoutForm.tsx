import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { createOrder } from '../../store/orders';
import { clearCart } from '../../store/cart';

const checkoutSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const dispatch = useAppDispatch();
  const { cartItems, billAmount } = useAppSelector(state => state.cart);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutData) => {
    const orderItems = cartItems.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.unitPrice,
      name: item.product.title,
    }));

    await dispatch(createOrder({
      items: orderItems,
      total: billAmount,
      delivery_address: data.address,
    }));
    
    dispatch(clearCart());
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Delivery Address</label>
          <textarea
            {...register('address')}
            rows={3}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your complete address"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>



        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total: ₹{billAmount}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}