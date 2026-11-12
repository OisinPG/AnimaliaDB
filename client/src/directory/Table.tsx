import { Link } from "react-router-dom";
import { useState } from 'react';

const TAG_FIELDS = {
    'TRIANGLE-EARED': 'triangle_eared',
    'CIRCLE-EARED': 'circle_eared',
    'BIG-EARED': 'big_eared',
    'BIG-TAIL': 'big_tail',
    'WEIRD': 'weird',
} as const;

type Tag = keyof typeof TAG_FIELDS;

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

export type Animal = {
    species_name: string;
    genus_name: string;
    common_name: string | null;
    genus_common: string | null;
    conservation_status: string | null;
} & Record<(typeof TAG_FIELDS)[Tag], 0 | 1>;

interface ListProps {
    data: Animal[];
}

function isTag(value: string): value is Tag {
    return Object.prototype.hasOwnProperty.call(TAG_FIELDS, value);
}

function isCons(value: string): value is Conservation {
    return Object.prototype.hasOwnProperty.call(CON_FIELDS, value)
}

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [chosenConservation, setConservation] = useState<Conservation>();

    const filteredData = data.filter(item => {
        const matchesSearch = item.species_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genus_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.common_name !== null && item.common_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.genus_common !== null && item.genus_common.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTags = selectedTags.every(tag => item[TAG_FIELDS[tag]] === 1);

        const matchesConservation = chosenConservation === undefined || item.conservation_status === CON_FIELDS[chosenConservation];

        return matchesSearch && matchesTags && matchesConservation;
    });
    
    return (
        <div className="species-table-wrapper">
            <label className="species-search">
                <span>Search species</span>
                <input
                type="text"
                placeholder="Search by common, species, or genus name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </label>
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
            <table className="species-table">
                <caption>Species Listed here</caption>
                <thead>
                    <tr>
                        <th scope="col">Common Name</th>
                        <th scope="col">Species Name</th>
                        <th scope="col">Genus Name</th>
                        <th scope="col">Genus Common Name</th>
                        <th scope="col">Conservation Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td className="species-empty" colSpan={3}>No results found.</td>
                        </tr>
                    ) : filteredData.map((animal) => (
                            <tr key={`${animal.genus_name}-${animal.species_name}`}>
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