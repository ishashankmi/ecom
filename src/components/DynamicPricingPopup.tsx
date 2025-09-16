import { useState } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';

interface DynamicPricingPopupProps {
  product: {
    id: string;
    title: string;
    price: number;
  };
}

const DynamicPricingPopup = ({ product }: DynamicPricingPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
      >
        <FiInfo size={14} />
        Bulk Pricing
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bulk Pricing for {product.title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">1 item:</span>
                  <span className="text-lg font-bold" style={{color: '#0041C2'}}>₹{product.price}</span>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">2+ items:</span>
                  <span className="text-lg font-bold text-green-700">₹{Math.round(product.price * 0.9)} each</span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Save ₹{Math.round(product.price * 0.1)} per item
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">5+ items:</span>
                  <span className="text-lg font-bold text-blue-700">₹{Math.round(product.price * 0.8)} each</span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Save ₹{Math.round(product.price * 0.2)} per item
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{backgroundColor: '#0041C2'}}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicPricingPopup;