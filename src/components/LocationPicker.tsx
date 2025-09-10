import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';

interface Address {
  id: number;
  label: string;
  address: string;
  area: string;
}

const LocationPicker = () => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const addresses: Address[] = [
    { id: 1, label: 'Home', address: '123 Main Street', area: 'Downtown' },
    { id: 2, label: 'Office', address: '456 Business Ave', area: 'Business District' },
    { id: 3, label: 'Other', address: '789 Park Road', area: 'Uptown' },
  ];

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg md:p-2 p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaMapMarkerAlt className="text-primary text-lg" />
        <div className="flex flex-col">
          {selectedAddress ? (
            <>
              <p className="font-semibold text-sm md:text-sm text-xs leading-tight text-gray-800">
                Deliver to {selectedAddress.label}
              </p>
              <span className="text-xs md:text-xs text-[10px] text-gray-600 truncate max-w-[180px] md:max-w-[180px] max-w-[120px]">
                {selectedAddress.area}
              </span>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm md:text-sm text-xs text-gray-800">Select Location</p>
              <span className="text-xs md:text-xs text-[10px] text-gray-600">Choose delivery address</span>
            </>
          )}
        </div>
        <FaChevronDown className={`text-gray-400 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 md:w-72 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Select Delivery Address</h3>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                onClick={() => handleAddressSelect(address)}
              >
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary text-sm mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{address.label}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-xs text-gray-500">{address.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-100">
            <button className="w-full text-primary font-medium text-sm py-2 hover:bg-blue-50 rounded">
              + Add New Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
