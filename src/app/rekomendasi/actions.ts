"use server";

import { personalizedGameRecommendations } from "@/ai/flows/personalized-game-recommendations";
import { z } from "zod";

const recommendationSchema = z.object({
  rentalHistory: z.string().min(10, { message: "Riwayat rental harus diisi, minimal 10 karakter." }),
  gamePreferences: z.string().min(10, { message: "Preferensi game harus diisi, minimal 10 karakter." }),
});

export async function getRecommendations(
  prevState: any,
  formData: FormData
) {
  const validatedFields = recommendationSchema.safeParse({
    rentalHistory: formData.get("rentalHistory"),
    gamePreferences: formData.get("gamePreferences"),
  });

  if (!validatedFields.success) {
    return {
      message: "Input tidak valid.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await personalizedGameRecommendations({
      rentalHistory: validatedFields.data.rentalHistory,
      gamePreferences: validatedFields.data.gamePreferences,
    });
    return {
      message: "success",
      recommendations: result.recommendedGames,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Terjadi kesalahan saat menghasilkan rekomendasi. Silakan coba lagi.",
    };
  }
}
