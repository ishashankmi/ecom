import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { addressesAPI } from '../services/api';

const LocationPicker = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', area: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAddresses();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAddForm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
      if (response.data.length > 0 && !selectedAddress) {
        setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await addressesAPI.create(newAddress);
      const newAddr = response.data;
      setAddresses([...addresses, newAddr]);
      setSelectedAddress(newAddr);
      setNewAddress({ label: '', address: '', area: '' });
      setShowAddForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg ${
          user ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-60'
        }`}
        onClick={() => {
          if (!user) {
            navigate('/login');
            return;
          }
          setIsOpen(!isOpen);
        }}
      >
        <FaMapMarkerAlt className="text-primary text-lg" />
        <div className="flex flex-col">
          {selectedAddress ? (
            <>
              <p className="font-semibold text-sm text-gray-800">
                Deliver to {selectedAddress.label}
              </p>
              <span className="text-xs text-gray-600 truncate max-w-[180px]">
                {selectedAddress.area}
              </span>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm text-gray-800">Select Location</p>
              <span className="text-xs text-gray-600">Choose delivery address</span>
            </>
          )}
        </div>
        <FaChevronDown className={`text-gray-400 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Select Delivery Address</h3>
          </div>
          
          {!showAddForm ? (
            <>
              <div className="max-h-60 overflow-y-auto">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                    onClick={() => {
                      setSelectedAddress(address);
                      setIsOpen(false);
                    }}
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
                <button 
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setShowAddForm(true);
                  }}
                  className="w-full text-primary font-medium text-sm py-2 hover:bg-blue-50 rounded"
                >
                  + Add New Address
                </button>
              </div>
            </>
          ) : (
            <div className="p-4">
              <h4 className="font-medium mb-3">Add New Address</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Label (Home, Office, etc.)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Area/Locality"
                  value={newAddress.area}
                  onChange={(e) => setNewAddress({...newAddress, area: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                />
                <textarea
                  placeholder="Full Address"
                  rows={2}
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 bg-primary text-white py-2 rounded text-sm hover:bg-primary-dark"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 bg-gray-500 text-white py-2 rounded text-sm hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
