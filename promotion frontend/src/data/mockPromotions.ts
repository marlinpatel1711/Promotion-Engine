import type { Promotion } from '../types/promotion';

const mockPromotions: Promotion[] = [
  {
    id: 'SUMMER10',
    name: 'Summer Sale 10% Off',
    description: 'Get 10% off on all purchases during summer',
    type: 'percentage',
    value: 10,
    applicability: 'cart',
    conditions: {
      minCartValue: 1000,
      userType: 'all',
      category: ['electronics', 'fashion']
    },
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    stackable: true,
    priority: 1,
    isActive: true,
    clientId: 'client_1',
    tags: ['summer', 'seasonal']
  },
  {
    id: 'FESTIVE500',
    name: 'Festive Season ₹500 Off',
    description: 'Get flat ₹500 off on purchases above ₹2000',
    type: 'fixed',
    value: 500,
    applicability: 'cart',
    conditions: {
      minCartValue: 2000
    },
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    stackable: false,
    priority: 2,
    isActive: true,
    clientId: 'client_1',
    tags: ['festive', 'seasonal']
  },
  {
    id: 'BOGO_TSHIRT',
    name: 'Buy 1 Get 1 T-Shirt',
    description: 'Buy one t-shirt and get another one free',
    type: 'bogo',
    value: 100,
    applicability: 'product',
    conditions: {
      productIds: ['tshirt_1', 'tshirt_2', 'tshirt_3']
    },
    rule_json: {
      conditions: [
        { minCartValue: 0 }
      ],
      actions: [
        { 
          type: 'bogo', 
          value: 100, 
          buyQuantity: 1, 
          getQuantity: 1,
          targetProductIds: ['tshirt_1', 'tshirt_2', 'tshirt_3']
        }
      ]
    },
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    stackable: false,
    priority: 3,
    isActive: true,
    clientId: 'client_1',
    tags: ['apparel', 'bogo']
  },
  {
    id: 'NEWUSER20',
    name: 'New User 20% Off',
    description: 'Get 20% off on your first purchase',
    type: 'percentage',
    value: 20,
    applicability: 'cart',
    conditions: {
      userType: 'new',
      firstTimeUser: true
    },
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    stackable: true,
    priority: 1,
    isActive: true,
    clientId: 'client_1',
    tags: ['new user']
  },
  {
    id: 'ELECTRONICS15',
    name: 'Electronics 15% Off',
    description: '15% off on all electronics',
    type: 'percentage',
    value: 15,
    applicability: 'category',
    conditions: {
      category: ['electronics']
    },
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    stackable: true,
    priority: 2,
    isActive: true,
    clientId: 'client_2',
    tags: ['electronics']
  },
  {
    id: 'PREMIUM10',
    name: 'Premium Customer 10% Off',
    description: '10% off for premium customers',
    type: 'percentage',
    value: 10,
    applicability: 'cart',
    conditions: {
      userSegment: 'premium'
    },
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    stackable: true,
    priority: 2,
    isActive: true,
    clientId: 'client_2',
    tags: ['premium']
  },
  {
    id: 'TIERED_DISCOUNT',
    name: 'Tiered Pricing',
    description: 'Buy more, save more',
    type: 'tiered',
    value: 0,
    applicability: 'product',
    conditions: {
      productIds: ['product_1', 'product_2']
    },
    rule_json: {
      conditions: [
        { minCartValue: 0 }
      ],
      actions: [
        { 
          type: 'tiered', 
          value: 0,
          tiers: [
            { quantity: 1, price: 500 },
            { quantity: 3, price: 450 },
            { quantity: 5, price: 400 }
          ],
          targetProductIds: ['product_1', 'product_2']
        }
      ]
    },
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    stackable: false,
    priority: 3,
    isActive: true,
    clientId: 'client_1',
    tags: ['tiered']
  }
];

export default mockPromotions;