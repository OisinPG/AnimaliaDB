import { Link } from 'react-router-dom';
import { ViewTransition } from 'react';

const MAX_DESCRIPTION_LENGTH = 240;

interface Animal {
    Species_Name: string;
    Genus_Name: string;
    Common_Name: string;
    Photo_URL: string | null;
    Description: string | null;
}

interface RandomAnimalCardProps {
    animal: Animal;
}

function getShortDescription(description: string | null): string {
    if (!description) return 'No description available.';
    if (description.length <= MAX_DESCRIPTION_LENGTH) return description;
    return `${description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`;
}

export default function RandomAnimalCard({ animal }: RandomAnimalCardProps) {
    return (
        <ViewTransition>
            <article className="random-animal-card" aria-live="polite">
                {animal.Photo_URL ? (
                    <img
                        className="random-animal-image"
                        src={animal.Photo_URL}
                        alt={animal.Common_Name}
                    />
                ) : (
                    <div className="random-animal-image random-animal-image-placeholder" role="img" aria-label="No photo available">
                        No photo available
                    </div>
                )}
                <div className="random-animal-details">
                    <h2>
                        <Link to={`/directory/${encodeURIComponent(animal.Genus_Name)}/${encodeURIComponent(animal.Species_Name)}`}>
                            {animal.Common_Name}
                        </Link>
                    </h2>
                    <p>{getShortDescription(animal.Description)}</p>
                </div>
            </article>
        </ViewTransition>
    );
}
