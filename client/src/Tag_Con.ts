// EDIT TAGS AND CONSERVATION STATUS HERE

import { z } from 'zod';

// Defines each tag's API code, record property, and detail-page label.
export const TAG_FIELDS = {
    'TRIANGLE-EARED': { api: 'te', property: 'triangle_eared', label: 'Triangle-eared' },
    'CIRCLE-EARED': { api: 'ce', property: 'circle_eared', label: 'Circle-eared' },
    'BIG-EARED': { api: 'be', property: 'big_eared', label: 'Big-eared' },
    'BIG-TAIL': { api: 'bt', property: 'big_tail', label: 'Big-tailed' },
    'WEIRD': { api: 'w', property: 'weird', label: 'Weird' },
    'FLUFFY': { api: 'fl', property: 'fluffy', label: 'Fluffy' }
} as const;

// Union of the configured tag names.
export type Tag = keyof typeof TAG_FIELDS;

// Union of the configured animal-record properties for tags.
type TagProperty = (typeof TAG_FIELDS)[Tag]['property'];

// Validates the numeric flag used for each tag in API records.
const TagValueSchema = z.union([z.literal(0), z.literal(1)]);

// Zod object fields generated from the configured tag properties.
export const TAG_SCHEMA_FIELDS = Object.fromEntries(
    Object.values(TAG_FIELDS).map(({ property }) => [property, TagValueSchema])
) as Record<TagProperty, typeof TagValueSchema>;

// Maps conservation labels to the status codes used by API records.
export const CON_FIELDS = {
    'Extinct [EX]': 'EX',
    'Extinct in the Wild [EW]': 'EW',
    'Critically Endangered [CR]': 'CR',
    'Endangered [EN]': 'EN',
    'Vulnerable [VU]': 'VU',
    'Near Threatened [NT]': 'NT',
    'Conservation Dependent [CD]': 'CD',
    'Least Concern [LC]': 'LC',
    'Data Deficient [DD]': 'DD',
    'Not Evaluated [NE]': 'NE',
} as const

// Union of the configured conservation labels.
export type Conservation = keyof typeof CON_FIELDS;