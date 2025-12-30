
export interface PriceData {
  id: string;
  name: string;
  price: number;
  change: number;
  unit: string;
  symbol?: string;
  icon?: string;
}

export interface MarketState {
  currencies: PriceData[];
  gold: PriceData[];
  coins: PriceData[];
  lastUpdated: string;
}

export enum AssetCategory {
  CURRENCY = 'CURRENCY',
  GOLD_COIN = 'GOLD_COIN'
}
