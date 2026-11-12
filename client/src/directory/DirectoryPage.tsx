// For using state variables
import { useState, useEffect } from 'react';
// Header at top
import Header from '../Header.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import '../App.css';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './Directory.css';
// The table which displays all the animals in the database
import JsonDataDisplay from './Table.tsx';
// Zod-parsed const and type for each species
import { SpeciesListSchema, type Animal } from './speciesSchema.ts';

// Getting REACT_APP_API_URL from .env
declare const process: { env: { REACT_APP_API_URL?: string } };

export default function DirectoryPage() {
    // Animals we're displaying
    const [animals, setAnimals] = useState<Animal[]>([]);
    // If we're loading
    const [loading, setLoading] = useState(true);
    // If we had trouble loading the animals
    const [error, setError] = useState<string | null>(null);

    // Wait until the page is loaded
    useEffect(() => {
        // Lets us cancel an API request
        const controller = new AbortController();

        // Using the AbortController, we fetch the animals through GET /species
        const loadAnimals = async () => {
            const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
            try {
                const response = await fetch(`${apiUrl}/species`, { signal: controller.signal });
                if (!response.ok) throw new Error(`Request failed: ${response.status}`);

                const result = SpeciesListSchema.safeParse(await response.json());
                if (!result.success) {
                    throw new Error('The species endpoint did not return a list.');
                }

                setAnimals(result.data);
            } catch (cause) {
                // We fail to get the animals
                if (controller.signal.aborted) return;
                setError(cause instanceof Error ? cause.message : 'An unexpected error occurred.');
            } finally {
                // We're done loading
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        void loadAnimals();

        return () => controller.abort();
    }, []);

    return (
        <div className="App">
            <Header />
            <main>
                {/* Page Title */}
                <h1 className="directory-page-title">Species Directory</h1>
                {/* Loading text */}
                {loading && <p className="directory-message" role="status">Loading species...</p>}
                {/* Error text */}
                {error && <p className="directory-message is-error" role="alert">Unable to load species: {error}</p>}
                {/* Animal Table */}
                {!loading && !error && <JsonDataDisplay data={animals} />}
            </main>
        </div>
    );
}