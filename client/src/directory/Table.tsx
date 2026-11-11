import { Link } from "react-router-dom";
import { useState } from 'react';

const TAG_FIELDS = {
    'TRIANGLE-EARED': 'triangle_eared',
    'CIRCLE-EARED': 'circle_eared',
    'BIG-EARED': 'big_eared',
    'BIG-TAIL': 'big_tail',
    WEIRD: 'weird',
} as const;

type Tag = keyof typeof TAG_FIELDS;

export type Animal = {
    species_name: string;
    genus_name: string;
    common_name: string | null;
} & Record<(typeof TAG_FIELDS)[Tag], 0 | 1>;

interface ListProps {
    data: Animal[];
}

function isTag(value: string): value is Tag {
    return Object.prototype.hasOwnProperty.call(TAG_FIELDS, value);
}

export default function JsonDataDisplay({data}: ListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const filteredData = data.filter(item => {
        const matchesSearch = item.species_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genus_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.common_name !== null && item.common_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTags = selectedTags.every(tag => item[TAG_FIELDS[tag]] === 1);

        return matchesSearch && matchesTags;
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
            <table className="species-table">
                <caption>Species Listed here</caption>
                <thead>
                    <tr>
                        <th scope="col">Common Name</th>
                        <th scope="col">Species Name</th>
                        <th scope="col">Genus Name</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td className="species-empty" colSpan={3}>No results found.</td>
                        </tr>
                    ) : filteredData.map((animal) => (
                            <tr key={animal.species_name}>
                                <td>
                                    <Link to={`/directory/${animal.species_name}`}>
                                        {animal.common_name ?? '—'}
                                    </Link>
                                </td>
                                <td>{animal.species_name}</td>
                                <td>{animal.genus_name}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}