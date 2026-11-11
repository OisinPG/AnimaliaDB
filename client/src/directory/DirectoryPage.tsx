import { useState, useEffect } from 'react';
import Header from '../Header.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import '../App.css';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './Directory.css';
import JsonDataDisplay, { type Animal } from './Table.tsx';

declare const process: { env: { REACT_APP_API_URL?: string } };

function isFlag(value: unknown): value is 0 | 1 {
    return value === 0 || value === 1;
}

function isSpeciesApiRow(value: unknown): value is Animal {
    return typeof value === 'object'
        && value !== null
        && 'species_name' in value
        && typeof value.species_name === 'string'
        && 'genus_name' in value
        && typeof value.genus_name === 'string'
        && 'common_name' in value
        && (typeof value.common_name === 'string' || value.common_name === null)
        && 'triangle_eared' in value
        && isFlag(value.triangle_eared)
        && 'circle_eared' in value
        && isFlag(value.circle_eared)
        && 'big_eared' in value
        && isFlag(value.big_eared)
        && 'big_tail' in value
        && isFlag(value.big_tail)
        && 'weird' in value
        && isFlag(value.weird);
}

export default function DirectoryPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadAnimals = async () => {
            const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
            try {
                const response = await fetch(`${apiUrl}/species`, { signal: controller.signal });
                if (!response.ok) throw new Error(`Request failed: ${response.status}`);

                const rows: unknown = await response.json();
                if (!Array.isArray(rows) || !rows.every(isSpeciesApiRow)) {
                    throw new Error('The species endpoint did not return a list.');
                }

                setAnimals(rows);
            } catch (cause) {
                if (controller.signal.aborted) return;
                setError(cause instanceof Error ? cause.message : 'An unexpected error occurred.');
            } finally {
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
                <h1 className="directory-page-title">Species Directory</h1>
                {loading && <p className="directory-message" role="status">Loading species...</p>}
                {error && <p className="directory-message is-error" role="alert">Unable to load species: {error}</p>}
                {!loading && !error && <JsonDataDisplay data={animals} />}
            </main>
        </div>
    );
}