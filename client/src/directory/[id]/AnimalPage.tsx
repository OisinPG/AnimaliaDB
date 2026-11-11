import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import Header from '../../Header.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import '../../App.css';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './AnimalPage.css';
import AnimalInfo from './info.tsx';

declare const process: { env: { REACT_APP_API_URL?: string } };

interface Animal {
    Species_Name: string;
    Genus_Name: string;
    Common_Name: string;
    Photo_URL: string | null;
    Size: string | null;
    Population: number | null;
    Conservation_Status: string | null;
    Description: string | null;
}

function isAnimal(value: unknown): value is Animal {
    return typeof value === 'object'
        && value !== null
        && 'Species_Name' in value
        && typeof value.Species_Name === 'string'
        && 'Genus_Name' in value
        && typeof value.Genus_Name === 'string'
        && 'Common_Name' in value
        && typeof value.Common_Name === 'string'
        && 'Photo_URL' in value
        && (typeof value.Photo_URL === 'string' || value.Photo_URL === null)
        && 'Size' in value
        && (typeof value.Size === 'string' || value.Size === null)
        && 'Population' in value
        && (typeof value.Population === 'number' || value.Population === null)
        && 'Conservation_Status' in value
        && (typeof value.Conservation_Status === 'string' || value.Conservation_Status === null)
        && 'Description' in value
        && (typeof value.Description === 'string' || value.Description === null);
}

export default function AnimalPage() {
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setAnimal(undefined);
        setError(null);
        setLoading(true);

        const loadAnimal = async () => {
            if (!id) {
                setError('Missing species id.');
                setLoading(false);
                return;
            }

            const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
            try {
                const response = await fetch(`${apiUrl}/species/${encodeURIComponent(id)}`, {
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`Request Failed: ${response.status}`);

                const rows: unknown = await response.json();
                if (!Array.isArray(rows) || !rows.every(isAnimal)) {
                    throw new Error('The species/:id endpoint did not return a list');
                }

                if (rows.length === 0) throw new Error('Species not found.');
                setAnimal(rows[0]);
            } catch (cause) {
                if (controller.signal.aborted) return;
                setError (cause instanceof Error ? cause.message : 'An unexpected error occurred.');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        void loadAnimal();
        return () => controller.abort();
    }, [id]);

    return (
        <div className="App">
            <Header />
            <main>
                <Link className="directory-back-link" to="/directory">Back to directory</Link>
                {loading && <p className="directory-message" role="status">Loading Animal...</p>}
                {error && <p className="directory-message is-error" role="alert">Unable to load species: {error}</p>}
                {!loading && !error && animal && <AnimalInfo {...animal} />}
            </main>
        </div>
    );
}
