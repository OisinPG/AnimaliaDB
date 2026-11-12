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
                (te.Species_Name IS NOT NULL) AS triangle_eared,
                (ce.Species_Name IS NOT NULL) AS circle_eared,
                (be.Species_Name IS NOT NULL) AS big_eared,
                (bt.Species_Name IS NOT NULL) AS big_tail,
                (w.Species_Name IS NOT NULL) AS weird
            FROM SPECIES s
            LEFT JOIN GENUS g
                ON g.Genus_Name = s.Genus_Name
            LEFT JOIN TRIANGLE_EARED te
                ON te.Genus_Name = s.Genus_Name
            AND te.Species_Name = s.Species_Name
            LEFT JOIN CIRCLE_EARED ce
                ON ce.Genus_Name = s.Genus_Name
            AND ce.Species_Name = s.Species_Name
            LEFT JOIN BIG_EARED be
                ON be.Genus_Name = s.Genus_Name
            AND be.Species_Name = s.Species_Name
            LEFT JOIN BIG_TAIL bt
                ON bt.Genus_Name = s.Genus_Name
            AND bt.Species_Name = s.Species_Name
            LEFT JOIN WEIRD w
                ON w.Genus_Name = s.Genus_Name
            AND w.Species_Name = s.Species_Name;
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
                (te.Species_Name IS NOT NULL) AS triangle_eared,
                (ce.Species_Name IS NOT NULL) AS circle_eared,
                (be.Species_Name IS NOT NULL) AS big_eared,
                (bt.Species_Name IS NOT NULL) AS big_tail,
                (w.Species_Name IS NOT NULL) AS weird,
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
            LEFT JOIN TRIANGLE_EARED te
                ON te.Genus_Name = s.Genus_Name
            AND te.Species_Name = s.Species_Name
            LEFT JOIN CIRCLE_EARED ce
                ON ce.Genus_Name = s.Genus_Name
            AND ce.Species_Name = s.Species_Name
            LEFT JOIN BIG_EARED be
                ON be.Genus_Name = s.Genus_Name
            AND be.Species_Name = s.Species_Name
            LEFT JOIN BIG_TAIL bt
                ON bt.Genus_Name = s.Genus_Name
            AND bt.Species_Name = s.Species_Name
            LEFT JOIN WEIRD w
                ON w.Genus_Name = s.Genus_Name
            AND w.Species_Name = s.Species_Name
            WHERE s.Species_Name = '${species}' AND s.Genus_Name = '${genus}';
        `);
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
