import { z } from 'zod';

// Validates one species row returned by the directory endpoint
const SpeciesSchema = z.object({
    species_name: z.string(),
    genus_name: z.string(),
    common_name: z.string().nullable(),
    genus_common: z.string().nullable(),
    conservation_status: z.string().nullable(),
    triangle_eared: z.union([z.literal(0), z.literal(1)]),
    circle_eared: z.union([z.literal(0), z.literal(1)]),
    big_eared: z.union([z.literal(0), z.literal(1)]),
    big_tail: z.union([z.literal(0), z.literal(1)]),
    weird: z.union([z.literal(0), z.literal(1)]),
});

// Validates the list returned by the directory endpoint
export const SpeciesListSchema = z.array(SpeciesSchema);

// Derives the directory row type directly from its runtime schema
export type Animal = z.infer<typeof SpeciesSchema>;
