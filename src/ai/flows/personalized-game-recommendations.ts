// A personalized game recommendation AI agent.
//
// - personalizedGameRecommendations - A function that handles the game recommendation process.
// - PersonalizedGameRecommendationsInput - The input type for the personalizedGameRecommendations function.
// - PersonalizedGameRecommendationsOutput - The return type for the personalizedGameRecommendations function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedGameRecommendationsInputSchema = z.object({
  rentalHistory: z
    .string()
    .describe('The user historical game rental data.'),
  gamePreferences: z.string().describe('The user game preferences.'),
});

export type PersonalizedGameRecommendationsInput = z.infer<
  typeof PersonalizedGameRecommendationsInputSchema
>;

const PersonalizedGameRecommendationsOutputSchema = z.object({
  recommendedGames: z
    .string()
    .describe('A list of recommended games based on rental history and preferences.'),
});

export type PersonalizedGameRecommendationsOutput = z.infer<
  typeof PersonalizedGameRecommendationsOutputSchema
>;

export async function personalizedGameRecommendations(
  input: PersonalizedGameRecommendationsInput
): Promise<PersonalizedGameRecommendationsOutput> {
  return personalizedGameRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedGameRecommendationsPrompt',
  input: {schema: PersonalizedGameRecommendationsInputSchema},
  output: {schema: PersonalizedGameRecommendationsOutputSchema},
  prompt: `You are an expert game recommender. Based on the user's rental history and stated preferences, recommend some games they might enjoy.

Rental History: {{{rentalHistory}}}
Preferences: {{{gamePreferences}}}

Recommend games in a numbered list.`,
});

const personalizedGameRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedGameRecommendationsFlow',
    inputSchema: PersonalizedGameRecommendationsInputSchema,
    outputSchema: PersonalizedGameRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
