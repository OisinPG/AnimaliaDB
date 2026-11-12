// Shape of a single animal record used by the detail view
// The tag fields are stored as 0/1 flags rather than booleans to match the data
interface Animal {
    Species_Name: string;
    Genus_Name: string;
    Common_Name: string;
    triangle_eared: 0 | 1;
    circle_eared: 0 | 1;
    big_eared: 0 | 1;
    big_tail: 0 | 1;
    weird: 0 | 1;
    Photo_URL: string | null;
    Size: string | null;
    Population: number | null;
    Conservation_Status: string | null;
    Description: string | null;
    Genus_Common: string;
    Family_Name: string;
    Family_Common: string;
    Order_Name: string;
    Class_Name: string;
    Phylum_Name: string;
    Kingdom_Name: string;
}

// Each tag key is mapped to the user-facing label shown in the detail page
const ANIMAL_TAGS = [
    { field: 'triangle_eared', label: 'Triangle-eared' },
    { field: 'circle_eared', label: 'Circle-eared' },
    { field: 'big_eared', label: 'Big-eared' },
    { field: 'big_tail', label: 'Big-tailed' },
    { field: 'weird', label: 'Weird' },
] as const;

// Converts the compact IUCN abbreviation from the dataset into a readable label
function abbToWord(word: string | null): string {
     switch (word) {
        case 'EX':
            return 'Extinct [EX]';
        case 'EW':
            return 'Extinct in the Wild [EW]';
        case 'CR':
            return 'Threatened - Critically Endangered [CR]';
        case 'EN':
            return 'Threatened - Endangered [EN]';
        case 'VU':
            return 'Threatened - Vulnerable [VU]';
        case 'NT':
            return 'Lower Risk - Near Threatened [NT]';
        case 'LC':
            return 'Lower Risk - Least Concern [LC]';
        case 'CD':
            return 'Lower Risk - Conservation Dependent [CD]';
        case 'DD':
            return 'Other - Data Deficient [DD]';
        case 'NE':
            return 'Other - Not Evaluated [NE]';
        default:
            return 'N/A';
    }
}

export default function AnimalInfo(data: Animal) {
    // Tags that the given animal has
    const tags = ANIMAL_TAGS.filter(({ field }) => data[field] === 1);

    return (
        <article className="animal-detail">
            {/* Animal tags */}
            {tags.length > 0 && (
                <ul className="animal-detail-tags" aria-label="Species tags">
                    {tags.map(({ field, label }) => (
                        <li key={field} className="animal-tag">{label}</li>
                    ))}
                </ul>
            )}
            {/* Animal Title */}
            <h1 className="animal-detail-title">{data.Common_Name}</h1>
            {/* Animal Image */}
            <img className="animal-detail-image" src={data.Photo_URL ?? undefined} alt={data.Common_Name} />
            {/* Animal Information */}
            <ul className="animal-detail-facts">
                <li><span>Common Name</span><strong>{data.Common_Name}</strong></li>
                <li><span>Species Name</span><strong>{data.Species_Name}</strong></li>
                <li><span>Genus Name</span><strong>{data.Genus_Name}</strong></li>
                <li><span>Genus Common Name</span><strong>{data.Genus_Common}</strong></li>
                <li><span>Family Name</span><strong>{data.Family_Name}</strong></li>
                <li><span>Family Common Name</span><strong>{data.Family_Common}</strong></li>

                <li><span>Size</span><strong>{data.Size ?? '—'}</strong></li>
                <li><span>Population</span><strong>{data.Population ?? '—'}</strong></li>
                <li><span>Conservation Status</span><strong>{abbToWord(data.Conservation_Status)}</strong></li>

                <li><span>Order Name</span><strong>{data.Order_Name}</strong></li>
                <li><span>Class Name</span><strong>{data.Class_Name}</strong></li>
                <li><span>Phylum Name</span><strong>{data.Phylum_Name}</strong></li>
                <li><span>Kingdom Name</span><strong>{data.Kingdom_Name}</strong></li>
            </ul>
            {/* Animal Description */}
            <p className="animal-detail-description">{data.Description}</p>
        </article>
    );
}