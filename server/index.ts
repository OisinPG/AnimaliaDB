import express from 'express';
import cors from 'cors';
import type {RowDataPacket} from 'mysql2/promise';
import pool from './pool.js';

const app = express();
const port = Number(process.env.PORT);
app.use(cors());

app.use(express.json());

app.get('/health', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({status: 'ok', database: 'connected'});
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(503).json({status: 'error', database: 'disconnected'});
    }
});

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

app.get('/species', async (_req, res) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT
                s.Species_Name AS species_name,
                s.Genus_Name AS genus_name,
                s.Common_Name AS common_name,
                (te.Species_Name IS NOT NULL) AS triangle_eared,
                (ce.Species_Name IS NOT NULL) AS circle_eared,
                (be.Species_Name IS NOT NULL) AS big_eared,
                (bt.Species_Name IS NOT NULL) AS big_tail,
                (w.Species_Name IS NOT NULL) AS weird
            FROM SPECIES s
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

app.get('/species/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT * from SPECIES where Species_Name = '${id}'
            `);
        res.json(rows);
    } catch (error) {
        console.error('Species id query failed:', error);
        res.status(500).json({error: 'Error on /species/:id'})
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
