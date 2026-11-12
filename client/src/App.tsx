// For using state variables
import { useState, useEffect } from 'react';
// So that we can use <Link> to route between pages client-side
import { Route, Routes } from 'react-router-dom';
import { z } from 'zod';
// Header that goes on top every page
import Header from './Header.tsx';
// Directory Page that displays the db
import DirectoryPage from './directory/DirectoryPage.tsx';
// Animal page that shows animal information
import AnimalPage from './directory/[id]/AnimalPage.tsx';
// About page that explains more about the app itself
import AboutPage from './about/AboutPage.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './App.css';

// Gets REACT_APP_API_URL from .env
declare const process: { env: { REACT_APP_API_URL?: string } };

const CountsSchema = z.object({
    species_count: z.number().int().nonnegative(),
    genus_count: z.number().int().nonnegative(),
    family_count: z.number().int().nonnegative(),
    order_count: z.number().int().nonnegative(),
    class_count: z.number().int().nonnegative(),
    phylum_count: z.number().int().nonnegative(),
});
const CountsListSchema = z.array(CountsSchema);
type Counts = z.infer<typeof CountsSchema>;

// Top-level component in React. Handles Routes to all the other pages
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/directory/:genus/:species" element={<AnimalPage />} />
            <Route path="/random" element={<PlaceholderPage title="Random" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<PlaceholderPage title="Page not found" />} />
        </Routes>
    );
}


//Home Page, the first thing someone'll see
function HomePage() {
    //State variable for the counts of rows in the tables
    const [counts, setCounts] = useState<Counts | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Doesn't load the counts until the page is loaded
    useEffect(() => {
        const loadCounts = async () => {
            //Making call to backend through GET /count
            const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
            try {
                const response = await fetch(`${apiUrl}/count`);
                if (!response.ok) throw new Error(`Request Failed: ${response.status}`);

                const result = CountsListSchema.safeParse(await response.json());
                if (!result.success) throw new Error('The count endpoint returned invalid data.');

                setCounts(result.data[0] ?? null);
            } catch (cause) {
                setError(cause instanceof Error ? cause.message : 'An unexpected error occurred.');
            }
        };

        void loadCounts();
    }, []);

    return (
        <div className="App">
            <Header />
            <main>
                {/* Cards for all the counts */}
                <section className="counts-section" aria-labelledby="counts-heading">
                    <h1 id="counts-heading">Taxonomic Counts</h1>
                    {error && <p role="alert">Unable to load counts: {error}</p>}
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
                {/* Filler paragraph */}
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

// Placeholder for when I haven't finished a page
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
