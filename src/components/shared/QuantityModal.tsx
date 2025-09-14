import { useState } from 'react';
import { PricingTier } from '../../utils/types';

type QuantityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  pricingTiers: PricingTier[];
  productName: string;
};

const QuantityModal = ({ isOpen, onClose, onConfirm, pricingTiers, productName }: QuantityModalProps) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const getCurrentPrice = (qty: number, basePrice: number) => {
    const sortedTiers = [...pricingTiers].sort((a, b) => b.qty - a.qty);
    const matchedTier = sortedTiers.find(tier => qty >= tier.qty);
    
    if (matchedTier) {
      if (matchedTier.price !== undefined) {
        return matchedTier.price;
      }
      if (matchedTier.discount !== undefined) {
        return Math.max(0, basePrice - matchedTier.discount);
      }
    }
    
    return basePrice;
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
        <h3 className="text-lg font-semibold mb-4">{productName}</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Discount Tiers</h4>
          <div className="space-y-1 text-sm">
            {pricingTiers.map((tier, index) => {
              const basePrice = pricingTiers[0]?.price || 100; // fallback base price
              const finalPrice = tier.price !== undefined ? tier.price : 
                               tier.discount !== undefined ? Math.max(0, basePrice - tier.discount) : basePrice;
              return (
                <div key={index} className={`p-2 rounded ${quantity >= tier.qty ? 'bg-green-100' : 'bg-gray-50'}`}>
                  {tier.qty}+ qty: {tier.discount ? `₹${tier.discount} off` : `₹${tier.price}`} (₹{finalPrice} each)
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded">
          <div className="text-sm">
            <strong>Your Price: ₹{getCurrentPrice(quantity, pricingTiers[0]?.price || 100)} each</strong>
          </div>
          <div className="text-sm text-gray-600">
            Total: ₹{getCurrentPrice(quantity, pricingTiers[0]?.price || 100) * quantity}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;