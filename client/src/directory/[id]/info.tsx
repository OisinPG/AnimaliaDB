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

export default function AnimalInfo( data: Animal) {
    //TODO: Translate conservation status from abbreviations to full words
    //TODO: Include more info on animal taxonomy
    return (
        <article className="animal-detail">
            <h1 className="animal-detail-title">{data.Common_Name}</h1>
            <img className="animal-detail-image" src={data.Photo_URL ?? undefined} alt={data.Common_Name} />
            <ul className="animal-detail-facts">
                <li><span>Common Name</span><strong>{data.Common_Name}</strong></li>
                <li><span>Species Name</span><strong>{data.Species_Name}</strong></li>
                <li><span>Genus Name</span><strong>{data.Genus_Name}</strong></li>
                <li><span>Size</span><strong>{data.Size ?? '—'}</strong></li>
                <li><span>Population</span><strong>{data.Population ?? '—'}</strong></li>
                <li><span>Conservation Status</span><strong>{data.Conservation_Status ?? '—'}</strong></li>
            </ul>
            <p className="animal-detail-description">{data.Description}</p>
        </article>
    );
}