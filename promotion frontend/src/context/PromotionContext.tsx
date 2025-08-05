import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Promotion, Client, AppliedPromotion, EvaluationResult, Cart, CartItem } from '../types/promotion';
import * as api from '../services/api';

interface PromotionContextType {
  // Data
  promotions: Promotion[];
  clients: Client[];
  appliedPromotions: AppliedPromotion[];
  loading: boolean;
  error: string | null;
  
  // Cart and evaluation
  cart: Cart;
  evaluationResult: EvaluationResult | null;
  
  // Actions
  fetchPromotions: () => Promise<void>;
  fetchClients: () => Promise<void>;
  fetchAppliedPromotions: () => Promise<void>;
  createPromotion: (promotion: Omit<Promotion, 'id'>) => Promise<Promotion>;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<Promotion>;
  deletePromotion: (id: string) => Promise<void>;
  evaluateCart: (cart: Cart) => Promise<EvaluationResult>;
  updateCart: (cart: Partial<Cart>) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const usePromotionContext = () => {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotionContext must be used within a PromotionProvider');
  }
  return context;
};

interface PromotionProviderProps {
  children: ReactNode;
}

export const PromotionProvider = ({ children }: PromotionProviderProps) => {
  // State
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appliedPromotions, setAppliedPromotions] = useState<AppliedPromotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cart state
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Fetch data
  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPromotions();
      setPromotions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAppliedPromotions();
      setAppliedPromotions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applied promotions');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const createPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPromotion = await api.createPromotion(promotion);
      setPromotions([...promotions, newPromotion]);
      return newPromotion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create promotion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePromotion = async (id: string, promotion: Partial<Promotion>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPromotion = await api.updatePromotion(id, promotion);
      setPromotions(promotions.map(p => p.id === id ? updatedPromotion : p));
      return updatedPromotion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update promotion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deletePromotion(id);
      setPromotions(promotions.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete promotion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const updateCart = (newCartData: Partial<Cart>) => {
    setCart(prev => ({ ...prev, ...newCartData }));
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(i => i.id === item.id);
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1)
        };
        return { ...prev, items: updatedItems };
      } else {
        // Add new item
        return { ...prev, items: [...prev.items, { ...item, quantity: item.quantity || 1 }] };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
    setEvaluationResult(null);
  };

  // Evaluation
  const evaluateCart = async (cartData: Cart) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.evaluateCart(cartData);
      setEvaluationResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPromotions(),
          fetchClients(),
          fetchAppliedPromotions()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const value = {
    promotions,
    clients,
    appliedPromotions,
    loading,
    error,
    cart,
    evaluationResult,
    fetchPromotions,
    fetchClients,
    fetchAppliedPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    evaluateCart,
    updateCart,
    addToCart,
    removeFromCart,
    clearCart
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};