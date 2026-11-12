-- Ears
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

-- Tail
CREATE TABLE BIG_TAIL (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Etc
CREATE TABLE WEIRD (
    Species_Name    VARCHAR(50) NOT NULL,
    Genus_Name      VARCHAR(50) NOT NULL,
    PRIMARY KEY(Genus_Name, Species_Name),
    FOREIGN KEY(Genus_Name, Species_Name) REFERENCES SPECIES(Genus_Name, Species_Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
