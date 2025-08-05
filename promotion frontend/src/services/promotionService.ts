export async function fetchPromotions() {
  const response = await fetch('/src/assets/promotions.json');
  if (!response.ok) throw new Error('Failed to fetch promotions');
  return response.json();
} 