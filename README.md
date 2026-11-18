# Animal Database

Full stack animal species directory with searchable listings, tag-based filters, and individual species detail pages. Includes REST API edpoits for species data, taxonomic counts, and database health checks, backed by a relational MySQL schema covering taxonomy and species attributes. Also has a containerized database using Docker Compose and seed data already included.

THIS PROJECT IS STILL A WORK IN PROGRESS.

## Tech Stack

- Frontend - React + CSS
- Backend - REST API using Typescript + Express
- Database - Dockerized mySQL

# How to run

## Pre-reqs

You need to install Node.js and Docker Desktop. Make sure that Docker Desktop is running.

## Setting up the Environment Variables

If .gitignore is doing its job, you'll have to make the .env file. This is easy:

- Duplicate the `.env.example` file and change its name to `.env`
- You'll wanna replace the values `DB_USER`, `DB_PASSWORD`, and `DB_NAME` values. 
- Set a separate strong value for `MYSQL_ROOT_PASSWORD`.

## Docker Commands

Creates a custom MySQL image with the SQL files from `database/schema/` and `database/seeds/` copied into MySQL's initialization directory. This avoids Windows file-bind mount issues. Initialization only runs when Docker creates the database for the first time.

```powershell
docker compose up -d db
docker compose ps
```

Stops the container, while keeping its database data. It persists in the `mysql_data` Docker volume, so deleting that gets rid of the db and data.

```powershell
docker compose down
```

OPTIONAL: Check to see if Docker Desktop is running, and inspect the database logs

```powershell
docker compose logs db
```

## Starting the application

Make sure you install the dependencies first. SEE THE INSTALLING DEPENDENCIES SECTION BELOW.

This project runs in two terminals, from the project root.

In the first, start the backend API on port 8080:

```powershell
npm --prefix server run dev
```

In the second, start the React frontend dev server:

```powershell
npm --prefix client start
```

Often, the frontend will automatically open in your primary browser, but if it doesn't try opening it through http://localhost:3000

## Test database connection

With the API running, use another PowerShell terminal:

```powershell
Invoke-RestMethod http://localhost:8080/health
```

It should return:

```text
status   database
------   --------
ok       connected
```

If it reports the database is disconnected, use the above Docker Desktop command `docker compose logs db`

And type-check the server
```powershell
npm --prefix server test
```

## Installing dependencies

Run these commands from the project root

```powershell
npm --prefix server ci
npm --prefix client ci
```

## Command order of operations

Duplicate the .env.example and turn it into .env

Replace the .env values `DB_USER`, `DB_PASSWORD`, and `DB_NAME` values. Set a separate strong value for `MYSQL_ROOT_PASSWORD`

Install pre-reqs:
```powershell
npm --prefix server ci
npm --prefix client ci
```

Make the docker container:
```powershell
docker compose up -d db
docker compose ps
```

Running serverside - first terminal:
```powershell
npm --prefix server run dev
```

Running frontside - second terminal:
```powershell
npm --prefix client start
```

Health check:
```powershell
Invoke-RestMethod http://localhost:8080/health
```

Docker logs - Optional:
```powershell
docker compose logs db
```

NPM test - Optional:
```powershell
npm --prefix server test
```

Turn off the docker when done:
```powershell
docker compose down
```

# Adding a new tag

Adding a tag requires a database table, seed data, an API tag code, API record fields, and a frontend tag definition.

- Note: *Adding a species is similar*, but you skip steps 1, 3, and 4, and insert your species in the SPECIES table alongside all the other species in `database/seeds/003_taxonomy.sql`. You'll also need to add the species' genus, family, order, etc. if the table doesn't already contain it (the appropriate tables shouldn't be hard to find).

1. Add a tag table to `database/schema/002_tags.sql`. Use the existing tables as a template and make `Genus_Name, Species_Name` the primary key, with a foreign key to `SPECIES`.

2. Add an `INSERT INTO <TABLE_NAME> ...` block to `database/seeds/004_tags.sql`. Each row must reference an existing `(Genus_Name, Species_Name)` pair from `database/seeds/003_taxonomy.sql`.

3. Add the table and a short API code to `TAG_TABLES` in `server/index.ts`. For example:

```ts
const TAG_TABLES = {
    te: 'TRIANGLE_EARED',
    // Add: xy: 'NEW_TAG_TABLE',
} as const;
```

4. Add the tag to `TAG_FIELDS` in `client/src/Tag_Con.ts`:

```ts
'NEW-TAG': { api: 'xy', property: 'new_tag', label: 'New tag' },
```

`TAG_FIELDS` drives both tag filter controls and detail-page labels, so no additional frontend tag list is normally needed.

5. Tag changes also require rebuilding the database image. If this is a disposable development database, reset the Docker volume so MySQL reruns all initialization scripts:

```powershell
docker compose down -v
docker compose up --build -d db
docker compose ps
```

The `-v` option deletes the `mysql_data` volume and all database data. Do not use it for a database you need to preserve. For an existing database with preserved data, run the new schema and seed statements against MySQL manually instead, and rebuild/restart the application containers afterward.