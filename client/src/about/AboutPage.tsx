import Header from '../Header.tsx';
//@ts-ignore
import '../App.css';

export default function AboutPage() {
    return (
        <div className = "app">
            <Header />
            <main>
                <h1>AnimaliaDB</h1>
                <h2>Credits</h2>
                <p> This project was made by me, <b>Oisin Perkins-Gilbert</b>. The mySQL code was
                    developed by myself and fellow students at <b>University of Washington Tacoma</b>,
                    I've asked them if I can credit them, but since they haven't responded yet
                    I will not put them here without their permission. I used tutorials
                    from <a href="https://medium.com/">https://medium.com/</a> to help me get started 
                    (as well as for helping make the table in the DB directory page). <b>VSCode Copilot</b>  
                    was used, mainly for debugging, style changes, and 
                    annoying busy work (like when I changed the
                    schema and had to change how a bunch of the front/back end worked). 
                </p>
                <h2>About</h2>
                <p> Animal Database containing information on animals and their phylum, class,
                    order, family, genus, species, common name, size, population (sometimes),
                    conservation status, and description. You can browse our database directory
                    to see a table of the entries in our database. You can then click on an entry
                    within that table to find out more information on the animal you want.
                </p>
                <h2>Tech Stack</h2>
                <ul>
                    <li><b>Frontend</b> - React + CSS</li>
                    <li><b>Backend</b> - Typescript + Express</li>
                    <li><b>Database</b> - Dockerized mySQL</li>
                </ul>
                <p> The client will make API GET calls to the backend, which will then fetch data
                    from the mySQL database.
                </p>
            </main>
        </div>
    );
}
