import type { Client } from '../types/promotion';

const mockClients: Client[] = [
  {
    id: 'client_1',
    name: 'Fashion Store',
    domain: 'fashionstore.com',
    apiKey: 'api_key_1',
    metadata: {
      industry: 'Fashion',
      plan: 'Premium',
      contactEmail: 'admin@fashionstore.com'
    }
  },
  {
    id: 'client_2',
    name: 'Electronics Mart',
    domain: 'electronicsmart.com',
    apiKey: 'api_key_2',
    metadata: {
      industry: 'Electronics',
      plan: 'Standard',
      contactEmail: 'admin@electronicsmart.com'
    }
  },
  {
    id: 'client_3',
    name: 'Grocery World',
    domain: 'groceryworld.com',
    apiKey: 'api_key_3',
    metadata: {
      industry: 'Grocery',
      plan: 'Basic',
      contactEmail: 'admin@groceryworld.com'
    }
  }
];

export default mockClients;