-- TABLE CREATION
CREATE TABLE PHYLUM (
    Phylum        VARCHAR(50) UNIQUE NOT NULL,
    Kingdom        VARCHAR(50) NOT NULL,
    PRIMARY KEY(Phylum),
	CHECK (Phylum <> '')
);

CREATE TABLE CLASS (
    Class        VARCHAR(50) UNIQUE NOT NULL,
    Phylum        VARCHAR(50) NOT NULL,
    PRIMARY KEY(Class),
    FOREIGN KEY (Phylum) REFERENCES PHYLUM(Phylum)
	ON DELETE RESTRICT
    ON UPDATE CASCADE,
	CHECK (Class <> '')
);

CREATE TABLE TAXON_ORDER (
    Taxon_Order    VARCHAR(50) UNIQUE NOT NULL,
    Class        VARCHAR(50) NOT NULL,
    PRIMARY KEY(Taxon_Order),
    FOREIGN KEY (Class) REFERENCES CLASS(Class)
	ON DELETE RESTRICT
    ON UPDATE CASCADE,
	CHECK (Taxon_Order <> '')
);

CREATE TABLE FAMILY (
    Family        VARCHAR(50) UNIQUE NOT NULL,
    Taxon_Order   VARCHAR(50) NOT NULL,
    Common_Name   VARCHAR(50) NULL,
    PRIMARY KEY(Family),
    FOREIGN KEY (Taxon_Order) REFERENCES TAXON_ORDER(Taxon_Order)
	ON DELETE RESTRICT
    ON UPDATE CASCADE,
	CHECK (Family <> '')
);

CREATE TABLE GENUS (
    Genus_Name    VARCHAR(50) UNIQUE NOT NULL,
    Family        VARCHAR(50) NOT NULL,
    Common_Name   VARCHAR(50) NULL,
    PRIMARY KEY(Genus_Name),
    FOREIGN KEY (Family) REFERENCES FAMILY(Family)
	ON DELETE RESTRICT
    ON UPDATE CASCADE,
	CHECK (Genus_Name <> '')
);

CREATE TABLE SPECIES (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name        VARCHAR(50) NOT NULL,
    Common_Name        VARCHAR(50) NOT NULL,
    Photo_URL        TEXT NULL,
    Size            ENUM('Small', 'Medium', 'Large', 'varies') NULL,
    Population        BIGINT NULL,
    Conservation_Status    ENUM('EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'CD', 'LC', 'DD', 'NE') NULL,
    Description        TEXT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY (Genus_Name) REFERENCES GENUS(Genus_Name)
	ON DELETE RESTRICT
    ON UPDATE CASCADE,
	
	CHECK (Population >= 0 AND
         Species_Name <> '')
);

-- Tags
CREATE TABLE TRIANGLE_EARED (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE CIRCLE_EARED (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BIG_EARED (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BIG_TAIL (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE WEIRD (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);