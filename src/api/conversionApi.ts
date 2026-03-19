import axiosInstance, { handleApiError } from './axiosConfig';

export interface ConversionDto {
  id: number;
  ingredient1Name: string;
  ingredient2Name: string;
  conversionRatio: number;
  isBidirectional: boolean;
}

export const getAllConversions = async (): Promise<ConversionDto[]> => {
  try {
    const res = await axiosInstance.get<ConversionDto[]>('/conversion');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getConversionById = async (id: number): Promise<ConversionDto> => {
  try {
    const res = await axiosInstance.get<ConversionDto>(`/conversion/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const findConversion = async (
  ingredientId1: number,
  ingredientId2: number
): Promise<ConversionDto | null> => {
  try {
    const res = await axiosInstance.get<ConversionDto>('/conversion/find', {
      params: { ingredientId1, ingredientId2 },
    });
    return res.data;
  } catch {
    return null;
  }
};

export const getAlternativesForIngredient = (
  ingredientName: string,
  allConversions: ConversionDto[]
): { alternativeName: string; ratio: number }[] => {
  const name = ingredientName.toLowerCase();

  return allConversions.flatMap((conv) => {
    const ing1 = conv.ingredient1Name?.toLowerCase();
    const ing2 = conv.ingredient2Name?.toLowerCase();

    if (ing1 === name) {
      return [{ alternativeName: conv.ingredient2Name, ratio: conv.conversionRatio }];
    }
    if (ing2 === name && conv.isBidirectional) {
      return [{ alternativeName: conv.ingredient1Name, ratio: conv.conversionRatio !== 0 ? 1 / conv.conversionRatio : 1 }];
    }
    return [];
  });
};

export default { getAllConversions, getConversionById, findConversion, getAlternativesForIngredient };