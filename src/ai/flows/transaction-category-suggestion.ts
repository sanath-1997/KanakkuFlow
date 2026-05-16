'use server';
/**
 * @fileOverview A Genkit flow for suggesting transaction categories and emoticons based on a description.
 *
 * - suggestTransactionCategory - A function that handles the category and emoticon suggestion process.
 * - TransactionCategorySuggestionInput - The input type for the suggestTransactionCategory function.
 * - TransactionCategorySuggestionOutput - The return type for the suggestTransactionCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionCategorySuggestionInputSchema = z.object({
  description: z.string().describe('The description of the transaction.'),
  availableCategories: z.array(z.string()).optional().describe('A list of existing category names to choose from.'),
});
export type TransactionCategorySuggestionInput = z.infer<
  typeof TransactionCategorySuggestionInputSchema
>;

const TransactionCategorySuggestionOutputSchema = z.object({
  category: z.string().describe('The suggested category for the transaction.'),
  emoticon: z.string().describe('A suitable emoticon for the suggested category.'),
});
export type TransactionCategorySuggestionOutput = z.infer<
  typeof TransactionCategorySuggestionOutputSchema
>;

export async function suggestTransactionCategory(
  input: TransactionCategorySuggestionInput
): Promise<TransactionCategorySuggestionOutput> {
  return transactionCategorySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transactionCategorySuggestionPrompt',
  input: {schema: TransactionCategorySuggestionInputSchema},
  output: {schema: TransactionCategorySuggestionOutputSchema},
  prompt: `You are an AI assistant specialized in financial transaction categorization.
Your task is to suggest a suitable category and a single, representative emoticon for a given transaction description.

If available, choose from these categories: {{#each availableCategories}}{{{this}}}, {{/each}}.
If the description doesn't fit any of those, suggest a logical new category.

Transaction Description: {{{description}}}
`,
});

const transactionCategorySuggestionFlow = ai.defineFlow(
  {
    name: 'transactionCategorySuggestionFlow',
    inputSchema: TransactionCategorySuggestionInputSchema,
    outputSchema: TransactionCategorySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);