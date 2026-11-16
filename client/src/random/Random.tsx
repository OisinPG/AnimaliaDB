// Header for top of page
import Header from '../Header.tsx';
// Client-side links (as opposed to server-side <a>)
import { Link } from "react-router-dom";
// So we can use state variables
import { useEffect, useState } from 'react';
import { startTransition } from 'react';
import { z } from 'zod';
import RandomAnimalCard from './RandomAnimalCard.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './Random.css';

const SPIN_DURATION_MS = 5000;
const IMAGE_CYCLE_INTERVAL_MS = 100;

// How they're displayed in frontend checkboxes: JSON
const TAG_FIELDS = {
    'TRIANGLE-EARED': 'te',
    'CIRCLE-EARED': 'ce',
    'BIG-EARED': 'be',
    'BIG-TAIL': 'bt',
    'WEIRD': 'w',
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

const RandomAnimalSchema = z.object({
    Species_Name: z.string(),
    Genus_Name: z.string(),
    Common_Name: z.string(),
    Photo_URL: z.string().nullable(),
    Description: z.string().nullable(),
});
const RandomAnimalListSchema = z.array(RandomAnimalSchema);
type Animal = z.infer<typeof RandomAnimalSchema>;

function preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = async () => {
            try {
                await image.decode();
            } catch {
                // Loading succeeded even if the browser cannot decode the image.
            }
            resolve();
        };
        // A missing photo should not prevent the remaining animals from being shown.
        image.onerror = () => resolve();
        image.src = url;
        if (image.complete) {
            void image.decode().then(resolve).catch(resolve);
        }
    });
}

// Type guards used when iterating through the tag and conservation maps from the
// dataset, so TypeScript can narrow the keys to known union types.
function isTag(value: string): value is Tag {
    return Object.prototype.hasOwnProperty.call(TAG_FIELDS, value);
}

function isCons(value: string): value is Conservation {
    return Object.prototype.hasOwnProperty.call(CON_FIELDS, value)
}

// Gets REACT_APP_API_URL from .env
declare const process: { env: { REACT_APP_API_URL?: string } };

export default function RandomPage() {
    // Tags the user has selected
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    // Conservation level the user wants
    const [chosenConservation, setConservation] = useState<Conservation>();
    // List of animals we cycle through for UX
    const [animals, setAnimals] = useState<Animal[]>([]);
    // Actual animal we show off
    const [chosenAnimal, setChosenAnimal] = useState<Animal>();
    const [loading, setLoading] = useState(false);
    const [isPreloadingImages, setIsPreloadingImages] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoadedResults, setHasLoadedResults] = useState(false);

    // Show random results at a steady cadence for a fixed-duration spin.
    useEffect(() => {
        if (!isSpinning || animals.length === 0) return;

        const pickRandomAnimal = (stopSpinning = false) => {
            startTransition(() => {
                setChosenAnimal(animals[Math.floor(Math.random() * animals.length)]);
                if (stopSpinning) setIsSpinning(false);
            });
        };
        const interval = window.setInterval(pickRandomAnimal, IMAGE_CYCLE_INTERVAL_MS);
        const timeout = window.setTimeout(() => {
            window.clearInterval(interval);
            pickRandomAnimal(true);
        }, SPIN_DURATION_MS);

        return () => {
            window.clearInterval(interval);
            window.clearTimeout(timeout);
        };
    }, [animals, isSpinning]);

    const loadAnimals = async () => {
        const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
        const params = new URLSearchParams();
        const tagCodes = selectedTags.map((tag) => TAG_FIELDS[tag]);
        if (tagCodes.length > 0) params.set('tags', tagCodes.join(','));
        if (chosenConservation) {
            params.set('conservationStatus', CON_FIELDS[chosenConservation]);
        }

        setLoading(true);
        setIsSpinning(false);
        setChosenAnimal(undefined);
        setError(null);
        setHasLoadedResults(false);
        try {
            const response = await fetch(`${apiUrl}/random?${params.toString()}`);
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);

            const result = RandomAnimalListSchema.safeParse(await response.json());
            if (!result.success) {
                throw new Error('The random endpoint returned an invalid list of species.');
            }

            // Wait for all available photos to load before beginning the animation.
            const imageUrls = result.data
                .map(({ Photo_URL }) => Photo_URL)
                .filter((url): url is string => Boolean(url));
            if (imageUrls.length > 0) {
                setIsPreloadingImages(true);
                await Promise.all(imageUrls.map(preloadImage));
                setIsPreloadingImages(false);
            }

            setAnimals(result.data);
            setHasLoadedResults(true);
            if (result.data.length === 0) {
                setChosenAnimal(undefined);
            } else {
                setChosenAnimal(result.data[0]);
                setIsSpinning(true);
            }
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'An unexpected error occurred.');
        } finally {
            setIsPreloadingImages(false);
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <Header />
            <main className="random-page">
                <Link className="directory-back-link" to="/">Back to Home</Link>
                <h1 className="directory-page-title">Random Species</h1>
                {loading && !isPreloadingImages && (
                    <p className="directory-message" role="status">Loading random species...</p>
                )}
                {isPreloadingImages && (
                    <p className="directory-message" role="status">Loading animal photos...</p>
                )}
                {isSpinning && (
                    <p className="random-spin-status" role="status">The wheel is spinning...</p>
                )}
                {error && (
                    <p className="directory-message is-error" role="alert">
                        Unable to load random species: {error}
                    </p>
                )}
                {hasLoadedResults && animals.length === 0 && !loading && (
                    <p className="directory-message" role="status">No species matched those filters.</p>
                )}
                {chosenAnimal && <RandomAnimalCard animal={chosenAnimal} />}
                <section className="random-controls" aria-label="Random species filters">
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
                    <label className="random-status-filter">
                        Conservation status
                        <select
                            value={chosenConservation ?? ""}
                            onChange={(e) => setConservation(isCons(e.target.value) ? e.target.value : undefined)}
                        >
                            <option value="">All statuses</option>
                            {Object.keys(CON_FIELDS).filter(isCons).map(con => (
                                <option key={con} value={con}>
                                    {con}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="random-spin-button"
                        type="button"
                        onClick={() => void loadAnimals()}
                        disabled={loading || isSpinning}
                    >
                        Spin the Wheel
                    </button>
                </section>
            </main>
        </div>
    );
}
