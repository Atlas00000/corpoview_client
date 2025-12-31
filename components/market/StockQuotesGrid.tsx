'use client'

import { StaggerContainer, StaggerItem } from '@/components/effects'
import StockQuoteItem from './StockQuoteItem'

const TOP_STOCKS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'JPM', name: 'JPMorgan' },
  { symbol: 'V', name: 'Visa' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
]

export default function StockQuotesGrid() {
  return (
    <div className="relative">
      <StaggerContainer>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {TOP_STOCKS.map((stock, index) => (
            <StaggerItem key={stock.symbol}>
              <StockQuoteItem
                symbol={stock.symbol}
                name={stock.name}
                index={index}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </div>
  )
}

