// So we can (client-side) link to specific animal pages
import { Link } from "react-router-dom";
// So we can use state variables
import { useState } from 'react';
// Zod parsed Species type
import type { Animal } from './speciesSchema.ts';

// How they're displayed in frontend checkboxes: JSON
const TAG_FIELDS = {
    'TRIANGLE-EARED': 'triangle_eared',
    'CIRCLE-EARED': 'circle_eared',
    'BIG-EARED': 'big_eared',
    'BIG-TAIL': 'big_tail',
    'WEIRD': 'weird',
} as const;

type Tag = keyof typeof TAG_FIELDS;

// How they're displayed in frontend dropdown: JSON
const CON_FIELDS = {
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

type Conservation = keyof typeof CON_FIELDS;

// The table component receives the full list of animal records
interface ListProps {
    data: Animal[];
}

// Type guards used when iterating through the tag and conservation maps from the
// dataset, so TypeScript can narrow the keys to known union types.
function isTag(value: string): value is Tag {
    return Object.prototype.hasOwnProperty.call(TAG_FIELDS, value);
}

function isCons(value: string): value is Conservation {
    return Object.prototype.hasOwnProperty.call(CON_FIELDS, value)
}

// Converts the compact IUCN abbreviation from the dataset into a readable label
// for display in the table
function abbToWord(word: string | null): string {
     switch (word) {
        case 'EX':
            return 'Extinct';
        case 'EW':
            return 'Extinct in the Wild';
        case 'CR':
            return 'Critically Endangered';
        case 'EN':
            return 'Endangered';
        case 'VU':
            return 'Vulnerable';
        case 'NT':
            return 'Near Threatened';
        case 'LC':
            return 'Least Concern';
        case 'CD':
            return 'Conservation Dependent';
        case 'DD':
            return 'Data Deficient';
        case 'NE':
            return 'Not Evaluated';
        default:
            return 'N/A';
    }
}

export default function JsonDataDisplay({data}: ListProps) {
    // What the user is searching for
    const [searchTerm, setSearchTerm] = useState('');
    // Tags the user has selected
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    // Conservation level the user wants
    const [chosenConservation, setConservation] = useState<Conservation>();

    // We then filter the table based on the above variables
    const filteredData = data.filter(item => {
        // Filter by search
        const matchesSearch = item.species_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genus_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.common_name !== null && item.common_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.genus_common !== null && item.genus_common.toLowerCase().includes(searchTerm.toLowerCase()));

        // Filter by tag
        const matchesTags = selectedTags.every(tag => item[TAG_FIELDS[tag]] === 1);

        // Filter by conservation
        const matchesConservation = chosenConservation === undefined || item.conservation_status === CON_FIELDS[chosenConservation];

        // Combine each filter
        return matchesSearch && matchesTags && matchesConservation;
    });
    
    return (
        <div className="species-table-wrapper">
            {/* Search bar */}
            <label className="species-search">
                <span>Search species</span>
                <input
                type="text"
                placeholder="Search by common, species, or genus name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </label>
            {/* Checkboxes - Tags */}
            <fieldset className="species-filters">
                <legend>Filter by tags</legend>
                {Object.keys(TAG_FIELDS).filter(isTag).map(tag => (
                    <label key={tag}>
                        <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => {
                                setSelectedTags(currentTags => currentTags.includes(tag)
                                    ? currentTags.filter(currentTag => currentTag !== tag)
                                    : [...currentTags, tag]);
                            }}
                        />
                        {tag}
                    </label>
                ))}
            </fieldset>
            {/* Dropdown Menu - Conservation status */}
            <select
                value={chosenConservation ?? ""}
                onChange={(e) => setConservation(isCons(e.target.value) ? e.target.value : undefined)}
            >
                <option value="">All Animals</option>
                {Object.keys(CON_FIELDS).filter(isCons).map(con => (
                    <option key={con} value={con}>
                        {con}
                    </option>
                ))}
            </select>
            {/* Table that shows the animals */}
            <table className="species-table">
                {/* Caption */}
                <caption>Species Listed here</caption>
                {/* Head */}
                <thead>
                    <tr>
                        <th scope="col">Common Name</th>
                        <th scope="col">Species Name</th>
                        <th scope="col">Genus Name</th>
                        <th scope="col">Genus Common Name</th>
                        <th scope="col">Conservation Status</th>
                    </tr>
                </thead>
                {/* Body */}
                <tbody>
                    {filteredData.length === 0 ? (
                        // Nothing in the filtered dataset
                        <tr>
                            <td className="species-empty" colSpan={3}>No results found.</td>
                        </tr>
                    ) : filteredData.map((animal) => (
                        // Else: stuff in the filtered dataset
                            <tr key={`${animal.genus_name}-${animal.species_name}`}>
                                {/* Common name is a clickable link, the rest aren't */}
                                <td>
                                    <Link to={`/directory/${encodeURIComponent(animal.genus_name)}/${encodeURIComponent(animal.species_name)}`}>
                                        {animal.common_name ?? '—'}
                                    </Link>
                                </td>
                                <td>{animal.species_name}</td>
                                <td>{animal.genus_name}</td>
                                <td>{animal.genus_common}</td>
                                <td>{abbToWord(animal.conservation_status)}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}