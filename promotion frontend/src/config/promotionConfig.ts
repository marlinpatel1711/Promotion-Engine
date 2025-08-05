export type PromotionType = 'percentage' | 'fixed' | 'bogo' | 'custom';

export interface PromotionRule {
  id: string;
  name: string;
  description: string;
  configFields: Array<{
    key: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'select' | 'boolean';
    options?: string[];
    required?: boolean;
  }>;
}

export interface PromotionConfig {
  types: PromotionType[];
  rules: PromotionRule[];
  eligibility: string[];
}

const promotionConfig: PromotionConfig = {
  types: ['percentage', 'fixed', 'bogo', 'custom'],
  rules: [
    {
      id: 'percentage',
      name: 'Percentage Discount',
      description: 'Discount by a percentage off the total.',
      configFields: [
        { key: 'value', label: 'Discount (%)', type: 'number', required: true },
      ],
    },
    {
      id: 'fixed',
      name: 'Fixed Amount Discount',
      description: 'Discount by a fixed amount.',
      configFields: [
        { key: 'value', label: 'Discount Amount', type: 'number', required: true },
      ],
    },
    {
      id: 'bogo',
      name: 'Buy One Get One',
      description: 'Buy one item, get another free or discounted.',
      configFields: [
        { key: 'buyQty', label: 'Buy Quantity', type: 'number', required: true },
        { key: 'getQty', label: 'Get Quantity', type: 'number', required: true },
      ],
    },
    {
      id: 'custom',
      name: 'Custom Rule',
      description: 'Custom promotion logic.',
      configFields: [],
    },
  ],
  eligibility: ['all_users', 'first_time', 'loyalty', 'custom'],
};

export default promotionConfig; 