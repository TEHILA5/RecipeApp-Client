// ===============================================
// Conversion API - Sweet&Treat
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';

export interface ConversionDto {
  id: number;
  ingredient1Name: string;
  ingredient2Name: string;
  conversionRatio: number;
  isBidirectional: boolean;
}

// GET: api/Conversion - כל ההמרות
export const getAllConversions = async (): Promise<ConversionDto[]> => {
  try {
    const response = await axiosInstance.get<ConversionDto[]>('/conversion');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Conversion/:id
export const getConversionById = async (id: number): Promise<ConversionDto> => {
  try {
    const response = await axiosInstance.get<ConversionDto>(`/conversion/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Conversion/find?ingredientId1=1&ingredientId2=2
export const findConversion = async (
  ingredientId1: number,
  ingredientId2: number
): Promise<ConversionDto | null> => {
  try {
    const response = await axiosInstance.get<ConversionDto>('/conversion/find', {
      params: { ingredientId1, ingredientId2 },
    });
    return response.data;
  } catch {
    return null; // 404 = אין המרה בין הרכיבים
  }
};

/**
 * מקבל שם מרכיב ומחזיר את כל החלופות שלו לפי טבלת ההמרות
 * לדוגמה: "honey" → ["sugar", "maple syrup"]
 */
export const getAlternativesForIngredient = (
  ingredientName: string,
  allConversions: ConversionDto[]
): { alternativeName: string; ratio: number }[] => {
  const name = ingredientName.toLowerCase();
  const results: { alternativeName: string; ratio: number }[] = [];

  for (const conv of allConversions) {
    const ing1 = conv.ingredient1Name?.toLowerCase();
    const ing2 = conv.ingredient2Name?.toLowerCase();

    if (ing1 === name) {
      results.push({ alternativeName: conv.ingredient2Name, ratio: conv.conversionRatio });
    } else if (ing2 === name && conv.isBidirectional) {
      results.push({
        alternativeName: conv.ingredient1Name,
        ratio: conv.conversionRatio !== 0 ? 1 / conv.conversionRatio : 1,
      });
    }
  }

  return results;
};

export default { getAllConversions, getConversionById, findConversion, getAlternativesForIngredient };