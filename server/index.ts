//so we can make API calls
import express from 'express';
//Cross origin resource sharing so the frontend can use this
import cors from 'cors';
//JS object returned by mysql2 when you run SELECT query
import type {RowDataPacket} from 'mysql2/promise';
//Connection pool to reuse connections rather than starting a new one every API call
import pool from './pool.js';


const app = express(); //Node.js Express application
const port = Number(process.env.PORT); //PORT api connects to
app.use(cors()); //Tells express to use CORS

// Configure tag tables here; their names also determine the API record fields.
const TAG_TABLES = {
    te: 'TRIANGLE_EARED',
    ce: 'CIRCLE_EARED',
    be: 'BIG_EARED',
    bt: 'BIG_TAIL',
    w: 'WEIRD',
    fl: 'FLUFFY',
} as const;

// SELECT statements done with all the tags in TAG_TABLES
const TAG_SELECTS = Object.entries(TAG_TABLES)
    .map(([tag, tableName]) => `(${tag}.Species_Name IS NOT NULL) AS ${tableName.toLowerCase()}`)
    .join(',\n');

// LEFT JOIN statements done with all the tags in TAG_TABLES
const TAG_JOINS = (
    sourceAlias: string = 's',
    tagsIncluded: string[] = Object.keys(TAG_TABLES),
): string =>
    Object.entries(TAG_TABLES)
        .filter(([tag]) => tagsIncluded.includes(tag))
        .map(([tag, tableName]) =>
            ` LEFT JOIN ${tableName} ${tag}
                ON ${tag}.Genus_Name = ${sourceAlias}.Genus_Name
                AND ${tag}.Species_Name = ${sourceAlias}.Species_Name`,
        )
        .join('');

const CONSERVATION_STATUSES = [
    'EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'CD', 'LC', 'DD', 'NE',
] as const;



//Parses incoming HTTP request bodies w/ JSON in them
app.use(express.json());

//Health Check - Makes sure db is connected
app.get('/health', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({status: 'ok', database: 'connected'});
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(503).json({status: 'error', database: 'disconnected'});
    }
});

//Gets counts of the rows in taxoomic tables
app.get('/count', async (_req, res) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT
                (SELECT COUNT(*) from SPECIES) as species_count,
                (SELECT COUNT(*) from GENUS) as genus_count,
                (SELECT COUNT(*) from FAMILY) as family_count,
                (SELECT COUNT(*) from TAXON_ORDER) as order_count,
                (SELECT COUNT(*) from CLASS) as class_count,
                (SELECT COUNT(*) from PHYLUM) as phylum_count;
            `);
            res.json(rows);
    } catch (error) {
        console.error('Species query failed:', error);
        res.status(500).json({error: 'Error on /test'});
    }
});

// Gets up to 20 random species, optionally filtered by tags and conservation status.
// Example: GET /random?tags=te,bt&conservationStatus=EN
app.get('/random', async (req, res) => {
    try {
        // Accept tags as a comma-separated query parameter
        const tagsQuery = req.query.tags;
        if (tagsQuery !== undefined && typeof tagsQuery !== 'string') {
            res.status(400).json({error: 'tags must be a comma-separated string'});
            return;
        }

        // Remove whitespace and duplicates before checking the requested tags
        const tagsIncluded = tagsQuery
            ? [...new Set(tagsQuery.split(',').map((tag) => tag.trim()).filter(Boolean))]
            : [];
        const validTags = Object.keys(TAG_TABLES);
        const invalidTags = tagsIncluded.filter((tag) => !validTags.includes(tag));
        if (invalidTags.length > 0) {
            res.status(400).json({
                error: `Invalid tags: ${invalidTags.join(', ')}`,
                validTags,
            });
            return;
        }

        // Only accept conservation-status codes defined by the database ENUM
        const statusQuery = req.query.conservationStatus;
        if (statusQuery !== undefined && typeof statusQuery !== 'string') {
            res.status(400).json({error: 'conservationStatus must be a single status code'});
            return;
        }
        if (statusQuery && !(CONSERVATION_STATUSES as readonly string[]).includes(statusQuery)) {
            res.status(400).json({
                error: `Invalid conservationStatus: ${statusQuery}`,
                validStatuses: CONSERVATION_STATUSES,
            });
            return;
        }

        // Each requested tag adds a presence check; together the filters require all criteria
        const filters = tagsIncluded
            .map((tag) => `${tag}.Species_Name IS NOT NULL`);
        // Bind user-provided values rather than interpolating them into the SQL
        const queryParams: string[] = [];
        if (statusQuery) {
            filters.push('s.Conservation_Status = ?');
            queryParams.push(statusQuery);
        }
        const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        // Join only the requested tag tables; with no tags, return random species unfiltered
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT s.Species_name AS Species_Name,
                   s.Genus_name AS Genus_Name,
                   s.Common_name AS Common_Name, 
                   s.Photo_URL AS Photo_URL, 
                   s.Description AS Description 
            FROM SPECIES s
            ${TAG_JOINS('s', tagsIncluded)}
            ${whereClause}
            ORDER BY RAND()
            LIMIT 20;
        `, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Random query failed:', error);
        res.status(500).json({error: 'error on /random'});
    }
});

//Get most of the information for all the species in our db
app.get('/species', async (_req, res) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT
                s.Species_Name AS species_name,
                s.Genus_Name AS genus_name,
                s.Common_Name AS common_name,
                (g.Common_Name) AS genus_common,
                s.Conservation_status AS conservation_status,
                ${TAG_SELECTS}
            FROM SPECIES s
            LEFT JOIN GENUS g
                ON g.Genus_Name = s.Genus_Name
            ${TAG_JOINS('s')};
            `);
            res.json(rows);
    } catch (error) {
        console.error('Species query failed:', error);
        res.status(500).json({error: 'Error on /species'});
    }
});

//Get all the information for a specific animal in the database
app.get('/species/:genus/:species', async (req, res) => {
    try {
        const { genus, species } = req.params;
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
                s.Species_Name AS Species_Name,
                s.Genus_Name AS Genus_Name,
                s.Common_Name AS Common_Name,
                ${TAG_SELECTS},
                s.Photo_URL AS Photo_URL,
                s.Size AS Size,
                s.Population AS Population,
                s.Conservation_Status AS Conservation_Status,
                s.Description AS Description,
                g.Common_Name AS Genus_Common,
                f.Family AS Family_Name,
                f.Common_Name AS Family_Common,
                o.Taxon_Order AS Order_Name,
                c.Class AS Class_Name,
                p.Phylum AS Phylum_Name,
                p.Kingdom AS Kingdom_Name
            FROM SPECIES s
            LEFT JOIN GENUS g
                ON g.Genus_Name = s.Genus_Name
            LEFT JOIN FAMILY f
                ON g.Family = f.Family
            LEFT JOIN TAXON_ORDER o
                ON f.Taxon_Order = o.Taxon_Order
            LEFT JOIN CLASS c
                ON o.Class = c.Class
            LEFT JOIN PHYLUM p
                ON c.Phylum = p.Phylum
            ${TAG_JOINS('s')}
            WHERE s.Species_Name = ? AND s.Genus_Name = ?;
        `, [species, genus]);
        res.json(rows);
    } catch (error) {
        console.error('Species genus/species query failed:', error);
        res.status(500).json({error: 'Error on /species/:genus/:species'})
    }
});

// Starts a web server and listens for connections on the given port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
