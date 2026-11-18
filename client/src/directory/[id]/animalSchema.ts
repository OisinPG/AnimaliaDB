import { z } from 'zod';
import { TAG_SCHEMA_FIELDS } from '../../Tag_Con.ts';

// Validates the complete animal record returned by the detail endpoint
const AnimalSchema = z.object({
    Species_Name: z.string(),
    Genus_Name: z.string(),
    Common_Name: z.string(),
    ...TAG_SCHEMA_FIELDS,
    Photo_URL: z.string().nullable(),
    Size: z.string().nullable(),
    Population: z.number().nullable(),
    Conservation_Status: z.string().nullable(),
    Description: z.string().nullable(),
    Genus_Common: z.string().nullable(),
    Family_Name: z.string(),
    Family_Common: z.string(),
    Order_Name: z.string(),
    Class_Name: z.string(),
    Phylum_Name: z.string(),
    Kingdom_Name: z.string(),
});

// Validates the list returned by the detail endpoint
export const AnimalListSchema = z.array(AnimalSchema);

// Derives the detail-view animal type directly from its runtime schema
export type Animal = z.infer<typeof AnimalSchema>;
