// State variables
import { useState, useEffect } from 'react';
// So we can use parameters when making an API call
import { useParams } from 'react-router-dom';
// Client-side links
import { Link } from "react-router-dom";
// Header at the top
import Header from '../../Header.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import '../../App.css';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './AnimalPage.css';
// Animal information
import AnimalInfo from './info.tsx';
// Zod-parsed const and type for Animal details
import { AnimalListSchema, type Animal } from './animalSchema.ts';

// REACT_APP_API_URL from .env
declare const process: { env: { REACT_APP_API_URL?: string } };

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

                const result = AnimalListSchema.safeParse(await response.json());
                if (!result.success) {
                    throw new Error('The species/:genus/:species endpoint did not return a list');
                }

                if (result.data.length === 0) throw new Error('Species not found.');
                setAnimal(result.data[0]);
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
                {!loading && !error && animal && <AnimalInfo {...animal} />}
            </main>
        </div>
    );
}
