/**
 * API service for the promotion engine
 * This file contains mock API calls that will be replaced with actual API calls later
 */

import type { Promotion, PromotionRule, Client, AppliedPromotion } from '../types/promotion';
import mockPromotions from '../data/mockPromotions';
// Mock client data since mockClients module is missing
const mockClients = [
  {
    id: 'CLIENT_1',
    name: 'Test Client 1',
    email: 'client1@test.com'
  },
  {
    id: 'CLIENT_2', 
    name: 'Test Client 2',
    email: 'client2@test.com'
  }
];
import mockAppliedPromotions from '../data/mockAppliedPromotions';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Promotions API
export const getPromotions = async (): Promise<Promotion[]> => {
  await delay(500);
  return [...mockPromotions];
};

export const getPromotionById = async (id: string): Promise<Promotion | undefined> => {
  await delay(300);
  return mockPromotions.find(promo => promo.id === id);
};

export const createPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
  await delay(500);
  const newPromotion = {
    ...promotion,
    id: `PROMO_${Math.random().toString(36).substr(2, 9)}`,
  };
  mockPromotions.push(newPromotion as Promotion);
  return newPromotion as Promotion;
};

export const updatePromotion = async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
  await delay(500);
  const index = mockPromotions.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Promotion not found');
  
  const updatedPromotion = { ...mockPromotions[index], ...promotion };
  mockPromotions[index] = updatedPromotion;
  return updatedPromotion;
};

export const deletePromotion = async (id: string): Promise<void> => {
  await delay(500);
  const index = mockPromotions.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Promotion not found');
  mockPromotions.splice(index, 1);
};

// Clients API
export const getClients = async (): Promise<Client[]> => {
  await delay(500);
  return [...mockClients];
};

// Applied Promotions API
export const getAppliedPromotions = async (): Promise<AppliedPromotion[]> => {
  await delay(500);
  return [...mockAppliedPromotions];
};

// Evaluation API
export const evaluateCart = async (cartData: any): Promise<any> => {
  await delay(700);
  // Mock evaluation logic
  const applicablePromotions = mockPromotions.filter(promo => {
    // Simple evaluation based on cart total and active dates
    const cartTotal = cartData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    
    return (
      now >= startDate && 
      now <= endDate && 
      (!promo.conditions.minCartValue || cartTotal >= promo.conditions.minCartValue)
    );
  });

  // Sort by priority
  applicablePromotions.sort((a, b) => a.priority - b.priority);

  // Calculate discount
  let totalDiscount = 0;
  const appliedPromotions: Promotion[] = [];

  for (const promo of applicablePromotions) {
    if (!promo.stackable && appliedPromotions.length > 0) continue;

    let discount = 0;
    if (promo.type === 'percentage') {
      const cartTotal = cartData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      discount = (cartTotal * promo.value) / 100;
    } else if (promo.type === 'fixed') {
      discount = promo.value;
    }

    totalDiscount += discount;
    appliedPromotions.push(promo);
  }

  return {
    originalTotal: cartData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
    discount: totalDiscount,
    finalTotal: cartData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) - totalDiscount,
    appliedPromotions
  };
};