import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header.tsx';
import DirectoryPage from './directory/DirectoryPage.tsx';
import AnimalPage from './directory/[id]/AnimalPage.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './App.css';

declare const process: { env: { REACT_APP_API_URL?: string } };

interface Counts {
    species_count: number;
    genus_count: number;
    family_count: number;
    order_count: number;
    class_count: number;
    phylum_count: number;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/directory/:genus/:species" element={<AnimalPage />} />
            <Route path="/random" element={<PlaceholderPage title="Random" />} />
            <Route path="/about" element={<PlaceholderPage title="About" />} />
            <Route path="*" element={<PlaceholderPage title="Page not found" />} />
        </Routes>
    );
}

function HomePage() {
    const [counts, setCounts] = useState<Counts | null>(null);

    useEffect(() => {
        const loadCounts = async () => {
            const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
            const response = await fetch(`${apiUrl}/count`);
            if (!response.ok) throw new Error(`Request Failed: ${response.status}`);

            const rows: Counts[] = await response.json();
            setCounts(rows[0] ?? null);
        };

        void loadCounts();
    }, []);

    return (
        <div className="App">
            <Header />
            <main>
                <section className="counts-section" aria-labelledby="counts-heading">
                    <h1 id="counts-heading">Taxonomic Counts</h1>
                    {counts && (
                        <div className="counts-grid">
                            <article className="count-card">
                                <span className="count-label">Species</span>
                                <span className="count-value">{counts.species_count}</span>
                            </article>
                            <article className="count-card">
                                <span className="count-label">Genera</span>
                                <span className="count-value">{counts.genus_count}</span>
                            </article>
                            <article className="count-card">
                                <span className="count-label">Families</span>
                                <span className="count-value">{counts.family_count}</span>
                            </article>
                            <article className="count-card">
                                <span className="count-label">Orders</span>
                                <span className="count-value">{counts.order_count}</span>
                            </article>
                            <article className="count-card">
                                <span className="count-label">Classes</span>
                                <span className="count-value">{counts.class_count}</span>
                            </article>
                            <article className="count-card">
                                <span className="count-label">Phyla</span>
                                <span className="count-value">{counts.phylum_count}</span>
                            </article>
                        </div>
                    )}
                </section>
                <section>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Eius error suscipit quam, dolore sed distinctio amet. 
                        Expedita exercitationem, ullam harum, ipsa consequuntur provident, 
                        ratione beatae aliquam tempora quisquam cumque corporis!</p>
                </section>
            </main>
        </div>
    );
}

function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="App">
            <Header />
            <main>
                <h1>{title}</h1>
                <p>This is a placeholder while I work on the actual thing</p>
            </main>
        </div>
    );
}
