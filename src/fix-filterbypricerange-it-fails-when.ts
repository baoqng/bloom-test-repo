// bloom-deps:

function filterByPriceRange(prices: number[], minPrice: number, maxPrice: number): number[] {
  return prices.filter(price => price >= minPrice && price <= maxPrice);
}

export { filterByPriceRange };