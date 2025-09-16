import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationPicker = () => {
  return (
    <div className="flex items-center gap-2 p-2">
      <FaMapMarkerAlt className="text-primary text-lg" />
      <div className="flex flex-col">
        <p className="font-semibold text-sm md:text-sm text-xs text-gray-800">Delivery Location</p>
        <span className="text-xs md:text-xs text-[10px] text-gray-600">Set your address</span>
      </div>
    </div>
  );
};

export default LocationPicker;
