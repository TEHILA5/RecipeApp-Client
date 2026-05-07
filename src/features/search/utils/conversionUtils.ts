import type { ConversionDto } from '../../../api/adminApi';

export interface AlternativeMatch {
  alternativeName: string;
  conversionRatio: number;
}

/**
 * Given an ingredient name and the full conversions list,
 * returns all known alternatives for that ingredient.
 * Pure function — no API call.
 */
export function getAlternativesForIngredient(
  ingredientName: string,
  conversions: ConversionDto[]
): AlternativeMatch[] {
  const lower = ingredientName.toLowerCase();
  const results: AlternativeMatch[] = [];

  for (const c of conversions) {
    const n1 = c.ingredient1Name?.toLowerCase();
    const n2 = c.ingredient2Name?.toLowerCase();

    if (n1 === lower) {
      results.push({ alternativeName: c.ingredient2Name, conversionRatio: c.conversionRatio });
    } else if (c.isBidirectional && n2 === lower) {
      results.push({
        alternativeName: c.ingredient1Name,
        conversionRatio: c.conversionRatio !== 0 ? +(1 / c.conversionRatio).toFixed(3) : 0,
      });
    }
  }

  return results;
}
