// State variables
import { useState, useEffect } from 'react';
// So we can use parameters when making an API call
import { useParams } from 'react-router-dom';
// Client-side links
import { Link } from "react-router-dom";
// So that we could do the isAnimal easier
import { z } from 'zod';
// Header at the top
import Header from '../../Header.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import '../../App.css';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './AnimalPage.css';
// Animal information
import AnimalInfo from './info.tsx';

// REACT_APP_API_URL from .env
declare const process: { env: { REACT_APP_API_URL?: string } };

// Schema for the API response returned for one animal record
// This validates the exact shape of the data before it's used on the page and
// ensures fields like the tag booleans and nullable metadata are consistent
const AnimalSchema = z.object({
    Species_Name: z.string(),
    Genus_Name: z.string(),
    Common_Name: z.string(),
    triangle_eared: z.union([z.literal(0), z.literal(1)]),
    circle_eared: z.union([z.literal(0), z.literal(1)]),
    big_eared: z.union([z.literal(0), z.literal(1)]),
    big_tail: z.union([z.literal(0), z.literal(1)]),
    weird: z.union([z.literal(0), z.literal(1)]),
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

// Infer the typescript shape from the zod schema so the page state and props
// are strongly typed without duplicating the structure manually
type Animal = z.infer<typeof AnimalSchema>;

// Runtime check used before accepting an API response as an animal record
const isAnimal = (value: unknown): value is Animal => AnimalSchema.safeParse(value).success;

export default function AnimalPage() {
    // Parameters for api call
    const { genus, species } = useParams<{ genus: string; species: string }>();
    // Animal we're showing off
    const [animal, setAnimal] = useState<Animal>();
    // If we're loading
    const [loading, setLoading] = useState(true);
    // If there's been an error
    const [error, setError] = useState<string | null>(null);

    // Wait till the component is loaded
    useEffect(() => {
        // Lets us cancel an API call
        const controller = new AbortController();

        setAnimal(undefined);
        setError(null);
        setLoading(true);

        // Load information of the animal we're looking at through GET /species/:genus/:species
        const loadAnimal = async () => {
            if (!genus || !species) {
                setError('Missing genus or species name.');
                setLoading(false);
                return;
            }

            const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
            try {
                const response = await fetch(`${apiUrl}/species/${encodeURIComponent(genus)}/${encodeURIComponent(species)}`, {
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`Request Failed: ${response.status}`);

                const rows: unknown = await response.json();
                if (!Array.isArray(rows) || !rows.every(isAnimal)) {
                    throw new Error('The species/:genus/:species endpoint did not return a list');
                }

                if (rows.length === 0) throw new Error('Species not found.');
                setAnimal(rows[0]);
            } catch (cause) {
                // We fail to get the animal
                if (controller.signal.aborted) return;
                setError (cause instanceof Error ? cause.message : 'An unexpected error occurred.');
            } finally {
                // We're not loading anymore
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        void loadAnimal();

        return () => controller.abort();
    }, [genus, species]);

    return (
        <div className="App">
            <Header />
            <main>
                {/* Back to directory */}
                <Link className="directory-back-link" to="/directory">Back to directory</Link>
                {/* Loading */}
                {loading && <p className="directory-message" role="status">Loading Animal...</p>}
                {/* Error */}
                {error && <p className="directory-message is-error" role="alert">Unable to load species: {error}</p>}
                {/* Animal Info */}
                {!loading && !error && animal && <AnimalInfo {...animal} Genus_Common={animal.Genus_Common ?? ''} />}
            </main>
        </div>
    );
}
