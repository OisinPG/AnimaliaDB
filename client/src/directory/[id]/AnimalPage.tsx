import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { z } from 'zod';
import Header from '../../Header.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import '../../App.css';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './AnimalPage.css';
import AnimalInfo from './info.tsx';

declare const process: { env: { REACT_APP_API_URL?: string } };

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

type Animal = z.infer<typeof AnimalSchema>;

const isAnimal = (value: unknown): value is Animal => AnimalSchema.safeParse(value).success;

export default function AnimalPage() {
    const { genus, species } = useParams<{ genus: string; species: string }>();
    const [animal, setAnimal] = useState<Animal>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setAnimal(undefined);
        setError(null);
        setLoading(true);

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
                if (controller.signal.aborted) return;
                setError (cause instanceof Error ? cause.message : 'An unexpected error occurred.');
            } finally {
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
                <Link className="directory-back-link" to="/directory">Back to directory</Link>
                {loading && <p className="directory-message" role="status">Loading Animal...</p>}
                {error && <p className="directory-message is-error" role="alert">Unable to load species: {error}</p>}
                {!loading && !error && animal && <AnimalInfo {...animal} />}
            </main>
        </div>
    );
}
