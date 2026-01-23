
export enum MaterialType {
  PAPER = 'Paper',
  CARDBOARD = 'Cardboard',
  GLASS = 'Glass (Bottles & Jars)',
  ALUMINUM = 'Aluminum Cans',
  STEEL = 'Steel Cans',
  PLASTIC = 'Plastic Bottles & Jugs (#1 & #2)',
  ELECTRONICS = 'Electronics (E-Waste)',
  BATTERIES = 'Batteries',
  OIL = 'Used Oil',
  ORGANIC = 'Organic Waste (Food/Yard)',
  PLASTIC_PET = 'PET Plastic',
  METAL_ALUMINUM = 'Aluminum Scraps',
  PAPER_CARDBOARD = 'Cardboard & Paper',
  METAL_COPPER = 'Copper Scraps',
  PLASTIC_LDPE = 'LDPE Plastic',
  METAL_STEEL = 'Steel Scraps',
  METAL_IRON = 'Iron Scraps',
  TEXTILES = 'Textile Waste'
}

export enum QualityGrade {
  GRADE_A = 'Grade A (Clean)',
  GRADE_B = 'Grade B (Mixed)',
  GRADE_C = 'Grade C (Contaminated)'
}

export interface InventoryItem {
  id: string;
  materialType: MaterialType;
  quantity: number;
  unit: string;
  grade: QualityGrade;
  pricePerUnit: number;
}

export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell';
  materialName: string;
  quantity: number;
  unit: string;
  price: number;
  grade: string;
  timestamp: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  materialType: MaterialType;
  quantity: number;
  unit: 'tons' | 'kg' | 'units';
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
  country?: string;
  totalExchanged: number;
}

// Add missing MarketRate interface
export interface MarketRate {
  material: MaterialType;
  price: number;
  change: number;
}
