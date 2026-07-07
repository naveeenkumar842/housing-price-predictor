export const formatINR = (amount) => {
  if (!amount) return '₹0';
  const num = Math.round(Math.abs(amount));
  const str = num.toString();
  
  if (str.length <= 3) return `₹${str}`;
  
  const reversed = str.split('').reverse();
  const parts = [];
  parts.push(reversed.splice(0, 3).reverse().join(''));
  
  while (reversed.length > 0) {
    parts.push(reversed.splice(0, 2).reverse().join(''));
  }
  
  return `₹${parts.reverse().join(',')}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNumber = (num, decimals = 2) => {
  return Number(num).toFixed(decimals);
};