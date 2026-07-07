export const validateFeatures = (features) => {
  const errors = {};
  const validations = {
    square_footage: { min: 500, max: 5000, message: 'Square footage must be between 500 and 5000' },
    bedrooms: { min: 1, max: 10, message: 'Bedrooms must be between 1 and 10' },
    bathrooms: { min: 0.5, max: 5, message: 'Bathrooms must be between 0.5 and 5' },
    year_built: { min: 1950, max: 2025, message: 'Year built must be between 1950 and 2025' },
    lot_size: { min: 1000, max: 20000, message: 'Lot size must be between 1000 and 20000' },
    distance_to_city_center: { min: 0.5, max: 20, message: 'Distance must be between 0.5 and 20 miles' },
    school_rating: { min: 1, max: 10, message: 'School rating must be between 1 and 10' },
  };
  
  for (const [key, value] of Object.entries(features)) {
    if (validations[key]) {
      const { min, max, message } = validations[key];
      if (value < min || value > max) {
        errors[key] = message;
      }
    }
  }
  
  return errors;
};