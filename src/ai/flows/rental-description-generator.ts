'use server';

/**
 * @fileOverview AI flow for generating rental descriptions for consoles and game packages.
 *
 * - generateRentalDescription - A function to generate a concise and attractive description.
 * - RentalDescriptionInput - The input type for the generateRentalDescription function.
 * - RentalDescriptionOutput - The return type for the generateRentalDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RentalDescriptionInputSchema = z.object({
  itemType: z.enum(['console', 'gamePackage']).describe('The type of item to describe: console or game package.'),
  itemName: z.string().describe('The name of the console or game package.'),
  itemDetails: z.string().describe('Details about the console or game package.'),
});
export type RentalDescriptionInput = z.infer<typeof RentalDescriptionInputSchema>;

const RentalDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise and attractive description for the console or game package.'),
});
export type RentalDescriptionOutput = z.infer<typeof RentalDescriptionOutputSchema>;

export async function generateRentalDescription(
  input: RentalDescriptionInput
): Promise<RentalDescriptionOutput> {
  return rentalDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rentalDescriptionPrompt',
  input: {schema: RentalDescriptionInputSchema},
  output: {schema: RentalDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in rental services.

You will generate a concise and attractive description for the rental item based on the following information:

Item Type: {{{itemType}}}
Item Name: {{{itemName}}}
Item Details: {{{itemDetails}}}

Write a description that is no more than 100 words and is designed to attract users to rent the item. Focus on the key benefits and features.
`,
});

const rentalDescriptionFlow = ai.defineFlow(
  {
    name: 'rentalDescriptionFlow',
    inputSchema: RentalDescriptionInputSchema,
    outputSchema: RentalDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
