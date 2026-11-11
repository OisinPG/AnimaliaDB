FROM mysql:8.4

COPY migrations/001_create.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY seeds/002_seed.sql /docker-entrypoint-initdb.d/02-seed.sql
