import type { AppliedPromotion } from '../types/promotion';
import mockPromotions from './mockPromotions';

const mockAppliedPromotions: AppliedPromotion[] = [
  {
    id: 'applied_1',
    promotionId: 'SUMMER10',
    orderId: 'order_1',
    clientId: 'client_1',
    cartSnapshot: {
      items: [
        { id: 'item_1', name: 'Smartphone', price: 15000, quantity: 1, category: 'electronics' },
        { id: 'item_2', name: 'Headphones', price: 2000, quantity: 1, category: 'electronics' }
      ],
      total: 17000
    },
    finalDiscountAmount: 1700,
    evaluatedAt: '2025-06-15T10:30:00Z',
    promotion: mockPromotions.find(p => p.id === 'SUMMER10')
  },
  {
    id: 'applied_2',
    promotionId: 'FESTIVE500',
    orderId: 'order_2',
    clientId: 'client_1',
    cartSnapshot: {
      items: [
        { id: 'item_3', name: 'T-shirt', price: 1000, quantity: 2, category: 'fashion' },
        { id: 'item_4', name: 'Jeans', price: 2000, quantity: 1, category: 'fashion' }
      ],
      total: 4000
    },
    finalDiscountAmount: 500,
    evaluatedAt: '2025-10-05T14:20:00Z',
    promotion: mockPromotions.find(p => p.id === 'FESTIVE500')
  },
  {
    id: 'applied_3',
    promotionId: 'BOGO_TSHIRT',
    orderId: 'order_3',
    clientId: 'client_1',
    cartSnapshot: {
      items: [
        { id: 'tshirt_1', name: 'Blue T-shirt', price: 800, quantity: 2, category: 'fashion' }
      ],
      total: 1600
    },
    finalDiscountAmount: 800,
    evaluatedAt: '2025-07-10T09:15:00Z',
    promotion: mockPromotions.find(p => p.id === 'BOGO_TSHIRT')
  },
  {
    id: 'applied_4',
    promotionId: 'NEWUSER20',
    orderId: 'order_4',
    clientId: 'client_1',
    cartSnapshot: {
      items: [
        { id: 'item_5', name: 'Watch', price: 5000, quantity: 1, category: 'accessories' },
        { id: 'item_6', name: 'Wallet', price: 1000, quantity: 1, category: 'accessories' }
      ],
      total: 6000,
      userType: 'new'
    },
    finalDiscountAmount: 1200,
    evaluatedAt: '2025-03-20T16:45:00Z',
    promotion: mockPromotions.find(p => p.id === 'NEWUSER20')
  },
  {
    id: 'applied_5',
    promotionId: 'ELECTRONICS15',
    orderId: 'order_5',
    clientId: 'client_2',
    cartSnapshot: {
      items: [
        { id: 'item_7', name: 'Laptop', price: 50000, quantity: 1, category: 'electronics' },
        { id: 'item_8', name: 'Mouse', price: 1000, quantity: 1, category: 'electronics' }
      ],
      total: 51000
    },
    finalDiscountAmount: 7650,
    evaluatedAt: '2025-09-12T11:30:00Z',
    promotion: mockPromotions.find(p => p.id === 'ELECTRONICS15')
  }
];

export default mockAppliedPromotions;