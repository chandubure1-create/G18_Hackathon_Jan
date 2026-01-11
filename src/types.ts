
export enum MaterialType {
  PLASTIC_PET = 'PET Plastic',
  PLASTIC_HDPE = 'HDPE Plastic',
  PLASTIC_LDPE = 'LDPE Plastic',
  METAL_ALUMINUM = 'Aluminum',
  METAL_COPPER = 'Copper',
  METAL_STEEL = 'Steel',
  METAL_IRON = 'Iron',
  PAPER_CARDBOARD = 'Paper/Cardboard',
  GLASS = 'Glass',
  TEXTILES = 'Textiles',
  ELECTRONICS = 'Electronics (E-Waste)'
}

export enum QualityGrade {
  GRADE_A = 'Grade A (Clean)',
  GRADE_B = 'Grade B (Mixed)',
  GRADE_C = 'Grade C (Contaminated)'
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  materialType: MaterialType;
  quantity: number;
  unit: 'tons' | 'kg' | 'bales';
  grade: QualityGrade;
  location: string;
  distance?: number;
  pricePerUnit: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  isVerified: boolean;
  tradeType?: 'Buy' | 'Sell';
}

export interface User {
  id: string;
  name: string;
  company: string;
  role: 'buyer' | 'seller' | 'both';
  rating: number;
  dealsCompleted: number;
  location: string;
  isVerified: boolean;
  wallet_balance: number;
  address?: string;
  pincode?: string;
  phone?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface Dealer {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
}

// Fix: Added missing MarketRate interface used in mockData
export interface MarketRate {
  material: MaterialType;
  price: number;
  change: number;
}
