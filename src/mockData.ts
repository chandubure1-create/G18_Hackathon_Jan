
import { MaterialType, QualityGrade, Listing, User, MarketRate } from './types';

// Fix: Added missing role and wallet_balance properties to MOCK_USER
export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  company: 'Rivera Recycling Solutions',
  role: 'both',
  rating: 4.8,
  dealsCompleted: 124,
  location: 'Chicago, IL',
  isVerified: true,
  wallet_balance: 50000
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    sellerId: 's1',
    sellerName: 'GreenCycle Corp',
    materialType: MaterialType.PLASTIC_PET,
    quantity: 5,
    unit: 'tons',
    grade: QualityGrade.GRADE_A,
    location: 'Detroit, MI',
    distance: 280,
    pricePerUnit: 450,
    description: 'Baled PET bottles, clear. Minimal contamination.',
    imageUrl: 'https://picsum.photos/seed/plastic1/600/400',
    createdAt: new Date().toISOString(),
    isVerified: true
  },
  {
    id: 'l2',
    sellerId: 's2',
    sellerName: 'MetalWorks Inc',
    materialType: MaterialType.METAL_ALUMINUM,
    quantity: 1200,
    unit: 'kg',
    grade: QualityGrade.GRADE_A,
    location: 'Gary, IN',
    distance: 45,
    pricePerUnit: 1.25,
    description: 'Clean aluminum extrusion scraps.',
    imageUrl: 'https://picsum.photos/seed/metal1/600/400',
    createdAt: new Date().toISOString(),
    isVerified: true
  },
  {
    id: 'l3',
    sellerId: 's3',
    sellerName: 'Urban Waste Co',
    materialType: MaterialType.PAPER_CARDBOARD,
    quantity: 12,
    unit: 'bales',
    grade: QualityGrade.GRADE_B,
    location: 'Joliet, IL',
    distance: 60,
    pricePerUnit: 85,
    description: 'Mixed cardboard and office paper. Compressed.',
    imageUrl: 'https://picsum.photos/seed/paper1/600/400',
    createdAt: new Date().toISOString(),
    isVerified: false
  }
];

export const MOCK_MARKET_RATES: MarketRate[] = [
  { material: MaterialType.PLASTIC_PET, price: 420, change: 2.5 },
  { material: MaterialType.METAL_ALUMINUM, price: 1150, change: -1.2 },
  { material: MaterialType.METAL_COPPER, price: 8200, change: 0.8 },
  { material: MaterialType.PAPER_CARDBOARD, price: 95, change: 5.4 }
];
