FROM mysql:8.4

COPY schema/001_taxonomy.sql /docker-entrypoint-initdb.d/01-taxonomy.sql
COPY schema/002_tags.sql /docker-entrypoint-initdb.d/02-tags.sql
COPY seeds/003_taxonomy.sql /docker-entrypoint-initdb.d/03-taxonomy.sql
COPY seeds/004_tags.sql /docker-entrypoint-initdb.d/04-tags.sql
