import React, { useState } from 'react';
import { RideData } from '../types';

interface DataInputFormProps {
  onDataSubmit: (data: RideData) => void;
  initialData?: Partial<RideData>;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ onDataSubmit, initialData }) => {
  const [formData, setFormData] = useState<RideData>({
    totalEarnings: initialData?.totalEarnings || 0,
    ridesCompleted: initialData?.ridesCompleted || 0,
    ridesRejected: initialData?.ridesRejected || 0,
    onlineHours: initialData?.onlineHours || 0,
    onlineMinutes: initialData?.onlineMinutes || 0,
    bookedHours: initialData?.bookedHours || 0,
    bookedMinutes: initialData?.bookedMinutes || 0,
    bookedMiles: initialData?.bookedMiles || 0,
    fuelCost: initialData?.fuelCost || 0,
    maintenanceCost: initialData?.maintenanceCost || 0,
    vehicleDepreciation: initialData?.vehicleDepreciation || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof RideData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (formData.totalEarnings <= 0) newErrors.totalEarnings = 'Total earnings must be greater than 0';
    if (formData.ridesCompleted <= 0) newErrors.ridesCompleted = 'Rides completed must be greater than 0';
    if (formData.ridesRejected < 0) newErrors.ridesRejected = 'Rides rejected cannot be negative';
    if (formData.onlineHours < 0) newErrors.onlineHours = 'Online hours cannot be negative';
    if (formData.onlineMinutes < 0 || formData.onlineMinutes >= 60) newErrors.onlineMinutes = 'Minutes must be between 0 and 59';
    if (formData.bookedHours < 0) newErrors.bookedHours = 'Booked hours cannot be negative';
    if (formData.bookedMinutes < 0 || formData.bookedMinutes >= 60) newErrors.bookedMinutes = 'Minutes must be between 0 and 59';
    if (formData.bookedMiles <= 0) newErrors.bookedMiles = 'Booked miles must be greater than 0';

    // Logical validation
    const onlineTime = formData.onlineHours + (formData.onlineMinutes / 60);
    const bookedTime = formData.bookedHours + (formData.bookedMinutes / 60);

    if (bookedTime > onlineTime) {
      newErrors.bookedTime = 'Booked time cannot be greater than online time';
    }

    if (onlineTime === 0) {
      newErrors.onlineTime = 'Online time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onDataSubmit(formData);
    }
  };

  const inputClasses = "input-field";
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Rideshare Data</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="totalEarnings" className="block text-sm font-medium text-gray-700 mb-1">
              Total Earnings ($) *
            </label>
            <input
              type="number"
              id="totalEarnings"
              step="0.01"
              min="0"
              value={formData.totalEarnings || ''}
              onChange={(e) => handleInputChange('totalEarnings', parseFloat(e.target.value) || 0)}
              className={inputClasses}
              placeholder="250.00"
            />
            {errors.totalEarnings && <p className={errorClasses}>{errors.totalEarnings}</p>}
          </div>

          <div>
            <label htmlFor="ridesCompleted" className="block text-sm font-medium text-gray-700 mb-1">
              Rides Completed *
            </label>
            <input
              type="number"
              id="ridesCompleted"
              min="0"
              value={formData.ridesCompleted || ''}
              onChange={(e) => handleInputChange('ridesCompleted', parseInt(e.target.value) || 0)}
              className={inputClasses}
              placeholder="15"
            />
            {errors.ridesCompleted && <p className={errorClasses}>{errors.ridesCompleted}</p>}
          </div>

          <div>
            <label htmlFor="ridesRejected" className="block text-sm font-medium text-gray-700 mb-1">
              Rides Rejected
            </label>
            <input
              type="number"
              id="ridesRejected"
              min="0"
              value={formData.ridesRejected || ''}
              onChange={(e) => handleInputChange('ridesRejected', parseInt(e.target.value) || 0)}
              className={inputClasses}
              placeholder="3"
            />
            {errors.ridesRejected && <p className={errorClasses}>{errors.ridesRejected}</p>}
          </div>

          <div>
            <label htmlFor="bookedMiles" className="block text-sm font-medium text-gray-700 mb-1">
              Booked Miles *
            </label>
            <input
              type="number"
              id="bookedMiles"
              step="0.01"
              min="0"
              value={formData.bookedMiles || ''}
              onChange={(e) => handleInputChange('bookedMiles', parseFloat(e.target.value) || 0)}
              className={inputClasses}
              placeholder="75.5"
            />
            {errors.bookedMiles && <p className={errorClasses}>{errors.bookedMiles}</p>}
          </div>
        </div>

        {/* Time Inputs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Online Time *
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    value={formData.onlineHours || ''}
                    onChange={(e) => handleInputChange('onlineHours', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Hours"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.onlineMinutes || ''}
                    onChange={(e) => handleInputChange('onlineMinutes', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Minutes"
                  />
                </div>
              </div>
              {(errors.onlineHours || errors.onlineMinutes || errors.onlineTime) && (
                <p className={errorClasses}>
                  {errors.onlineHours || errors.onlineMinutes || errors.onlineTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booked Time *
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    value={formData.bookedHours || ''}
                    onChange={(e) => handleInputChange('bookedHours', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Hours"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.bookedMinutes || ''}
                    onChange={(e) => handleInputChange('bookedMinutes', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Minutes"
                  />
                </div>
              </div>
              {(errors.bookedHours || errors.bookedMinutes || errors.bookedTime) && (
                <p className={errorClasses}>
                  {errors.bookedHours || errors.bookedMinutes || errors.bookedTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Optional Cost Inputs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Operating Costs (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="fuelCost" className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Cost ($)
              </label>
              <input
                type="number"
                id="fuelCost"
                step="0.01"
                min="0"
                value={formData.fuelCost || ''}
                onChange={(e) => handleInputChange('fuelCost', parseFloat(e.target.value) || 0)}
                className={inputClasses}
                placeholder="25.00"
              />
            </div>

            <div>
              <label htmlFor="maintenanceCost" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Cost ($)
              </label>
              <input
                type="number"
                id="maintenanceCost"
                step="0.01"
                min="0"
                value={formData.maintenanceCost || ''}
                onChange={(e) => handleInputChange('maintenanceCost', parseFloat(e.target.value) || 0)}
                className={inputClasses}
                placeholder="10.00"
              />
            </div>

            <div>
              <label htmlFor="vehicleDepreciation" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Depreciation ($)
              </label>
              <input
                type="number"
                id="vehicleDepreciation"
                step="0.01"
                min="0"
                value={formData.vehicleDepreciation || ''}
                onChange={(e) => handleInputChange('vehicleDepreciation', parseFloat(e.target.value) || 0)}
                className={inputClasses}
                placeholder="15.00"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            Calculate Advanced Metrics
          </button>
        </div>
      </form>
    </div>
  );
};