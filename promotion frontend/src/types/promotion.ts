/**
 * Type definitions for the promotion engine
 */

export type PromotionType = 'percentage' | 'fixed' | 'bogo' | 'bxgy' | 'tiered' | 'custom';

export type PromotionApplicability = 'cart' | 'product' | 'category' | 'sku';

export interface PromotionCondition {
  minCartValue?: number;
  userType?: 'new' | 'existing' | 'all';
  category?: string[];
  paymentMethod?: string[];
  userSegment?: string;
  firstTimeUser?: boolean;
  productIds?: string[];
  skuIds?: string[];
  [key: string]: any; // For custom conditions
}

export interface PromotionAction {
  type: PromotionType;
  value: number;
  targetProductIds?: string[];
  buyQuantity?: number;
  getQuantity?: number;
  tiers?: Array<{ quantity: number; price: number }>;
  [key: string]: any; // For custom actions
}

export interface PromotionRule {
  conditions: PromotionCondition[];
  actions: PromotionAction[];
}

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  applicability: PromotionApplicability;
  conditions: PromotionCondition;
  rule_json?: PromotionRule;
  startDate: string;
  endDate: string;
  stackable: boolean;
  priority: number;
  isActive?: boolean;
  clientId?: string;
  createdBy?: string;
  updatedBy?: string;
  tags?: string[];
}

// Add this line to provide a default export
// Remove default export since we can't default export a type
// Use named exports instead

// Rest of the file remains unchanged
export interface Client {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  metadata?: Record<string, any>;
}

export interface AppliedPromotion {
  id: string;
  promotionId: string;
  orderId: string;
  clientId: string;
  cartSnapshot: Record<string, any>;
  finalDiscountAmount: number;
  evaluatedAt: string;
  promotion?: Promotion;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  sku?: string;
}

export interface Cart {
  items: CartItem[];
  userId?: string;
  userType?: 'new' | 'existing';
  paymentMethod?: string;
  userSegment?: string;
}

export interface EvaluationResult {
  originalTotal: number;
  discount: number;
  finalTotal: number;
  appliedPromotions: Promotion[];
}